import { useCallback, useState } from 'react'

import type { WorkoutSession } from '../validation/workout-session.entity'

export function useSessionCompletion(session: WorkoutSession) {
  const [completedIds, setCompletedIds] = useState(
    () => new Set(session.exercises.filter((e) => e.completed).map((e) => e.id)),
  )

  const setExerciseCompleted = useCallback((id: string, completed: boolean) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (completed) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const completedCount = completedIds.size
  const totalCount = session.exercises.length
  const allCompleted = completedCount === totalCount

  return { completedCount, totalCount, allCompleted, setExerciseCompleted }
}
