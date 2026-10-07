import { Link, useMatches } from '@tanstack/react-router'
import { Fragment } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function AppBreadcrumb() {
  const crumbs = useMatches({
    select: (matches) =>
      matches.flatMap((match) =>
        match.staticData.breadcrumb
          ? [
              {
                id: match.id,
                pathname: match.pathname,
                breadcrumb: match.staticData.breadcrumb,
              },
            ]
          : [],
      ),
  })

  if (crumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map(({ id, pathname, breadcrumb: Crumb }, index) => {
          const title = typeof Crumb === 'string' ? Crumb : <Crumb />
          const isLast = index === crumbs.length - 1

          return (
            <Fragment key={id}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={pathname} />}>
                    {title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
