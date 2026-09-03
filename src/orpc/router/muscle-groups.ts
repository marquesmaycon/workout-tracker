import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import {
  createMuscleGroupSchema,
  muscleGroupSchema,
  updateMuscleGroupSchema,
} from '@/features/muscle-groups/validation/schemas'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

const id = muscleGroupSchema.pick({ id: true })

const listMuscleGroups = authProcedure
  .route({
    method: 'GET',
    path: '/muscle-groups',
    tags: ['Muscle groups'],
    summary: 'List muscle groups',
  })
  .input(z.undefined())
  .output(z.array(muscleGroupSchema))
  .handler(() => {
    return prisma.muscleGroup.findMany({
      orderBy: { name: 'asc' },
    })
  })

const getMuscleGroup = authProcedure
  .route({
    method: 'GET',
    path: '/muscle-groups/{id}',
    tags: ['Muscle groups'],
    summary: 'Get muscle group',
  })
  .input(id)
  .output(muscleGroupSchema)
  .handler(async ({ input }) => {
    const muscleGroup = await prisma.muscleGroup.findUnique({
      where: { id: input.id },
    })

    if (!muscleGroup) {
      throw new ORPCError('NOT_FOUND')
    }

    return muscleGroup
  })

const createMuscleGroup = authProcedure
  .route({
    method: 'POST',
    path: '/muscle-groups',
    tags: ['Muscle groups'],
    summary: 'Create muscle group',
    successStatus: 201,
  })
  .input(createMuscleGroupSchema)
  .output(muscleGroupSchema)
  .handler(({ input }) => {
    return prisma.muscleGroup.create({
      data: { name: input.name },
    })
  })

const updateMuscleGroup = authProcedure
  .route({
    method: 'PATCH',
    path: '/muscle-groups/{id}',
    tags: ['Muscle groups'],
    summary: 'Update muscle group',
  })
  .input(updateMuscleGroupSchema)
  .output(muscleGroupSchema)
  .handler(async ({ input }) => {
    const muscleGroup = await prisma.muscleGroup.findUnique({
      where: { id: input.id },
      select: { id: true },
    })

    if (!muscleGroup) {
      throw new ORPCError('NOT_FOUND')
    }

    return prisma.muscleGroup.update({
      where: { id: muscleGroup.id },
      data: { name: input.name },
    })
  })

const deleteMuscleGroup = authProcedure
  .route({
    method: 'DELETE',
    path: '/muscle-groups/{id}',
    tags: ['Muscle groups'],
    summary: 'Delete muscle group',
  })
  .input(id)
  .output(id)
  .handler(async ({ input }) => {
    const muscleGroup = await prisma.muscleGroup.findUnique({
      where: { id: input.id },
      select: { id: true },
    })

    if (!muscleGroup) {
      throw new ORPCError('NOT_FOUND')
    }

    await prisma.muscleGroup.delete({
      where: { id: muscleGroup.id },
    })

    return muscleGroup
  })

export default {
  list: listMuscleGroups,
  get: getMuscleGroup,
  create: createMuscleGroup,
  update: updateMuscleGroup,
  delete: deleteMuscleGroup,
}
