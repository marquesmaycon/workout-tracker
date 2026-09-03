import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import {
  createExerciseSchema,
  exerciseSchema,
  exerciseWithMuscleGroupsSchema,
  updateExerciseSchema,
} from '@/features/exercises/validation/schemas'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

const id = exerciseSchema.pick({ id: true })

const listExercises = authProcedure
  .route({
    method: 'GET',
    path: '/exercises',
    tags: ['Exercises'],
    summary: 'List exercises',
  })
  .input(z.undefined())
  .output(z.array(exerciseWithMuscleGroupsSchema))
  .handler(() => {
    return prisma.exercise.findMany({
      include: {
        muscleGroups: {
          include: { muscleGroup: true },
          orderBy: { isPrimary: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    })
  })

const getExercise = authProcedure
  .route({
    method: 'GET',
    path: '/exercises/{id}',
    tags: ['Exercises'],
    summary: 'Get exercise',
  })
  .input(id)
  .output(exerciseWithMuscleGroupsSchema)
  .handler(async ({ input }) => {
    const exercise = await prisma.exercise.findUnique({
      where: { id: input.id },
      include: {
        muscleGroups: {
          include: { muscleGroup: true },
          orderBy: { isPrimary: 'desc' },
        },
      },
    })

    if (!exercise) {
      throw new ORPCError('NOT_FOUND')
    }

    return exercise
  })

const createExercise = authProcedure
  .route({
    method: 'POST',
    path: '/exercises',
    tags: ['Exercises'],
    summary: 'Create exercise',
    successStatus: 201,
  })
  .input(createExerciseSchema)
  .output(exerciseWithMuscleGroupsSchema)
  .handler(({ input }) => {
    assertPrimaryMuscleGroup(input.muscleGroupIds, input.primaryMuscleGroupId)

    return prisma.exercise.create({
      data: {
        name: input.name,
        description: emptyToNull(input.description),
        instructions: emptyToNull(input.instructions),
        videoUrl: emptyToNull(input.videoUrl),
        muscleGroups: {
          create: uniqueIds(input.muscleGroupIds).map((muscleGroupId) => ({
            muscleGroupId,
            isPrimary: muscleGroupId === input.primaryMuscleGroupId,
          })),
        },
      },
      include: {
        muscleGroups: {
          include: { muscleGroup: true },
          orderBy: { isPrimary: 'desc' },
        },
      },
    })
  })

const updateExercise = authProcedure
  .route({
    method: 'PATCH',
    path: '/exercises/{id}',
    tags: ['Exercises'],
    summary: 'Update exercise',
  })
  .input(updateExerciseSchema)
  .output(exerciseWithMuscleGroupsSchema)
  .handler(async ({ input }) => {
    assertPrimaryMuscleGroup(input.muscleGroupIds, input.primaryMuscleGroupId)

    const exercise = await prisma.exercise.findUnique({
      where: { id: input.id },
      select: { id: true },
    })

    if (!exercise) {
      throw new ORPCError('NOT_FOUND')
    }

    return prisma.$transaction(async (tx) => {
      await tx.exerciseMuscleGroup.deleteMany({
        where: { exerciseId: exercise.id },
      })

      return tx.exercise.update({
        where: { id: exercise.id },
        data: {
          name: input.name,
          description: emptyToNull(input.description),
          instructions: emptyToNull(input.instructions),
          videoUrl: emptyToNull(input.videoUrl),
          muscleGroups: {
            create: uniqueIds(input.muscleGroupIds).map((muscleGroupId) => ({
              muscleGroupId,
              isPrimary: muscleGroupId === input.primaryMuscleGroupId,
            })),
          },
        },
        include: {
          muscleGroups: {
            include: { muscleGroup: true },
            orderBy: { isPrimary: 'desc' },
          },
        },
      })
    })
  })

const deleteExercise = authProcedure
  .route({
    method: 'DELETE',
    path: '/exercises/{id}',
    tags: ['Exercises'],
    summary: 'Delete exercise',
  })
  .input(id)
  .output(id)
  .handler(async ({ input }) => {
    const exercise = await prisma.exercise.findUnique({
      where: { id: input.id },
      select: { id: true },
    })

    if (!exercise) {
      throw new ORPCError('NOT_FOUND')
    }

    await prisma.exercise.delete({
      where: { id: exercise.id },
    })

    return exercise
  })

function assertPrimaryMuscleGroup(
  muscleGroupIds: string[],
  primaryMuscleGroupId: string,
) {
  if (!muscleGroupIds.includes(primaryMuscleGroupId)) {
    throw new ORPCError('BAD_REQUEST')
  }
}

function emptyToNull(value?: string) {
  return value?.trim() ? value.trim() : null
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids))
}

export default {
  list: listExercises,
  get: getExercise,
  create: createExercise,
  update: updateExercise,
  delete: deleteExercise,
}
