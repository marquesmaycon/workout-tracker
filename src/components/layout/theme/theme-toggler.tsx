import { Moon, Sun, SunMoon } from 'lucide-react'
import { Button } from '../../ui/button'
import { useTheme } from './theme-provider'

export function ThemeToggler() {
  const { theme, setTheme } = useTheme()

  function toggleMode() {
    const nextTheme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(nextTheme)
  }

  const label =
    theme === 'system'
      ? 'Tema: system. Clique para alterar para o modo claro.'
      : `Tema: ${theme}. Clique para alterar modo.`

  const Icon = theme === 'system' ? SunMoon : theme === 'light' ? Sun : Moon

  return (
    <Button
      onClick={toggleMode}
      aria-label={label}
      title={label}
      variant="ghost"
      size="sm"
    >
      <Icon />
    </Button>
  )
}
