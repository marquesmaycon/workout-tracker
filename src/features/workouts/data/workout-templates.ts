import type { WorkoutExerciseFormSchema } from '../validation/workout-exercise.form'

type TemplateExercise = {
  name: string
  sets: [number, number]
  reps: [number, number]
  restSeconds: number
}

export type WorkoutTemplate = {
  id: string
  name: string
  description: string
  muscleGroups: string[]
  exercises: TemplateExercise[]
}

const compound = (name: string): TemplateExercise => ({
  name,
  sets: [3, 4],
  reps: [6, 10],
  restSeconds: 120,
})

const accessory = (name: string): TemplateExercise => ({
  name,
  sets: [3, 4],
  reps: [8, 12],
  restSeconds: 90,
})

const isolation = (name: string): TemplateExercise => ({
  name,
  sets: [3, 3],
  reps: [10, 15],
  restSeconds: 60,
})

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'chest-triceps',
    name: 'Peito + Tríceps',
    description: 'Clássico de empurrar: peitoral completo e tríceps.',
    muscleGroups: ['Peito', 'Tríceps'],
    exercises: [
      compound('Supino Reto'),
      accessory('Supino Inclinado'),
      isolation('Crucifixo'),
      isolation('Crossover'),
      isolation('Tríceps Corda'),
      isolation('Tríceps Testa'),
    ],
  },
  {
    id: 'back-biceps',
    name: 'Costas + Bíceps',
    description: 'Clássico de puxar: dorsais, meio das costas e bíceps.',
    muscleGroups: ['Costas', 'Bíceps'],
    exercises: [
      accessory('Puxada Frente'),
      compound('Remada Curvada'),
      accessory('Remada Baixa'),
      isolation('Pulldown'),
      isolation('Rosca Direta'),
      isolation('Rosca Alternada'),
    ],
  },
  {
    id: 'legs',
    name: 'Pernas completo',
    description: 'Quadríceps, posterior, glúteos e panturrilha.',
    muscleGroups: ['Quadríceps', 'Posterior de Coxa', 'Glúteos', 'Panturrilha'],
    exercises: [
      compound('Agachamento Livre'),
      accessory('Leg Press'),
      isolation('Cadeira Extensora'),
      isolation('Cadeira Flexora'),
      accessory('Stiff'),
      isolation('Panturrilha em Pé'),
    ],
  },
  {
    id: 'shoulders-abs',
    name: 'Ombro + Abdômen',
    description: 'Deltoides completos e trabalho de core.',
    muscleGroups: ['Ombro', 'Abdômen'],
    exercises: [
      compound('Desenvolvimento com Halteres'),
      isolation('Elevação Lateral'),
      isolation('Elevação Frontal'),
      isolation('Abdominal Supra'),
    ],
  },
  {
    id: 'biceps-shoulders',
    name: 'Bíceps + Ombros',
    description: 'Deltoides e bíceps no mesmo dia.',
    muscleGroups: ['Ombro', 'Bíceps'],
    exercises: [
      compound('Desenvolvimento com Halteres'),
      isolation('Elevação Lateral'),
      isolation('Elevação Frontal'),
      isolation('Rosca Direta'),
      isolation('Rosca Alternada'),
      isolation('Rosca Scott'),
    ],
  },
  {
    id: 'chest-back',
    name: 'Peito + Costas',
    description: 'Antagonistas alternados: empurrar e puxar.',
    muscleGroups: ['Peito', 'Costas'],
    exercises: [
      compound('Supino Reto'),
      accessory('Puxada Frente'),
      accessory('Supino Inclinado'),
      compound('Remada Curvada'),
      isolation('Crucifixo'),
      accessory('Remada Baixa'),
    ],
  },
  {
    id: 'arms',
    name: 'Braços',
    description: 'Bíceps, tríceps e antebraço.',
    muscleGroups: ['Bíceps', 'Tríceps', 'Antebraço'],
    exercises: [
      isolation('Rosca Direta'),
      isolation('Tríceps Corda'),
      isolation('Rosca Scott'),
      isolation('Tríceps Francês'),
      isolation('Rosca Alternada'),
      isolation('Tríceps Testa'),
      isolation('Rosca de Punho'),
    ],
  },
  {
    id: 'push',
    name: 'Push (Empurrar)',
    description: 'Peito, ombros e tríceps em um só treino.',
    muscleGroups: ['Peito', 'Ombro', 'Tríceps'],
    exercises: [
      compound('Supino Reto'),
      accessory('Supino Inclinado'),
      compound('Desenvolvimento com Halteres'),
      isolation('Elevação Lateral'),
      isolation('Tríceps Corda'),
      isolation('Tríceps Francês'),
    ],
  },
  {
    id: 'pull',
    name: 'Pull (Puxar)',
    description: 'Costas, posterior de cadeia e bíceps.',
    muscleGroups: ['Costas', 'Bíceps'],
    exercises: [
      compound('Levantamento Terra'),
      accessory('Puxada Frente'),
      compound('Remada Curvada'),
      accessory('Remada Baixa'),
      isolation('Rosca Direta'),
      isolation('Rosca Scott'),
    ],
  },
  {
    id: 'glutes-hamstrings',
    name: 'Glúteos + Posterior',
    description: 'Ênfase em cadeia posterior e glúteos.',
    muscleGroups: ['Glúteos', 'Posterior de Coxa'],
    exercises: [
      compound('Elevação Pélvica'),
      compound('Stiff'),
      compound('Levantamento Terra'),
      isolation('Cadeira Flexora'),
      accessory('Leg Press'),
    ],
  },
  {
    id: 'full-body',
    name: 'Full body',
    description: 'Corpo inteiro com os principais compostos.',
    muscleGroups: ['Quadríceps', 'Peito', 'Costas', 'Ombro', 'Abdômen'],
    exercises: [
      compound('Agachamento Livre'),
      compound('Supino Reto'),
      compound('Remada Curvada'),
      accessory('Desenvolvimento com Halteres'),
      isolation('Abdominal Supra'),
    ],
  },
]

export function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function buildExerciseIdsByName(exercises: Array<{ id: string; name: string }>) {
  return new Map(exercises.map((exercise) => [normalizeName(exercise.name), exercise.id]))
}

export function buildTemplateExercises(
  template: WorkoutTemplate,
  exerciseIdsByName: Map<string, string>,
): WorkoutExerciseFormSchema[] {
  return template.exercises.flatMap((item) => {
    const exerciseId = exerciseIdsByName.get(normalizeName(item.name))
    if (!exerciseId) return []

    return [
      {
        exerciseId,
        targetSetsMin: item.sets[0].toString(),
        targetSetsMax: item.sets[1].toString(),
        targetRepsMin: item.reps[0].toString(),
        targetRepsMax: item.reps[1].toString(),
        targetWeight: '',
        restSeconds: item.restSeconds.toString(),
        notes: '',
      },
    ]
  })
}
