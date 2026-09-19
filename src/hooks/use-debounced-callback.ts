import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<TArgs extends Array<unknown>>(
  callback: (...args: TArgs) => void,
  delayMs: number,
) {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingArgsRef = useRef<TArgs | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  })

  const flush = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null

    const args = pendingArgsRef.current
    pendingArgsRef.current = null
    if (args) callbackRef.current(...args)
  }, [])

  // Envia o que estiver pendente ao desmontar, para não perder a última edição
  useEffect(() => flush, [flush])

  return useCallback(
    (...args: TArgs) => {
      pendingArgsRef.current = args
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(flush, delayMs)
    },
    [delayMs, flush],
  )
}
