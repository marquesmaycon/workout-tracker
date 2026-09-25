import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { orpc } from '@/orpc/client'

import { useStartWorkoutSession } from '../hooks/use-workout-session-mutations'
import { ActiveWorkoutsPicker } from './active-workouts-picker'
import { SelectGymDialog } from './select-gym-dialog'

const currentSessionQuery = orpc.workoutSessions.current.queryOptions()
const todayWorkoutQuery = orpc.workoutSessions.today.queryOptions()
const gymsQuery = orpc.gyms.list.queryOptions()

type StartInput = { workoutId: string; scheduleItemId?: string }

export function StartWorkoutCard() {
  const router = useRouter()
  const { data: currentSession } = useSuspenseQuery(currentSessionQuery)
  const { data: todayWorkout } = useSuspenseQuery(todayWorkoutQuery)
  const { data: gyms } = useSuspenseQuery(gymsQuery)
  const startWorkoutSession = useStartWorkoutSession()

  const [pendingStart, setPendingStart] = useState<StartInput | null>(null)

  const goToSession = (sessionId: string) =>
    router.navigate({ to: '/sessions/$sessionId', params: { sessionId } })

  const start = async (input: StartInput & { gymId?: string }) => {
    try {
      const session = await startWorkoutSession(input)
      setPendingStart(null)
      goToSession(session.id)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível iniciar o treino.')
    }
  }

  const handleStart = (workoutId: string, scheduleItemId?: string) => {
    if (gyms.length > 1) {
      setPendingStart({ workoutId, scheduleItemId })
      return
    }
    void start({ workoutId, scheduleItemId, gymId: gyms[0]?.id })
  }

  return (
    <>
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Treino em andamento</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">{currentSession.workout.name}</p>
            <Button onClick={() => goToSession(currentSession.id)}>
              <Play aria-hidden="true" />
              Continuar treino
            </Button>
          </CardContent>
        </Card>
      )}

      {todayWorkout && !currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Treino de hoje</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">{todayWorkout.workout.name}</p>
            <Button onClick={() => handleStart(todayWorkout.workout.id, todayWorkout.scheduleItemId)}>
              <Play aria-hidden="true" />
              Iniciar treino
            </Button>
          </CardContent>
        </Card>
      )}

      <ActiveWorkoutsPicker onStart={handleStart} />

      <SelectGymDialog
        open={!!pendingStart}
        onOpenChange={(open) => !open && setPendingStart(null)}
        gyms={gyms}
        onConfirm={(gymId) => pendingStart && void start({ ...pendingStart, gymId })}
      />
    </>
  )
}
