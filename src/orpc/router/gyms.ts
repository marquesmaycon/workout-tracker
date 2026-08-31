import { ORPCError, os } from '@orpc/server'
import { z } from 'zod'

import { CreateGymSchema, GymSchema, UpdateGymSchema } from '#/orpc/schema'
import { auth } from '#/lib/auth'
import { prisma } from '#/lib/db'

const IdSchema = GymSchema.pick({ id: true })

const authed = os
  .$context<{ headers: Headers }>()
  .use(async ({ context: { headers }, next }) => {
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new ORPCError('UNAUTHORIZED')
    }

    return next({ context: { userId: session.user.id } })
  })

const listGyms = authed
  .route({
    method: 'GET',
    path: '/gyms',
    tags: ['Gyms'],
    summary: 'List gyms',
  })
  .input(z.object({ favorite: z.boolean().optional() }).optional())
  .output(z.array(GymSchema))
  .handler(({ input, context }) => {
    return prisma.gym.findMany({
      where: {
        userId: context.userId,
        favorite: input?.favorite,
      },
      orderBy: [{ favorite: 'desc' }, { name: 'asc' }],
    })
  })

const getGym = authed
  .route({
    method: 'GET',
    path: '/gyms/{id}',
    tags: ['Gyms'],
    summary: 'Get gym',
  })
  .input(IdSchema)
  .output(GymSchema)
  .handler(async ({ input, context }) => {
    const gym = await prisma.gym.findFirst({
      where: {
        id: input.id,
        userId: context.userId,
      },
    })

    if (!gym) {
      throw new ORPCError('NOT_FOUND')
    }

    return gym
  })

const createGym = authed
  .route({
    method: 'POST',
    path: '/gyms',
    tags: ['Gyms'],
    summary: 'Create gym',
    successStatus: 201,
  })
  .input(CreateGymSchema)
  .output(GymSchema)
  .handler(({ input, context }) => {
    return prisma.gym.create({
      data: {
        name: input.name,
        favorite: input.favorite ?? false,
        userId: context.userId,
      },
    })
  })

const updateGym = authed
  .route({
    method: 'PATCH',
    path: '/gyms/{id}',
    tags: ['Gyms'],
    summary: 'Update gym',
  })
  .input(UpdateGymSchema)
  .output(GymSchema)
  .handler(async ({ input, context }) => {
    const gym = await prisma.gym.findFirst({
      where: {
        id: input.id,
        userId: context.userId,
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

const deleteGym = authed
  .route({
    method: 'DELETE',
    path: '/gyms/{id}',
    tags: ['Gyms'],
    summary: 'Delete gym',
  })
  .input(IdSchema)
  .output(IdSchema)
  .handler(async ({ input, context }) => {
    const gym = await prisma.gym.findFirst({
      where: {
        id: input.id,
        userId: context.userId,
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