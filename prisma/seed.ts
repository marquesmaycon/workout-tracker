import { fakerPT_BR as faker } from '@faker-js/faker'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

import type { WorkoutExercise } from './generated/client.js'
import { WorkoutSessionStatus } from './generated/client.js'

faker.seed(20260101)

const SEED_PASSWORD = 'Senha123!'
const USER_COUNT = 3
const HISTORY_WEEKS = 8

const MUSCLE_GROUPS = [
  'Peito',
  'Costas',
  'Ombro',
  'Bíceps',
  'Tríceps',
  'Antebraço',
  'Abdômen',
  'Quadríceps',
  'Posterior de Coxa',
  'Glúteos',
  'Panturrilha',
]

const EXERCISE_TEMPLATES: Array<{ name: string; muscleGroups: string[] }> = [
  { name: 'Supino Reto', muscleGroups: ['Peito', 'Tríceps'] },
  { name: 'Supino Inclinado', muscleGroups: ['Peito', 'Ombro'] },
  { name: 'Crucifixo', muscleGroups: ['Peito'] },
  { name: 'Crossover', muscleGroups: ['Peito'] },
  { name: 'Puxada Frente', muscleGroups: ['Costas', 'Bíceps'] },
  { name: 'Remada Curvada', muscleGroups: ['Costas', 'Bíceps'] },
  { name: 'Remada Baixa', muscleGroups: ['Costas'] },
  { name: 'Pulldown', muscleGroups: ['Costas', 'Bíceps'] },
  { name: 'Levantamento Terra', muscleGroups: ['Costas', 'Posterior de Coxa', 'Glúteos'] },
  { name: 'Desenvolvimento com Halteres', muscleGroups: ['Ombro'] },
  { name: 'Elevação Lateral', muscleGroups: ['Ombro'] },
  { name: 'Elevação Frontal', muscleGroups: ['Ombro'] },
  { name: 'Rosca Direta', muscleGroups: ['Bíceps'] },
  { name: 'Rosca Alternada', muscleGroups: ['Bíceps'] },
  { name: 'Rosca Scott', muscleGroups: ['Bíceps'] },
  { name: 'Tríceps Corda', muscleGroups: ['Tríceps'] },
  { name: 'Tríceps Testa', muscleGroups: ['Tríceps'] },
  { name: 'Tríceps Francês', muscleGroups: ['Tríceps'] },
  { name: 'Agachamento Livre', muscleGroups: ['Quadríceps', 'Glúteos', 'Posterior de Coxa'] },
  { name: 'Leg Press', muscleGroups: ['Quadríceps', 'Glúteos'] },
  { name: 'Cadeira Extensora', muscleGroups: ['Quadríceps'] },
  { name: 'Cadeira Flexora', muscleGroups: ['Posterior de Coxa'] },
  { name: 'Stiff', muscleGroups: ['Posterior de Coxa', 'Glúteos'] },
  { name: 'Elevação Pélvica', muscleGroups: ['Glúteos'] },
  { name: 'Panturrilha em Pé', muscleGroups: ['Panturrilha'] },
  { name: 'Abdominal Supra', muscleGroups: ['Abdômen'] },
  { name: 'Rosca de Punho', muscleGroups: ['Antebraço'] },
]

const WORKOUT_TEMPLATES: Array<{ name: string; description: string; muscleGroups: string[] }> = [
  {
    name: 'Treino A - Peito e Tríceps',
    description: 'Foco em empurrar: peitoral e tríceps.',
    muscleGroups: ['Peito', 'Tríceps'],
  },
  {
    name: 'Treino B - Costas e Bíceps',
    description: 'Foco em puxar: dorsais e bíceps.',
    muscleGroups: ['Costas', 'Bíceps'],
  },
  {
    name: 'Treino C - Pernas',
    description: 'Membros inferiores completos.',
    muscleGroups: ['Quadríceps', 'Posterior de Coxa', 'Glúteos', 'Panturrilha'],
  },
  {
    name: 'Treino D - Ombro e Abdômen',
    description: 'Ombros e core.',
    muscleGroups: ['Ombro', 'Abdômen'],
  },
]

