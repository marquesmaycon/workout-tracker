import * as React from 'react'

import { cn } from '#/lib/utils.ts'

function Page({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="page"
      className={cn('flex flex-col gap-6', className)}
      {...props}
    />
  )
}

function PageHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot="page-header"
      className={cn('grid auto-rows-min items-start gap-1', className)}
      {...props}
    />
  )
}

function PageTitle({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      data-slot="page-title"
      className={cn('font-heading text-2xl font-semibold', className)}
      {...props}
    />
  )
}

function PageDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="page-description"
      className={cn('text-muted-foreground text-sm/relaxed', className)}
      {...props}
    />
  )
}

export { Page, PageDescription, PageHeader, PageTitle }
