import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BicepsFlexed,
  ClipboardList,
  Dumbbell,
  LineChart,
  MapPin,
  Scale,
} from 'lucide-react'

import { ThemeToggler } from '@/components/layout/theme/theme-toggler'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/(public)/')({ component: Home })

const features = [
  {
    title: 'Treinos organizados',
    description:
      'Monte sua rotina, acompanhe treinos ativos e mantenha o historico sempre por perto.',
    icon: ClipboardList,
  },
  {
    title: 'Exercicios e grupos',
    description:
      'Cadastre exercicios por grupo muscular para encontrar tudo rapido na hora de treinar.',
    icon: BicepsFlexed,
  },
  {
    title: 'Academias',
    description:
      'Registre os locais onde voce treina e conecte sua rotina ao ambiente certo.',
    icon: MapPin,
  },
  {
    title: 'Peso corporal',
    description:
      'Acompanhe sua evolucao com registros simples e consistentes ao longo do tempo.',
    icon: Scale,
  },
] as const

function Home() {
  return (
    <div className="bg-background flex min-h-svh flex-col">
      <header className="bg-background/90 sticky top-0 z-10 border-b px-4 py-3 backdrop-blur md:px-6">
        <div className="container flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-foreground text-lg font-bold tracking-normal no-underline"
          >
            Workout Tracker
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggler />
            <Button variant="ghost" render={<Link to="/signin">Entrar</Link>} />
            <Button render={<Link to="/signup">Criar conta</Link>} />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="container grid flex-1 items-center gap-10 px-4 py-14 md:grid-cols-[1fr_0.85fr] md:px-6 md:py-20">
          <div className="rise-in max-w-2xl">
            <p className="text-muted-foreground mb-4 inline-flex h-7 items-center rounded-md border px-3 text-xs font-medium">
              Seu treino, peso e progresso em um so lugar
            </p>
            <h1 className="text-foreground max-w-3xl text-4xl font-bold tracking-normal sm:text-5xl">
              Organize seus treinos sem perder o ritmo.
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7">
              O Workout Tracker ajuda voce a registrar academias, exercicios,
              grupos musculares, treinos e peso corporal com uma experiencia
              simples para o dia a dia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-10 px-4 text-sm"
                render={<Link to="/signup">Comecar agora</Link>}
              />
              <Button
                variant="outline"
                size="lg"
                className="h-10 px-4 text-sm"
                render={<Link to="/signin">Ja tenho conta</Link>}
              />
            </div>
          </div>

          <div className="rise-in bg-card rounded-lg border p-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  Resumo semanal
                </p>
                <h2 className="mt-1 text-xl font-semibold">Treino atual</h2>
              </div>
              <Dumbbell aria-hidden="true" className="text-primary size-6" />
            </div>

            <div className="grid gap-3 py-4">
              {[
                ['Peito e triceps', '5 exercicios'],
                ['Costas e biceps', '6 exercicios'],
                ['Pernas', '7 exercicios'],
              ].map(([name, detail]) => (
                <div
                  key={name}
                  className="bg-muted/60 flex items-center justify-between rounded-md px-3 py-3"
                >
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-muted-foreground text-xs">
                    {detail}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border p-3">
                <LineChart
                  aria-hidden="true"
                  className="text-primary mb-3 size-4"
                />
                <p className="text-2xl font-semibold">8</p>
                <p className="text-muted-foreground text-xs">treinos no mes</p>
              </div>
              <div className="rounded-md border p-3">
                <Scale
                  aria-hidden="true"
                  className="text-primary mb-3 size-4"
                />
                <p className="text-2xl font-semibold">+4</p>
                <p className="text-muted-foreground text-xs">
                  registros de peso
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/35 border-y px-4 py-12 md:px-6">
          <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, description, icon: Icon }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mb-3 flex size-9 items-center justify-center rounded-md">
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="container px-4 py-12 md:px-6">
          <Card>
            <CardContent className="flex flex-col gap-5 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  Pronto para registrar sua evolucao?
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                  Crie sua conta e comece a transformar seus treinos em um
                  historico claro, facil de consultar e bom de manter.
                </p>
              </div>
              <Button
                size="lg"
                className="h-10 px-4 text-sm sm:self-center"
                render={<Link to="/signup">Criar conta gratis</Link>}
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
