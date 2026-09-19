import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { decimalOnly, digitsOnly } from '@/lib/input-masks'
import { cn } from '@/lib/utils'

import { useWorkoutSessionMutations } from '../hooks/use-workout-session-mutations'
import type { WorkoutSessionExercise } from '../validation/workout-session-exercise.entity'
import type { SessionExerciseFormSchema } from '../validation/workout-session-exercise.form'
import { sessionExerciseFormOptions, updateSessionExerciseSchema } from '../validation/workout-session-exercise.form'

const AUTO_SAVE_DELAY_MS = 1500

type SessionExerciseCardProps = {
  exercise: WorkoutSessionExercise
  onSaved: () => void
}

export function SessionExerciseCard({ exercise, onSaved }: SessionExerciseCardProps) {
  const { updateSessionExercise } = useWorkoutSessionMutations()
  const savedCompleted = useRef(exercise.completed)

  const save = async (value: SessionExerciseFormSchema) => {
    try {
      await updateSessionExercise(value)
      if (value.completed !== savedCompleted.current) {
        savedCompleted.current = value.completed
        toast.success(`${exercise.exercise.name} ${value.completed ? 'concluído' : 'reaberto'}`)
      }
      onSaved()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível salvar o exercício.')
    }
  }

  const debouncedSave = useDebouncedCallback(save, AUTO_SAVE_DELAY_MS)

  const form = useAppForm({
    ...sessionExerciseFormOptions(exercise),
    onSubmit: ({ value }) => save(value),
    listeners: {
      // Salva progresso parcial direto na mutation, sem passar pelos validators de submit
      onChange: ({ formApi }) => debouncedSave(formApi.state.values),
    },
  })

  const last = exercise.lastPerformed
  const lastSets = last?.actualSets != null ? `Última: ${last.actualSets}` : undefined
  const lastReps = last?.actualReps != null ? `Última: ${last.actualReps}` : undefined
  const lastWeight = last?.actualWeight ? `Última: ${last.actualWeight} kg` : undefined
  const lastRpe = last?.rpe ? `Última: ${last.rpe}` : undefined

  return (
    <form.Subscribe selector={(state) => [state.values, state.isSubmitting] as const}>
      {([{ completed, actualReps, actualSets, actualWeight, rpe }, isSubmitting]) => (
        <AccordionItem value={exercise.id} data-completed={completed || undefined} className="data-completed:bg-muted">
          <AccordionTrigger>
            <span className="wrap-break-word">{exercise.exercise.name}</span>
            {completed && (
              <div className="text-muted-foreground flex flex-1 items-center justify-between gap-1">
                <CheckIcon className="mr-auto size-4 text-green-500" />
                <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">{`${actualSets} x ${actualReps}, ${actualWeight}kg, RPE ${rpe}`}</Badge>
              </div>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <form
              onSubmit={(ev) => {
                ev.preventDefault()
                form.handleSubmit()
              }}
            >
              <FieldGroup>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  <form.AppField
                    name="actualSets"
                    validators={{ onSubmit: updateSessionExerciseSchema.shape.actualSets }}
                  >
                    {({ StepperField }) => (
                      <StepperField
                        label="Séries"
                        inputMode="numeric"
                        mask={digitsOnly}
                        baseValue={last?.actualSets}
                        footer={
                          <div className="flex items-center gap-1 *:flex-1">
                            <Badge variant="outline">{lastSets}</Badge>
                            <Badge>
                              Meta: {exercise.plannedSetsMin} - {exercise.plannedSetsMax}
                            </Badge>
                          </div>
                        }
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="actualReps"
                    validators={{ onSubmit: updateSessionExerciseSchema.shape.actualReps }}
                  >
                    {({ StepperField }) => (
                      <StepperField
                        label="Reps"
                        inputMode="numeric"
                        mask={digitsOnly}
                        baseValue={last?.actualReps}
                        footer={
                          <div className="flex items-center gap-1 *:flex-1">
                            <Badge variant="outline">{lastReps}</Badge>
                            <Badge>
                              Meta: {exercise.plannedRepsMin} - {exercise.plannedRepsMax}
                            </Badge>
                          </div>
                        }
                      />
                    )}
                  </form.AppField>
                  <form.AppField
                    name="actualWeight"
                    validators={{ onSubmit: updateSessionExerciseSchema.shape.actualWeight }}
                  >
                    {({ StepperField }) => (
                      <StepperField
                        label="Peso"
                        inputMode="decimal"
                        mask={decimalOnly}
                        step={2.5}
                        baseValue={last?.actualWeight}
                        footer={<Badge variant="outline">{lastWeight}</Badge>}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="rpe" validators={{ onSubmit: updateSessionExerciseSchema.shape.rpe }}>
                    {({ StepperField }) => (
                      <StepperField
                        label="RPE"
                        inputMode="decimal"
                        mask={decimalOnly}
                        baseValue={last?.rpe}
                        footer={<Badge variant="outline">{lastRpe}</Badge>}
                      />
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
                  <form.AppField name="completed">
                    {() => (
                      <Button
                        type="button"
                        variant={completed ? 'ghost' : 'outline'}
                        aria-pressed={completed}
                        loading={isSubmitting}
                        onClick={async () => {
                          const errors = await form.validateAllFields('submit')
                          if (errors.length) return

                          form.setFieldValue('completed', !completed)
                        }}
                      >
                        <span
                          className={cn(
                            'flex size-3.5 items-center justify-center rounded-[3px] border',
                            completed
                              ? 'border-primary-foreground bg-primary-foreground text-primary'
                              : 'border-current',
                          )}
                        >
                          {completed && <CheckIcon className="size-3" />}
                        </span>
                        Concluído
                      </Button>
                    )}
                  </form.AppField>
                </Field>
              </FieldGroup>
            </form>
          </AccordionContent>
        </AccordionItem>
      )}
    </form.Subscribe>
  )
}
