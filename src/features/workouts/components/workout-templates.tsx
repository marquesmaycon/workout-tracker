import { useSuspenseQuery } from '@tanstack/react-query'
import { LayoutTemplate } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { orpc } from '@/orpc/client'

import type {WorkoutTemplate} from '../data/workout-templates';
import {
  buildExerciseIdsByName,
  buildTemplateExercises,
  normalizeName,
  WORKOUT_TEMPLATES
} from '../data/workout-templates'
import type { WorkoutExerciseFormSchema } from '../validation/workout-exercise.form'

const exercisesQuery = orpc.exercises.list.queryOptions()

export type WorkoutTemplateSelection = {
  template: WorkoutTemplate
  exercises: WorkoutExerciseFormSchema[]
}

type WorkoutTemplatesProps = {
  disabled?: boolean
  onSelect: (selection: WorkoutTemplateSelection) => void
}

export function WorkoutTemplates({ disabled, onSelect }: WorkoutTemplatesProps) {
  const { data: exercises } = useSuspenseQuery(exercisesQuery)
  const exerciseIdsByName = buildExerciseIdsByName(exercises)

  return (
    <section className="grid gap-3">
      <div className="grid gap-1">
        <h2 className="font-heading flex items-center gap-2 text-sm font-medium">
          <LayoutTemplate aria-hidden="true" className="size-4" />
          Templates sugeridos
        </h2>
        <p className="text-muted-foreground text-xs/relaxed">
          Escolha uma combinação para preencher o treino automaticamente. Você
          pode ajustar tudo antes de salvar.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WORKOUT_TEMPLATES.map((template) => {
          const total = template.exercises.length
          const available = template.exercises.filter((item) =>
            exerciseIdsByName.has(normalizeName(item.name)),
          ).length

          return (
            <li key={template.id}>
              <button
                type="button"
                disabled={disabled || available === 0}
                onClick={() =>
                  onSelect({
                    template,
                    exercises: buildTemplateExercises(
                      template,
                      exerciseIdsByName,
                    ),
                  })
                }
                className="bg-card text-card-foreground ring-foreground/10 hover:ring-primary focus-visible:ring-ring flex h-full w-full flex-col gap-2 p-3 text-left text-xs/relaxed ring-1 transition-shadow outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="font-heading text-sm font-medium">
                  {template.name}
                </span>
                <span className="text-muted-foreground">
                  {template.description}
                </span>
                <span className="flex flex-wrap gap-1">
                  {template.muscleGroups.map((group) => (
                    <Badge key={group} variant="secondary">
                      {group}
                    </Badge>
                  ))}
                </span>
                <span className="text-muted-foreground mt-auto">
                  {available === total
                    ? `${total} exercícios`
                    : `${available} de ${total} exercícios disponíveis`}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
