import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import { authProcedure } from '#/orpc/procedures'
import { prisma } from '#/lib/db'
import {
  createGymSchema,
  gymSchema,
  updateGymSchema,
} from '#/features/gyms/validation/schemas'

const id = gymSchema.pick({ id: true })

const listGyms = authProcedure
  .route({
    method: 'GET',
    path: '/gyms',
    tags: ['Gyms'],
    summary: 'List gyms',
  })
  .input(z.object({ favorite: z.boolean().optional() }).optional())
  .output(z.array(gymSchema))
  .handler(({ input, context }) => {
    return prisma.gym.findMany({
      where: {
        userId: context.user.id,
        favorite: input?.favorite,
      },
      orderBy: [{ favorite: 'desc' }, { name: 'asc' }],
    })
  })

const getGym = authProcedure
  .route({
    method: 'GET',
    path: '/gyms/{id}',
    tags: ['Gyms'],
    summary: 'Get gym',
  })
  .input(id)
  .output(gymSchema)
  .handler(async ({ input, context }) => {
    const gym = await prisma.gym.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
    })

    if (!gym) {
      throw new ORPCError('NOT_FOUND')
    }

    return gym
  })

const createGym = authProcedure
  .route({
    method: 'POST',
    path: '/gyms',
    tags: ['Gyms'],
    summary: 'Create gym',
    successStatus: 201,
  })
  .input(createGymSchema)
  .output(gymSchema)
  .handler(({ input, context }) => {
    return prisma.gym.create({
      data: {
        name: input.name,
        favorite: input.favorite ?? false,
        userId: context.user.id,
      },
    })
  })

const updateGym = authProcedure
  .route({
    method: 'PATCH',
    path: '/gyms/{id}',
    tags: ['Gyms'],
    summary: 'Update gym',
  })
  .input(updateGymSchema)
  .output(gymSchema)
  .handler(async ({ input, context }) => {
    const gym = await prisma.gym.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
      select: { id: true },
    })

    if (!gym) {
      throw new ORPCError('NOT_FOUND')
    }

    return prisma.gym.update({
      where: { id: gym.id },
      data: {
        name: input.name,
        favorite: input.favorite,
      },
    })
  })

const deleteGym = authProcedure
  .route({
    method: 'DELETE',
    path: '/gyms/{id}',
    tags: ['Gyms'],
    summary: 'Delete gym',
  })
  .input(id)
  .output(id)
  .handler(async ({ input, context }) => {
    const gym = await prisma.gym.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
      select: { id: true },
    })

    if (!gym) {
      throw new ORPCError('NOT_FOUND')
    }

    await prisma.gym.delete({
      where: { id: gym.id },
    })

    return gym
  })

export default {
  list: listGyms,
  get: getGym,
  create: createGym,
  update: updateGym,
  delete: deleteGym,
}
