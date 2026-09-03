import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import {
  createWorkoutSchema,
  updateWorkoutSchema,
  workoutSchema,
} from '@/features/workouts/validation/schemas'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

const id = workoutSchema.pick({ id: true })

const listWorkouts = authProcedure
  .route({
    method: 'GET',
    path: '/workouts',
    tags: ['Workouts'],
    summary: 'List workouts',
  })
  .input(z.object({ isActive: z.boolean().optional() }).optional())
  .output(z.array(workoutSchema))
  .handler(({ input, context }) => {
    return prisma.workout.findMany({
      where: {
        userId: context.user.id,
        isActive: input?.isActive,
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    })
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
    })

    if (!workout) {
      throw new ORPCError('NOT_FOUND')
    }

    return workout
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
    return prisma.workout.create({
      data: {
        name: input.name,
        description: emptyToNull(input.description),
        isActive: input.isActive ?? true,
        userId: context.user.id,
      },
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
  .handler(async ({ input, context, path }) => {
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

    return prisma.workout.update({
      where: { id: workout.id },
      data: {
        name: input.name,
        description: emptyToNull(input.description),
        isActive: input.isActive,
      },
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

    await prisma.workout.delete({
      where: { id: workout.id },
    })

    return workout
  })

function emptyToNull(value?: string | null) {
  return value?.trim() ? value.trim() : null
}

export default {
  list: listWorkouts,
  get: getWorkout,
  create: createWorkout,
  update: updateWorkout,
  delete: deleteWorkout,
}
