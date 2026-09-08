import { ORPCError } from '@orpc/server'
import { z } from 'zod'

import {
  createScheduleSchema,
  scheduleSchema,
  updateScheduleSchema,
} from '@/features/schedules/validation/schemas'
import { prisma } from '@/lib/db'
import { authProcedure } from '@/orpc/procedures'

import type { Prisma } from '../../../prisma/generated/client'

const include = {
  items: {
    orderBy: { weekday: 'asc' },
    include: {
      workout: { select: { id: true, name: true, isActive: true } },
      _count: { select: { workoutSessions: true } },
    },
  },
} satisfies Prisma.ScheduleInclude

export default {
  list: authProcedure
    .route({
      method: 'GET',
      path: '/schedules',
      tags: ['Schedules'],
      summary: 'List schedules',
    })
    .output(z.array(scheduleSchema))
    .handler(({ context }) => {
      return prisma.schedule.findMany({
        where: { userId: context.user.id },
        include,
      })
    }),
  get: authProcedure
    .route({
      method: 'GET',
      path: '/schedules/{id}',
      tags: ['Schedules'],
      summary: 'Get schedule',
    })
    .input(z.object({ id: z.string().min(1) }))
    .output(scheduleSchema)
    .handler(async ({ input, context }) => {
      const schedule = await prisma.schedule.findFirst({
        where: { id: input.id, userId: context.user.id },
        include,
      })
      if (!schedule) throw new ORPCError('NOT_FOUND')
      return schedule
    }),
  create: authProcedure
    .route({
      method: 'POST',
      path: '/schedules',
      tags: ['Schedules'],
      summary: 'Create schedule',
      successStatus: 201,
    })
    .input(createScheduleSchema)
    .output(scheduleSchema)
    .handler(({ input, context }) => {
      return mutateSchedule(async (tx) => {
        if (input.items.some((item) => item.id)) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Uma nova programação não deve informar identificadores.',
          })
        }

        await validateWorkouts(tx, input, context.user.id)
        if (input.isActive) {
          await tx.schedule.updateMany({
            where: { userId: context.user.id, isActive: true },
            data: { isActive: false },
          })
        }

        return tx.schedule.create({
          data: {
            userId: context.user.id,
            name: input.name,
            description: input.description.trim() || null,
            isActive: input.isActive,
            items: {
              create: input.items.map((item) => ({
                workoutId: item.workoutId,
                weekday: item.weekday,
              })),
            },
          },
          include,
        })
      })
    }),
  update: authProcedure
    .route({
      method: 'PATCH',
      path: '/schedules/{id}',
      tags: ['Schedules'],
      summary: 'Update schedule',
    })
    .input(updateScheduleSchema)
    .output(scheduleSchema)
    .handler(({ input, context }) => {
      return mutateSchedule(async (tx) => {
        const schedule = await tx.schedule.findFirst({
          where: { id: input.id, userId: context.user.id },
          include,
        })
        if (!schedule) throw new ORPCError('NOT_FOUND')

        const existingItems = new Map(
          schedule.items.map((item) => [item.id, item]),
        )
        const submittedItems = new Map(
          input.items.flatMap((item) =>
            item.id ? [[item.id, item] as const] : [],
          ),
        )
        if (
          input.items.some((item) => item.id && !existingItems.has(item.id))
        ) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'Dia inválido para esta programação.',
          })
        }
        for (const item of schedule.items) {
          const submitted = submittedItems.get(item.id)
          if (
            item._count.workoutSessions > 0 &&
            (!submitted || submitted.workoutId !== item.workoutId)
          ) {
            throw new ORPCError('CONFLICT', {
              message:
                'Dias com histórico de treinos não podem ser removidos nem ter o treino alterado.',
            })
          }
        }

        await validateWorkouts(tx, input, context.user.id, existingItems)
        if (input.isActive) {
          await tx.schedule.updateMany({
            where: {
              userId: context.user.id,
              isActive: true,
              id: { not: schedule.id },
            },
            data: { isActive: false },
          })
        }

        await tx.scheduleItem.deleteMany({
          where: {
            scheduleId: schedule.id,
            id: { notIn: [...submittedItems.keys()] },
          },
        })

        return tx.schedule.update({
          where: { id: schedule.id, userId: context.user.id },
          data: {
            name: input.name,
            description: input.description.trim() || null,
            isActive: input.isActive,
            items: {
              update: input.items.flatMap((item) =>
                item.id
                  ? [
                      {
                        where: { id: item.id },
                        data: {
                          workoutId: item.workoutId,
                          weekday: item.weekday,
                        },
                      },
                    ]
                  : [],
              ),
              create: input.items.flatMap((item) =>
                item.id
                  ? []
                  : [{ workoutId: item.workoutId, weekday: item.weekday }],
              ),
            },
          },
          include,
        })
      })
    }),
}

async function validateWorkouts(
  tx: Prisma.TransactionClient,
  input: z.infer<typeof createScheduleSchema>,
  userId: string,
  existingItems = new Map<string, { workoutId: string }>(),
) {
  const workoutIds = [...new Set(input.items.map((item) => item.workoutId))]
  const workouts = await tx.workout.findMany({
    where: { id: { in: workoutIds }, userId },
    select: { id: true, isActive: true },
  })
  if (workouts.length !== workoutIds.length) {
    throw new ORPCError('BAD_REQUEST', {
      message: 'Selecione apenas treinos da sua conta.',
    })
  }
  const activeIds = new Set(
    workouts.filter((workout) => workout.isActive).map((workout) => workout.id),
  )
  if (
    input.items.some(
      (item) =>
        !activeIds.has(item.workoutId) &&
        (input.isActive ||
          !item.id ||
          existingItems.get(item.id)?.workoutId !== item.workoutId),
    )
  ) {
    throw new ORPCError('BAD_REQUEST', {
      message:
        'Use treinos ativos para os dias de treino ou ative a programação.',
    })
  }
}

async function mutateSchedule<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  try {
    return await prisma.$transaction(operation, {
      isolationLevel: 'Serializable',
    })
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error.code === 'P2002' ||
        error.code === 'P2003' ||
        error.code === 'P2034')
    ) {
      throw new ORPCError('CONFLICT', {
        message:
          'A programação ou seus treinos foram alterados. Atualize e tente novamente.',
      })
    }
    throw error
  }
}
