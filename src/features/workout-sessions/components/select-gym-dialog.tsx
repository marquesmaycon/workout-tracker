import { Play } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useIsStartingWorkoutSession } from '../hooks/use-workout-session-mutations'

type Gym = { id: string; name: string; favorite: boolean }

export function SelectGymDialog({
  open,
  onOpenChange,
  gyms,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  gyms: Array<Gym>
  onConfirm: (gymId: string) => void
}) {
  const isStarting = useIsStartingWorkoutSession()
  const defaultGymId = (gyms.find((gym) => gym.favorite) ?? gyms.at(0))?.id ?? null
  const [gymId, setGymId] = useState<string | null>(defaultGymId)

  const items = gyms.map(({ id, name }) => ({ value: id, label: name }))

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isStarting && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Onde você vai treinar?</AlertDialogTitle>
          <AlertDialogDescription>Selecione a academia para vincular a esta sessão de treino.</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor="start-session-gym">Academia</Label>
          <Select items={items} value={gymId} onValueChange={setGymId}>
            <SelectTrigger id="start-session-gym" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isStarting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={!gymId || isStarting} onClick={() => gymId && onConfirm(gymId)}>
            <Play aria-hidden="true" />
            Iniciar treino
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