// 1=Segunda ... 7=Domingo (convenção usada em src/features/schedules)
const SCHEDULE_WEEKDAYS = [1, 2, 4, 5]

const GYM_NAMES = ['Smart Fit', 'BioRitmo', 'Bodytech', 'Academia Central', 'Cia Athletica']

type SeedUser = { id: string; name: string; email: string }
type SeedExercise = { id: string; name: string; muscleGroupNames: string[] }
type SeedWorkout = { id: string; exercises: WorkoutExercise[] }

const WEIGHT_STEP = 2.5

function randomWeight(min: number, max: number) {
  return faker.number.int({ min: min / WEIGHT_STEP, max: max / WEIGHT_STEP }) * WEIGHT_STEP
}

function toEmail(name: string, index: number) {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]+/g, '.')
    .replace(/^\.+|\.+$/g, '')

  return `${slug}.${index}@example.com`
}

function mostRecentWeekday(jsWeekday: number, referenceDate: Date) {
  const date = new Date(referenceDate)
  const diff = (date.getDay() - jsWeekday + 7) % 7
  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function getSessionDate(weekday: number, weeksAgo: number, referenceDate: Date) {
  const jsWeekday = weekday === 7 ? 0 : weekday
  const date = mostRecentWeekday(jsWeekday, referenceDate)
  date.setDate(date.getDate() - weeksAgo * 7)
  return date
}

async function resetDatabase() {
  await prisma.workoutSessionExercise.deleteMany()
  await prisma.workoutSession.deleteMany()
  await prisma.scheduleItem.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.workoutExercise.deleteMany()
  await prisma.workout.deleteMany()
  await prisma.exerciseMuscleGroup.deleteMany()
  await prisma.exercise.deleteMany()
  await prisma.muscleGroup.deleteMany()
  await prisma.bodyWeightLog.deleteMany()
  await prisma.gym.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()
}

async function createUsers(): Promise<SeedUser[]> {
  const users: SeedUser[] = []

  for (let i = 0; i < USER_COUNT; i++) {
    const name = faker.person.fullName()
    const email = toEmail(name, i)

    const result = await auth.api.signUpEmail({
      body: { name, email, password: SEED_PASSWORD },
    })

    users.push({ id: result.user.id, name, email })
  }

  return users
}

async function createMuscleGroups() {
  const groups = await Promise.all(
    MUSCLE_GROUPS.map((name) => prisma.muscleGroup.create({ data: { name } })),
  )

  return new Map(groups.map((group) => [group.name, group.id]))
}

async function createExercises(muscleGroupIds: Map<string, string>): Promise<SeedExercise[]> {
  const exercises: SeedExercise[] = []

  for (const template of EXERCISE_TEMPLATES) {
    const exercise = await prisma.exercise.create({
      data: {
        name: template.name,
        description: faker.lorem.sentence(),
        instructions: faker.lorem.sentences(2),
      },
    })

    await Promise.all(
      template.muscleGroups.map((groupName, index) =>
        prisma.exerciseMuscleGroup.create({
          data: {
            exerciseId: exercise.id,
            muscleGroupId: muscleGroupIds.get(groupName)!,
            isPrimary: index === 0,
          },
        }),
      ),
    )

    exercises.push({
      id: exercise.id,
      name: exercise.name,
      muscleGroupNames: template.muscleGroups,
    })
  }

  return exercises
}

async function createGymsForUser(userId: string) {
  const count = faker.number.int({ min: 1, max: 2 })
  const names = faker.helpers.arrayElements(GYM_NAMES, count)

  const gyms = []
  for (const [index, name] of names.entries()) {
    gyms.push(await prisma.gym.create({ data: { userId, name, favorite: index === 0 } }))
  }

  return gyms
}

async function createWorkoutsForUser(
  userId: string,
  exercises: SeedExercise[],
): Promise<SeedWorkout[]> {
  const workouts: SeedWorkout[] = []

  for (const template of WORKOUT_TEMPLATES) {
    const candidates = exercises.filter((exercise) =>
      exercise.muscleGroupNames.some((group) => template.muscleGroups.includes(group)),
    )
    const upperBound = Math.min(8, candidates.length)
    const lowerBound = Math.min(4, upperBound)
    const pickCount = faker.number.int({ min: lowerBound, max: upperBound })
    const picked = faker.helpers.arrayElements(candidates, pickCount)

    const workout = await prisma.workout.create({
      data: {
        userId,
        name: template.name,
        description: template.description,
        isActive: true,
      },
    })

    const workoutExercises: WorkoutExercise[] = []
    for (const [index, exercise] of picked.entries()) {
      workoutExercises.push(
        await prisma.workoutExercise.create({
          data: {
            workoutId: workout.id,
            exerciseId: exercise.id,
            orderIndex: index,
            targetSetsMin: 3,
            targetSetsMax: 4,
            targetRepsMin: 8,
            targetRepsMax: 12,
            targetWeight: randomWeight(10, 80),
            restSeconds: faker.helpers.arrayElement([60, 90, 120]),
          },
        }),
      )
    }

    workouts.push({ id: workout.id, exercises: workoutExercises })
  }

  return workouts
}

async function createScheduleForUser(userId: string, workouts: SeedWorkout[]) {
  const schedule = await prisma.schedule.create({
    data: {
      userId,
      name: 'Programação Padrão',
      description: 'Programação semanal gerada pelo seed',
      isActive: true,
    },
  })

  const items = []
  for (const [index, weekday] of SCHEDULE_WEEKDAYS.entries()) {
    const workout = workouts[index % workouts.length]
    items.push(
      await prisma.scheduleItem.create({
        data: { scheduleId: schedule.id, workoutId: workout.id, weekday },
      }),
    )
  }

  return items
}

async function createWorkoutHistoryForUser(
  userId: string,
  scheduleItems: Array<{ id: string; weekday: number; workoutId: string }>,
  workoutsById: Map<string, SeedWorkout>,
  gyms: Array<{ id: string }>,
) {
  const now = new Date()
  let sessionCount = 0
  let exerciseLogCount = 0

  for (let weeksAgo = HISTORY_WEEKS; weeksAgo >= 1; weeksAgo--) {
    for (const item of scheduleItems) {
      const sessionDate = getSessionDate(item.weekday, weeksAgo, now)
      const workout = workoutsById.get(item.workoutId)!

      const startedAt = new Date(sessionDate)
      startedAt.setHours(
        faker.number.int({ min: 6, max: 20 }),
        faker.number.int({ min: 0, max: 59 }),
      )

      const isCancelled = faker.number.int({ min: 1, max: 100 }) <= 10
      const durationMinutes = faker.number.int({ min: 40, max: 70 })
      const finishedAt = isCancelled
        ? new Date(startedAt.getTime() + faker.number.int({ min: 5, max: 20 }) * 60_000)
        : new Date(startedAt.getTime() + durationMinutes * 60_000)

      const gymId = faker.helpers.arrayElement(gyms).id

      const session = await prisma.workoutSession.create({
        data: {
          userId,
          workoutId: workout.id,
          scheduleItemId: item.id,
          gymId,
          startedAt,
          finishedAt,
          status: isCancelled ? WorkoutSessionStatus.CANCELLED : WorkoutSessionStatus.COMPLETED,
          notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }) ?? null,
        },
      })
      sessionCount++

      const exercisesToLog = isCancelled
        ? workout.exercises.slice(
            0,
            faker.number.int({ min: 0, max: Math.max(1, workout.exercises.length - 1) }),
          )
        : workout.exercises

      for (const workoutExercise of exercisesToLog) {
        const plannedWeight = workoutExercise.targetWeight
          ? Number(workoutExercise.targetWeight)
          : null
        const actualWeight =
          plannedWeight === null
            ? null
            : Math.max(0, plannedWeight + faker.helpers.arrayElement([-WEIGHT_STEP, 0, WEIGHT_STEP, 2 * WEIGHT_STEP]))

        await prisma.workoutSessionExercise.create({
          data: {
            workoutSessionId: session.id,
            exerciseId: workoutExercise.exerciseId,
            workoutExerciseId: workoutExercise.id,
            gymId,
            orderIndex: workoutExercise.orderIndex,
            plannedSetsMin: workoutExercise.targetSetsMin,
            plannedSetsMax: workoutExercise.targetSetsMax,
            plannedRepsMin: workoutExercise.targetRepsMin,
            plannedRepsMax: workoutExercise.targetRepsMax,
            plannedWeight: workoutExercise.targetWeight,
            actualSets: workoutExercise.targetSetsMax,
            actualReps: faker.number.int({
              min: workoutExercise.targetRepsMin ?? 8,
              max: workoutExercise.targetRepsMax ?? 12,
            }),
            actualWeight,
            rpe: faker.number.int({ min: 6, max: 10 }),
            completed: true,
            completedAt: finishedAt,
          },
        })
        exerciseLogCount++
      }
    }
  }

  return { sessionCount, exerciseLogCount }
}

