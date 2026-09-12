import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import {
  startWorkoutSessionSchema,
  todayWorkoutSchema,
  workoutSessionSchema,
} from '@/features/workout-sessions/validation/workout-session.entity'
import { updateSessionExerciseSchema } from '@/features/workout-sessions/validation/workout-session-exercise.form'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

import type { Prisma } from '../../../prisma/generated/client'

const id = z.object({ id: z.string().min(1) })

const include = {
  workout: { select: { id: true, name: true } },
  gym: { select: { id: true, name: true } },
  exercises: {
    orderBy: { orderIndex: 'asc' },
    include: { exercise: { select: { id: true, name: true } } },
  },
} satisfies Prisma.WorkoutSessionInclude

type WorkoutSessionWithExercises = Prisma.WorkoutSessionGetPayload<{
  include: typeof include
}>

type LastPerformance = {
  actualSets: number | null
  actualReps: number | null
  actualWeight: string | null
  rpe: string | null
  completedAt: Date | null
}

async function getLastPerformanceByExercise(
  session: WorkoutSessionWithExercises,
) {
  const exerciseIds = [...new Set(session.exercises.map((e) => e.exerciseId))]
  if (exerciseIds.length === 0) return new Map<string, LastPerformance>()

  const rows = await prisma.workoutSessionExercise.findMany({
    where: {
      exerciseId: { in: exerciseIds },
      workoutSessionId: { not: session.id },
      completed: true,
      workoutSession: { userId: session.userId, status: 'COMPLETED' },
    },
    distinct: ['exerciseId'],
    orderBy: [{ workoutSession: { startedAt: 'desc' } }],
    select: {
      exerciseId: true,
      actualSets: true,
      actualReps: true,
      actualWeight: true,
      rpe: true,
      completedAt: true,
    },
  })

  return new Map(
    rows.map((row) => [
      row.exerciseId,
      {
        actualSets: row.actualSets,
        actualReps: row.actualReps,
        actualWeight: row.actualWeight?.toString() ?? null,
        rpe: row.rpe?.toString() ?? null,
        completedAt: row.completedAt,
      },
    ]),
  )
}

async function serializeSession(session: WorkoutSessionWithExercises) {
  const lastByExercise = await getLastPerformanceByExercise(session)
  return {
    ...session,
    exercises: session.exercises.map((exercise) => ({
      ...exercise,
      plannedWeight: exercise.plannedWeight?.toString() ?? null,
      actualWeight: exercise.actualWeight?.toString() ?? null,
      rpe: exercise.rpe?.toString() ?? null,
      lastPerformed: lastByExercise.get(exercise.exerciseId) ?? null,
    })),
  }
}

function getTodayWeekday() {
  return ((new Date().getDay() + 6) % 7) + 1
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function subDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() - days)
  return d
}

const getCurrentSession = authProcedure
  .route({
    method: 'GET',
    path: '/workout-sessions/current',
    tags: ['Workout sessions'],
    summary: 'Get in-progress workout session',
  })
  .output(workoutSessionSchema.nullable())
  .handler(async ({ context }) => {
    const session = await prisma.workoutSession.findFirst({
      where: { userId: context.user.id, status: 'IN_PROGRESS' },
      include,
    })
    return session ? await serializeSession(session) : null
  })

const getTodayWorkout = authProcedure
  .route({
    method: 'GET',
    path: '/workout-sessions/today',
    tags: ['Workout sessions'],
    summary: "Get today's scheduled workout",
  })
  .output(todayWorkoutSchema.nullable())
  .handler(async ({ context }) => {
    const items = await prisma.scheduleItem.findMany({
      where: { schedule: { userId: context.user.id, isActive: true } },
      include: {
        workout: { select: { id: true, name: true, isActive: true } },
        workoutSessions: {
          where: { status: 'COMPLETED' },
          orderBy: { finishedAt: 'desc' },
          take: 1,
        },
      },
    })

    const today = startOfDay(new Date())
    const todayWeekday = getTodayWeekday()

    let best: { item: (typeof items)[number]; daysSince: number } | null =
      null

    for (const item of items) {
      if (!item.workout.isActive) continue

      const daysSince = (todayWeekday - item.weekday + 7) % 7
      const dueDate = subDays(today, daysSince)
      if (dueDate < startOfDay(item.createdAt)) continue

      const lastCompleted = item.workoutSessions[0]?.finishedAt
      const isDone = lastCompleted && startOfDay(lastCompleted) >= dueDate
      if (isDone) continue

      if (!best || daysSince > best.daysSince) best = { item, daysSince }
    }

    if (!best) return null
    return { scheduleItemId: best.item.id, workout: best.item.workout }
  })

