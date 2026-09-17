import { CheckCircle2Icon, CheckIcon, ChevronDownIcon } from 'lucide-react'
import { toast } from 'sonner'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { decimalOnly, digitsOnly } from '@/lib/input-masks'
import { cn } from '@/lib/utils'

import { useWorkoutSessionMutations } from '../hooks/use-workout-session-mutations'
import type { WorkoutSessionExercise } from '../validation/workout-session-exercise.entity'
import { sessionExerciseFormOptions } from '../validation/workout-session-exercise.form'

type SessionExerciseCardProps = {
  exercise: WorkoutSessionExercise
  readOnly: boolean
  onSaved: () => void
}

export function SessionExerciseCard({ exercise, readOnly, onSaved }: SessionExerciseCardProps) {
  const { updateSessionExercise } = useWorkoutSessionMutations()

  const form = useAppForm({
    ...sessionExerciseFormOptions(exercise),
    onSubmit: async ({ value }) => {
      await updateSessionExercise(value)
      toast.success(`${exercise.exercise.name} atualizado`)
      onSaved()
    },
  })

  const target = formatTarget(exercise)
  const last = exercise.lastPerformed
  const lastSets = last?.actualSets != null ? `Última: ${last.actualSets}` : undefined
  const lastReps = last?.actualReps != null ? `Última: ${last.actualReps}` : undefined
  const lastWeight = last?.actualWeight ? `Última: ${last.actualWeight} kg` : undefined
  const lastRpe = last?.rpe ? `Última: ${last.rpe}` : undefined

  return (
    <form.Subscribe selector={(state) => [state.values.completed, state.isSubmitting] as const}>
      {([completed, isSubmitting]) => (
        <AccordionItem
          value={exercise.id}
          data-completed={completed || undefined}
          className="data-completed:bg-primary/5"
        >
          <AccordionTrigger>
            <span className="flex flex-1 flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {completed && <CheckCircle2Icon className="text-primary size-3.5" />}
                {exercise.exercise.name}
              </span>
              {target && <span className="text-muted-foreground text-xs">Alvo: {target}</span>}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {readOnly ? (
              <p className="text-sm">
                {exercise.actualSets ?? '—'} séries x {exercise.actualReps ?? '—'} reps
                {exercise.actualWeight ? ` · ${exercise.actualWeight} kg` : ''}
                {exercise.rpe ? ` · RPE ${exercise.rpe}` : ''}
              </p>
            ) : (
              <form
                onSubmit={(ev) => {
                  ev.preventDefault()
                  form.handleSubmit()
                }}
              >
                <FieldGroup>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    <form.AppField name="actualSets">
                      {({ InputField }) => (
                        <InputField
                          label="Séries"
                          inputMode="numeric"
                          type="number"
                          mask={digitsOnly}
                          description={lastSets}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="actualReps">
                      {({ InputField }) => (
                        <InputField label="Reps" inputMode="numeric" mask={digitsOnly} description={lastReps} />
                      )}
                    </form.AppField>
                    <form.AppField name="actualWeight">
                      {({ StepperField }) => (
                        <StepperField
                          label="Peso"
                          inputMode="decimal"
                          mask={decimalOnly}
                          step={2.5}
                          description={lastWeight}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="rpe">
                      {({ InputField }) => (
                        <InputField label="RPE" inputMode="decimal" mask={decimalOnly} description={lastRpe} />
                      )}
                    </form.AppField>
                  </div>
                  <Field>
                    <Collapsible>
                      <CollapsibleTrigger className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                        Adicionar anotação
                        <ChevronDownIcon className="size-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <form.AppField name="notes">
                          {({ TextareaField }) => <TextareaField label="Notas" rows={2} />}
                        </form.AppField>
                      </CollapsibleContent>
                    </Collapsible>
                  </Field>
                  <Field>
                    <Button
                      type="button"
                      variant={completed ? 'default' : 'outline'}
                      aria-pressed={completed}
                      loading={isSubmitting}
                      onClick={() => {
                        form.setFieldValue('completed', !completed)
                      }}
                    >
                      <span
                        className={cn(
                          'flex size-3.5 items-center justify-center rounded-[3px] border',
                          completed ? 'border-primary-foreground bg-primary-foreground text-primary' : 'border-current',
                        )}
                      >
                        {completed && <CheckIcon className="size-3" />}
                      </span>
                      Concluído
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
    </form.Subscribe>
  )
}

function formatTarget(exercise: WorkoutSessionExercise) {
  const sets =
    exercise.plannedSetsMin && exercise.plannedSetsMax
      ? `${exercise.plannedSetsMin}-${exercise.plannedSetsMax} séries`
      : null
  const reps =
    exercise.plannedRepsMin && exercise.plannedRepsMax
      ? `${exercise.plannedRepsMin}-${exercise.plannedRepsMax} reps`
      : null
  const weight = exercise.plannedWeight ? `${exercise.plannedWeight} kg` : null
  return [sets, reps, weight].filter(Boolean).join(' x ') || null
}
