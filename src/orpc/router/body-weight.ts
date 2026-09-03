import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import {
  bodyWeightSchema,
  createBodyWeightSchema,
  updateBodyWeightSchema,
} from '@/features/body-weight/validation/schemas'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

const id = bodyWeightSchema.pick({ id: true })

const listBodyWeight = authProcedure
  .route({
    method: 'GET',
    path: '/body-weight',
    tags: ['Body weight'],
    summary: 'List body weight logs',
  })
  .input(z.undefined())
  .output(z.array(bodyWeightSchema))
  .handler(({ context }) => {
    return prisma.bodyWeightLog.findMany({
      where: { userId: context.user.id },
      orderBy: { measuredAt: 'desc' },
    })
  })

const getBodyWeight = authProcedure
  .route({
    method: 'GET',
    path: '/body-weight/{id}',
    tags: ['Body weight'],
    summary: 'Get body weight log',
  })
  .input(id)
  .output(bodyWeightSchema)
  .handler(async ({ input, context }) => {
    const bodyWeight = await prisma.bodyWeightLog.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
    })

    if (!bodyWeight) {
      throw new ORPCError('NOT_FOUND')
    }

    return bodyWeight
  })

const createBodyWeight = authProcedure
  .route({
    method: 'POST',
    path: '/body-weight',
    tags: ['Body weight'],
    summary: 'Create body weight log',
    successStatus: 201,
  })
  .input(createBodyWeightSchema)
  .output(bodyWeightSchema)
  .handler(({ input, context }) => {
    return prisma.bodyWeightLog.create({
      data: {
        measuredAt: new Date(input.measuredAt),
        weight: input.weight,
        notes: emptyToNull(input.notes),
        userId: context.user.id,
      },
    })
  })

const updateBodyWeight = authProcedure
  .route({
    method: 'PATCH',
    path: '/body-weight/{id}',
    tags: ['Body weight'],
    summary: 'Update body weight log',
  })
  .input(updateBodyWeightSchema)
  .output(bodyWeightSchema)
  .handler(async ({ input, context }) => {
    const bodyWeight = await prisma.bodyWeightLog.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
      select: { id: true },
    })

    if (!bodyWeight) {
      throw new ORPCError('NOT_FOUND')
    }

    return prisma.bodyWeightLog.update({
      where: { id: bodyWeight.id },
      data: {
        measuredAt: new Date(input.measuredAt),
        weight: input.weight,
        notes: emptyToNull(input.notes),
      },
    })
  })

const deleteBodyWeight = authProcedure
  .route({
    method: 'DELETE',
    path: '/body-weight/{id}',
    tags: ['Body weight'],
    summary: 'Delete body weight log',
  })
  .input(id)
  .output(id)
  .handler(async ({ input, context }) => {
    const bodyWeight = await prisma.bodyWeightLog.findFirst({
      where: {
        id: input.id,
        userId: context.user.id,
      },
      select: { id: true },
    })

    if (!bodyWeight) {
      throw new ORPCError('NOT_FOUND')
    }

    await prisma.bodyWeightLog.delete({
      where: { id: bodyWeight.id },
    })

    return bodyWeight
  })

function emptyToNull(value?: string) {
  return value?.trim() ? value.trim() : null
}

export default {
  list: listBodyWeight,
  get: getBodyWeight,
  create: createBodyWeight,
  update: updateBodyWeight,
  delete: deleteBodyWeight,
}
