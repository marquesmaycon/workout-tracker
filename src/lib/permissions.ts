import type { RoleAuthorizeRequest } from 'better-auth/plugins/access'
import { createAccessControl } from 'better-auth/plugins/access'
import {
  adminAc,
  defaultStatements,
  userAc,
} from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
  exercise: ['create', 'update', 'delete'],
  muscleGroup: ['create', 'update', 'delete'],
} as const

export const ac = createAccessControl(statement)

export const user = ac.newRole({
  ...userAc.statements,
})

export const admin = ac.newRole({
  ...adminAc.statements,
  exercise: ['create', 'update', 'delete'],
  muscleGroup: ['create', 'update', 'delete'],
})

export const roles = { admin, user }

export type Permissions = RoleAuthorizeRequest<typeof statement>

export function hasPermission(
  role: string | null | undefined,
  permissions: Permissions,
) {
  return (role ?? 'user')
    .split(',')
    .map((name) => name.trim())
    .filter(isRoleName)
    .some((name) => roles[name].authorize(permissions).success)
}

function isRoleName(name: string): name is keyof typeof roles {
  return Object.hasOwn(roles, name)
}

export function isAdmin(currentUser: { role?: string | null }) {
  return hasPermission(currentUser.role, { exercise: ['create'] })
}
