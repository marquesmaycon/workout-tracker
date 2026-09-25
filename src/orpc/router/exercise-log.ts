import { exerciseLogPageSchema } from '@/features/exercise-log/validation/exercise-log.entity'
import type { ExerciseLogSearch } from '@/features/exercise-log/validation/exercise-log.search'
import { exerciseLogSearchSchema } from '@/features/exercise-log/validation/exercise-log.search'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

import type { Prisma } from '../../../prisma/generated/client'

const listExerciseLog = authProcedure
  .route({
    method: 'GET',
    path: '/exercise-log',
    tags: ['Exercise log'],
    summary: 'List completed exercise records',
  })
  .input(exerciseLogSearchSchema)
  .output(exerciseLogPageSchema)
  .handler(async ({ input, context }) => {
    const where = buildWhere(input, context.user.id)

    const [rows, total] = await prisma.$transaction([
      prisma.workoutSessionExercise.findMany({
        where,
        orderBy: buildOrderBy(input),
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
        include: {
          exercise: { select: { id: true, name: true } },
          gym: { select: { id: true, name: true } },
          workoutSession: {
            select: {
              startedAt: true,
              gym: { select: { id: true, name: true } },
              workout: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.workoutSessionExercise.count({ where }),
    ])

    return {
      items: rows.map((row) => ({
        id: row.id,
        workoutSessionId: row.workoutSessionId,
        date: row.completedAt ?? row.workoutSession.startedAt,
        actualSets: row.actualSets,
        actualReps: row.actualReps,
        actualWeight: row.actualWeight?.toString() ?? null,
        rpe: row.rpe?.toString() ?? null,
        notes: row.notes,
        exercise: row.exercise,
        workout: row.workoutSession.workout,
        gym: row.gym ?? row.workoutSession.gym,
      })),
      total,
      page: input.page,
      pageSize: input.pageSize,
      pageCount: Math.ceil(total / input.pageSize),
    }
  })

function buildWhere(input: ExerciseLogSearch, userId: string): Prisma.WorkoutSessionExerciseWhereInput {
  return {
    completed: true,
    exerciseId: input.exerciseId,
    workoutSessionId: input.workoutSessionId,
    workoutSession: {
      userId,
      status: 'COMPLETED',
      workoutId: input.workoutId,
      startedAt: {
        gte: input.from ? startOfDay(input.from) : undefined,
        lt: input.to ? addDays(startOfDay(input.to), 1) : undefined,
      },
    },
    // A record may carry its own gym or inherit the session's one.
    OR: input.gymId ? [{ gymId: input.gymId }, { gymId: null, workoutSession: { gymId: input.gymId } }] : undefined,
  }
}

function buildOrderBy(input: ExerciseLogSearch): Prisma.WorkoutSessionExerciseOrderByWithRelationInput[] {
  if (input.sort === 'date') {
    return [{ workoutSession: { startedAt: input.order } }, { orderIndex: 'asc' }]
  }

  return [{ [input.sort]: { sort: input.order, nulls: 'last' } }, { id: 'asc' }]
}

function startOfDay(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`)
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default {
  list: listExerciseLog,
}
