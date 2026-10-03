import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: React.ComponentProps<'img'>) {
  return (
    <img
      src="/logoipsum-365.svg"
      alt="Workout Tracker"
      className={cn('size-6 object-contain', className)}
      {...props}
    />
  )
}
