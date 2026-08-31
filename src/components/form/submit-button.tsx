import type { ComponentProps } from 'react'

import { useFormContext } from '@/hooks/form-context'

import { Button } from '../ui/button'

type SubmitButtonProps = ComponentProps<typeof Button> & {
  label: string
}

export function SubmitButton({ label, ...props }: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.isDirty, state.isSubmitting]}>
      {([isDirty, isSubmitting]) => (
        <Button
          type="submit"
          disabled={!isDirty}
          variant="default"
          {...props}
          loading={isSubmitting || props.loading}
        >
          {label || 'Save'}
        </Button>
      )}
    </form.Subscribe>
  )
}
