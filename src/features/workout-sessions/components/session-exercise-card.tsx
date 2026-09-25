import { useMutationState } from '@tanstack/react-query'
import { CheckIcon, ChevronDownIcon, Loader2 } from 'lucide-react'
import { memo, useEffect } from 'react'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Field, FieldGroup } from '@/components/ui/field'
import { useAppForm } from '@/hooks/form'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { decimalOnly, digitsOnly } from '@/lib/input-masks'
import { cn } from '@/lib/utils'
import { orpc } from '@/orpc/client'

import type { WorkoutSessionExercise } from '../validation/workout-session-exercise.entity'
import type { SessionExerciseFormSchema } from '../validation/workout-session-exercise.form'
import { sessionExerciseFormOptions, updateSessionExerciseSchema } from '../validation/workout-session-exercise.form'

const AUTO_SAVE_DELAY_MS = 1500

type SessionExerciseCardProps = {
  exercise: WorkoutSessionExercise
  onSave: (value: SessionExerciseFormSchema) => Promise<void>
  registerFlush: (flush: () => void) => () => void
  onCompletedChange: (id: string, completed: boolean) => void
}

function SessionExerciseCardComponent({
  exercise,
  onSave,
  registerFlush,
  onCompletedChange,
}: SessionExerciseCardProps) {
  const debouncedSave = useDebouncedCallback(onSave, AUTO_SAVE_DELAY_MS)

  useEffect(() => registerFlush(debouncedSave.flush), [registerFlush, debouncedSave.flush])

  const form = useAppForm({
    ...sessionExerciseFormOptions(exercise),
    onSubmit: ({ value }) => onSave(value),
    listeners: { onChange: ({ formApi }) => debouncedSave.run(formApi.state.values) },
  })

  const isSaving = useMutationState({
    filters: { mutationKey: orpc.workoutSessions.updateExercise.mutationKey(), status: 'pending' },
    select: (mutation) => (mutation.state.variables as SessionExerciseFormSchema).id,
  }).includes(exercise.id)

  const last = exercise.lastPerformed
  const lastSets = last?.actualSets != null ? `Última: ${last.actualSets}` : undefined
  const lastReps = last?.actualReps != null ? `Última: ${last.actualReps}` : undefined
  const lastWeight = last?.actualWeight ? `Última: ${last.actualWeight} kg` : undefined
  const lastRpe = last?.rpe ? `Última: ${last.rpe}` : undefined

  return (
    <form.Subscribe selector={(state) => state.values.completed}>
      {(completed) => (
        <AccordionItem value={exercise.id} data-completed={completed || undefined} className="data-completed:bg-muted">
          <AccordionTrigger className="items-center gap-2 **:data-[slot=accordion-trigger-icon]:ml-0">
            <span className="mr-auto flex items-center gap-2">
              <span className="wrap-break-word">{exercise.exercise.name}</span>
              {isSaving && <Loader2 className="text-muted-foreground size-4 animate-spin" aria-label="Salvando" />}
            </span>
            {completed && (
              <span className="text-muted-foreground flex items-center gap-2">
                <CheckIcon className="size-4 text-green-500" />
                <form.Subscribe
                  selector={({ values: v }) =>
                    `${v.actualSets} x ${v.actualReps} | ${v.actualWeight}kg |  RPE ${v.rpe}`
                  }
                >
                  {(summary) => (
                    <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">{summary}</Badge>
                  )}
                </form.Subscribe>
              </span>
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
                      <form.Subscribe selector={(state) => state.isSubmitting}>
                        {(isSubmitting) => (
                          <Button
                            type="button"
                            variant={completed ? 'ghost' : 'outline'}
                            aria-pressed={completed}
                            loading={isSubmitting}
                            onClick={async () => {
                              const errors = await form.validateAllFields('submit')
                              if (errors.length) return

                              form.setFieldValue('completed', !completed)
                              onCompletedChange(exercise.id, !completed)
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
                      </form.Subscribe>
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

export const SessionExerciseCard = memo(
  SessionExerciseCardComponent,
  (prev, next) =>
    prev.exercise.id === next.exercise.id &&
    prev.onSave === next.onSave &&
    prev.registerFlush === next.registerFlush &&
    prev.onCompletedChange === next.onCompletedChange,
)
