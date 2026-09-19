import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

export function getContext() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } })

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}

export const devtools = {
  name: 'Tanstack Query',
  render: <ReactQueryDevtoolsPanel />,
}