const startWorkoutSession = authProcedure
  .route({
    method: 'POST',
    path: '/workout-sessions',
    tags: ['Workout sessions'],
    summary: 'Start a workout session',
    successStatus: 201,
  })
  .input(startWorkoutSessionSchema)
  .output(workoutSessionSchema)
  .handler(({ input, context }) => {
    return prisma.$transaction(
      async (tx) => {
        const existing = await tx.workoutSession.findFirst({
          where: { userId: context.user.id, status: 'IN_PROGRESS' },
          select: { id: true },
        })
        if (existing) {
          throw new ORPCError('CONFLICT', {
            message: 'Você já tem um treino em andamento.',
          })
        }

        const workout = await tx.workout.findFirst({
          where: {
            id: input.workoutId,
            userId: context.user.id,
            isActive: true,
          },
          include: { exercises: { orderBy: { orderIndex: 'asc' } } },
        })
        if (!workout) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Selecione um treino ativo da sua conta.',
          })
        }

        let scheduleItemId: string | undefined
        if (input.scheduleItemId) {
          const scheduleItem = await tx.scheduleItem.findFirst({
            where: {
              id: input.scheduleItemId,
              workoutId: workout.id,
              schedule: { userId: context.user.id },
            },
            select: { id: true },
          })
          if (!scheduleItem) {
            throw new ORPCError('BAD_REQUEST', {
              message: 'Dia da programação inválido.',
            })
          }
          scheduleItemId = scheduleItem.id
        }

        const session = await tx.workoutSession.create({
          data: {
            userId: context.user.id,
            workoutId: workout.id,
            scheduleItemId,
            exercises: {
              create: workout.exercises.map((exercise) => ({
                exerciseId: exercise.exerciseId,
                workoutExerciseId: exercise.id,
                orderIndex: exercise.orderIndex,
                plannedSetsMin: exercise.targetSetsMin,
                plannedSetsMax: exercise.targetSetsMax,
                plannedRepsMin: exercise.targetRepsMin,
                plannedRepsMax: exercise.targetRepsMax,
                plannedWeight: exercise.targetWeight,
              })),
            },
          },
          include,
        })
        return await serializeSession(session)
      },
      { isolationLevel: 'Serializable' },
    )
  })

const getSession = authProcedure
  .route({
    method: 'GET',
    path: '/workout-sessions/{id}',
    tags: ['Workout sessions'],
    summary: 'Get workout session',
  })
  .input(id)
  .output(workoutSessionSchema)
  .handler(async ({ input, context }) => {
    const session = await prisma.workoutSession.findFirst({
      where: { id: input.id, userId: context.user.id },
      include,
    })
    if (!session) throw new ORPCError('NOT_FOUND')
    return await serializeSession(session)
  })

const updateSessionExercise = authProcedure
  .route({
    method: 'PATCH',
    path: '/workout-sessions/exercises/{id}',
    tags: ['Workout sessions'],
    summary: 'Log a session exercise',
  })
  .input(updateSessionExerciseSchema)
  .output(workoutSessionSchema)
  .handler(async ({ input, context }) => {
    const exercise = await prisma.workoutSessionExercise.findFirst({
      where: { id: input.id, workoutSession: { userId: context.user.id } },
      include: { workoutSession: { select: { id: true, status: true } } },
    })
    if (!exercise) throw new ORPCError('NOT_FOUND')
    if (exercise.workoutSession.status !== 'IN_PROGRESS') {
      throw new ORPCError('CONFLICT', {
        message: 'Esta sessão de treino já foi encerrada.',
      })
    }

    await prisma.workoutSessionExercise.update({
      where: { id: exercise.id },
      data: {
        actualSets: toInt(input.actualSets),
        actualReps: toInt(input.actualReps),
        actualWeight: input.actualWeight?.trim() || null,
        rpe: input.rpe?.trim() || null,
        notes: emptyToNull(input.notes),
        completed: input.completed,
        completedAt: input.completed ? new Date() : null,
      },
    })

    const session = await prisma.workoutSession.findFirstOrThrow({
      where: { id: exercise.workoutSession.id },
      include,
    })
    return await serializeSession(session)
  })

const finishWorkoutSession = authProcedure
  .route({
    method: 'PATCH',
    path: '/workout-sessions/{id}/finish',
    tags: ['Workout sessions'],
    summary: 'Finish a workout session',
  })
  .input(id)
  .output(workoutSessionSchema)
  .handler(({ input, context }) =>
    endSession(input.id, context.user.id, 'COMPLETED'),
  )

const cancelWorkoutSession = authProcedure
  .route({
    method: 'PATCH',
    path: '/workout-sessions/{id}/cancel',
    tags: ['Workout sessions'],
    summary: 'Cancel a workout session',
  })
  .input(id)
  .output(workoutSessionSchema)
  .handler(({ input, context }) =>
    endSession(input.id, context.user.id, 'CANCELLED'),
  )

async function endSession(
  sessionId: string,
  userId: string,
  status: 'COMPLETED' | 'CANCELLED',
) {
  const session = await prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, status: true },
  })
  if (!session) throw new ORPCError('NOT_FOUND')
  if (session.status !== 'IN_PROGRESS') {
    throw new ORPCError('CONFLICT', {
      message: 'Esta sessão de treino já foi encerrada.',
    })
  }

  const updated = await prisma.workoutSession.update({
    where: { id: session.id },
    data: { status, finishedAt: new Date() },
    include,
  })
  return await serializeSession(updated)
}

function toInt(value?: string) {
  return value?.trim() ? Number(value) : null
}

function emptyToNull(value?: string) {
  return value?.trim() ? value.trim() : null
}

export default {
  current: getCurrentSession,
  today: getTodayWorkout,
  start: startWorkoutSession,
  get: getSession,
  updateExercise: updateSessionExercise,
  finish: finishWorkoutSession,
  cancel: cancelWorkoutSession,
}
