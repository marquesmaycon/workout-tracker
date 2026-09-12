import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import {
  createWorkoutSchema,
  updateWorkoutSchema,
  workoutSchema,
} from '@/features/workouts/validation/workout.entity'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

import type { Prisma } from '../../../prisma/generated/client'

const id = workoutSchema.pick({ id: true })

const include = {
  exercises: {
    orderBy: { orderIndex: 'asc' },
    include: { exercise: { select: { id: true, name: true } } },
  },
} satisfies Prisma.WorkoutInclude

type WorkoutWithExercises = Prisma.WorkoutGetPayload<{ include: typeof include }>

function serializeWorkout(workout: WorkoutWithExercises) {
  return {
    ...workout,
    exercises: workout.exercises.map((exercise) => ({
      ...exercise,
      targetWeight: exercise.targetWeight?.toString() ?? null,
    })),
  }
}

const listWorkouts = authProcedure
  .route({
    method: 'GET',
    path: '/workouts',
    tags: ['Workouts'],
    summary: 'List workouts',
  })
  .input(z.object({ isActive: z.boolean().optional() }).optional())
  .output(z.array(workoutSchema))
  .handler(async ({ input, context }) => {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: context.user.id,
        isActive: input?.isActive,
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
      include,
    })
    return workouts.map(serializeWorkout)
  })

const getWorkout = authProcedure
  .route({
    method: 'GET',
    path: '/workouts/{id}',
    tags: ['Workouts'],
    summary: 'Get workout',
  })
  .input(id)
  .output(workoutSchema)
  .handler(async ({ input, context }) => {
    const workout = await prisma.workout.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
      include,
    })

    if (!workout) {
      throw new ORPCError('NOT_FOUND')
    }

    return serializeWorkout(workout)
  })

const createWorkout = authProcedure
  .route({
    method: 'POST',
    path: '/workouts',
    tags: ['Workouts'],
    summary: 'Create workout',
    successStatus: 201,
  })
  .input(createWorkoutSchema)
  .output(workoutSchema)
  .handler(({ input, context }) => {
    return mutateWorkout(async () => {
      const workout = await prisma.workout.create({
        data: {
          name: input.name,
          description: emptyToNull(input.description),
          isActive: input.isActive ?? true,
          userId: context.user.id,
          exercises: {
            create: input.exercises.map((exercise, index) =>
              toWorkoutExerciseData(exercise, index),
            ),
          },
        },
        include,
      })
      return serializeWorkout(workout)
    })
  })

const updateWorkout = authProcedure
  .route({
    method: 'PATCH',
    path: '/workouts/{id}',
    tags: ['Workouts'],
    summary: 'Update workout',
  })
  .input(updateWorkoutSchema)
  .output(workoutSchema)
  .handler(async ({ input, context }) => {
    const workout = await prisma.workout.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
      select: { id: true },
    })

    if (!workout) {
      throw new ORPCError('NOT_FOUND')
    }

    return mutateWorkout(async () => {
      const updated = await prisma.$transaction(async (tx) => {
        await tx.workoutExercise.deleteMany({
          where: { workoutId: workout.id },
        })

        return tx.workout.update({
          where: { id: workout.id },
          data: {
            name: input.name,
            description: emptyToNull(input.description),
            isActive: input.isActive,
            exercises: {
              create: input.exercises.map((exercise, index) =>
                toWorkoutExerciseData(exercise, index),
              ),
            },
          },
          include,
        })
      })
      return serializeWorkout(updated)
    })
  })

const deleteWorkout = authProcedure
  .route({
    method: 'DELETE',
    path: '/workouts/{id}',
    tags: ['Workouts'],
    summary: 'Delete workout',
  })
  .input(id)
  .output(id)
  .handler(async ({ input, context }) => {
    const workout = await prisma.workout.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
      select: { id: true },
    })

    if (!workout) {
      throw new ORPCError('NOT_FOUND')
    }

    try {
      await prisma.workout.delete({ where: { id: workout.id } })
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2003') {
        throw new ORPCError('CONFLICT', {
          message:
            'Este treino está em uso em uma programação ou sessão. Desative-o em vez de excluí-lo.',
        })
      }
      throw error
    }

    return workout
  })

function toWorkoutExerciseData(
  exercise: z.infer<typeof createWorkoutSchema>['exercises'][number],
  index: number,
) {
  return {
    exerciseId: exercise.exerciseId,
    orderIndex: index,
    targetSetsMin: toInt(exercise.targetSetsMin),
    targetSetsMax: toInt(exercise.targetSetsMax),
    targetRepsMin: toInt(exercise.targetRepsMin),
    targetRepsMax: toInt(exercise.targetRepsMax),
    targetWeight: exercise.targetWeight?.trim() || null,
    restSeconds: toInt(exercise.restSeconds),
    notes: exercise.notes?.trim() || null,
  }
}

function toInt(value?: string) {
  return value?.trim() ? Number(value) : null
}

function emptyToNull(value?: string | null) {
  return value?.trim() ? value.trim() : null
}

async function mutateWorkout<T>(operation: () => Promise<T>) {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      throw new ORPCError('BAD_REQUEST', {
        message: 'Exercício inválido.',
      })
    }
    throw error
  }
}

export default {
  list: listWorkouts,
  get: getWorkout,
  create: createWorkout,
  update: updateWorkout,
  delete: deleteWorkout,
}
