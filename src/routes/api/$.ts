import '@/polyfill'

import { SmartCoercionPlugin } from '@orpc/json-schema'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { createFileRoute } from '@tanstack/react-router'

import { bodyWeightSchema } from '@/features/body-weight/validation/schemas'
import {
  exerciseSchema,
  exerciseWithMuscleGroupsSchema,
} from '@/features/exercises/validation/schemas'
import { gymSchema } from '@/features/gyms/validation/schemas'
import { muscleGroupSchema } from '@/features/muscle-groups/validation/schemas'
import { workoutSchema } from '@/features/workouts/validation/schemas'
import router from '@/orpc/router'

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'TanStack ORPC Playground',
          version: '1.0.0',
        },
        commonSchemas: {
          BodyWeight: { schema: bodyWeightSchema },
          Exercise: { schema: exerciseSchema },
          ExerciseWithMuscleGroups: { schema: exerciseWithMuscleGroupsSchema },
          Gym: { schema: gymSchema },
          MuscleGroup: { schema: muscleGroupSchema },
          UndefinedError: { error: 'UndefinedError' },
          Workout: { schema: workoutSchema },
        },
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
      },
      docsConfig: {
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: 'default-token',
            },
          },
        },
      },
    }),
  ],
})

async function handle({ request }: { request: Request }) {
  const { response } = await handler.handle(request, {
    prefix: '/api',
    context: {
      headers: request.headers,
    },
  })

  return response ?? new Response('Not Found', { status: 404 })
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})