async function createBodyWeightLogsForUser(userId: string) {
  const now = new Date()
  let currentWeight = faker.number.float({ min: 60, max: 95, fractionDigits: 1 })
  let count = 0

  for (let weeksAgo = HISTORY_WEEKS; weeksAgo >= 1; weeksAgo--) {
    const logsThisWeek = faker.number.int({ min: 1, max: 2 })

    for (let i = 0; i < logsThisWeek; i++) {
      currentWeight += faker.number.float({ min: -0.4, max: 0.4, fractionDigits: 1 })

      const measuredAt = new Date(now)
      measuredAt.setDate(
        measuredAt.getDate() - weeksAgo * 7 - faker.number.int({ min: 0, max: 6 }),
      )

      await prisma.bodyWeightLog.create({
        data: {
          userId,
          measuredAt,
          weight: Number(currentWeight.toFixed(1)),
          notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.15 }) ?? null,
        },
      })
      count++
    }
  }

  return count
}

async function main() {
  console.log('🌱 Seeding database...')

  await resetDatabase()

  const users = await createUsers()
  const muscleGroupIds = await createMuscleGroups()
  const exercises = await createExercises(muscleGroupIds)

  let totalGyms = 0
  let totalWorkouts = 0
  let totalSessions = 0
  let totalExerciseLogs = 0
  let totalBodyWeightLogs = 0

  for (const user of users) {
    const gyms = await createGymsForUser(user.id)
    totalGyms += gyms.length

    const workouts = await createWorkoutsForUser(user.id, exercises)
    totalWorkouts += workouts.length
    const workoutsById = new Map(workouts.map((workout) => [workout.id, workout]))

    const scheduleItems = await createScheduleForUser(user.id, workouts)

    const { sessionCount, exerciseLogCount } = await createWorkoutHistoryForUser(
      user.id,
      scheduleItems,
      workoutsById,
      gyms,
    )
    totalSessions += sessionCount
    totalExerciseLogs += exerciseLogCount

    totalBodyWeightLogs += await createBodyWeightLogsForUser(user.id)
  }

  console.log('✅ Seed finalizado:')
  console.log(`   Usuários: ${users.length}`)
  console.log(`   Academias: ${totalGyms}`)
  console.log(`   Grupos musculares: ${muscleGroupIds.size}`)
  console.log(`   Exercícios: ${exercises.length}`)
  console.log(`   Treinos: ${totalWorkouts}`)
  console.log(`   Sessões de treino: ${totalSessions}`)
  console.log(`   Registros de exercício no histórico: ${totalExerciseLogs}`)
  console.log(`   Registros de peso corporal: ${totalBodyWeightLogs}`)
  console.log('')
  console.log(`🔐 Login de teste (senha para todos: ${SEED_PASSWORD}):`)
  for (const user of users) {
    console.log(`   - ${user.email}`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
