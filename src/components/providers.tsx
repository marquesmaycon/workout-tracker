import { TanStackDevtools } from '@tanstack/react-devtools'
import { Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { devtools } from '@/lib/tanstack-query'

import { ThemeProvider } from './layout/theme/theme-provider'
import { Toaster } from './ui/sonner'
import { TooltipProvider } from './ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        {children}
        <Toaster richColors />
      </TooltipProvider>
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          devtools,
        ]}
      />
      <Scripts />
    </ThemeProvider>
  )
}
