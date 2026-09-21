import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { WorkoutSession } from '../validation/workout-session.entity'
import type { SessionExerciseFormSchema } from '../validation/workout-session-exercise.form'
import { useUpdateSessionExercise } from './use-workout-session-mutations'

type Flush = () => void

export function useSessionExerciseSaver(session: WorkoutSession) {
  const updateSessionExercise = useUpdateSessionExercise(session.id)

  const [savedExercises] = useState(
    () => new Map(session.exercises.map((e) => [e.id, { name: e.exercise.name, completed: e.completed }])),
  )
  const flushers = useRef(new Set<Flush>())

  const saveExercise = useCallback(
    async (value: SessionExerciseFormSchema) => {
      try {
        await updateSessionExercise(value)

        const saved = savedExercises.get(value.id)
        if (saved && saved.completed !== value.completed) {
          saved.completed = value.completed
          toast.success(`${saved.name} ${value.completed ? 'concluído' : 'reaberto'}`)
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Não foi possível salvar o exercício.')
      }
    },
    [updateSessionExercise, savedExercises],
  )

  const registerFlush = useCallback((flush: Flush) => {
    flushers.current.add(flush)
    return () => {
      flushers.current.delete(flush)
    }
  }, [])

  const flushPending = useCallback(() => {
    flushers.current.forEach((flush) => flush())
  }, [])

  return { saveExercise, registerFlush, flushPending }
}
