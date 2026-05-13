/**
 * RBAC Policy Engine — OPA-style flat policy evaluation.
 *
 * Defines which routes and actions each role is authorised for.
 * The middleware calls `evaluatePolicy` on every protected request;
 * no database hit is required (role is already in the JWT).
 */

export type Role = "ADMIN" | "TEACHER" | "ACCOUNTANT"
export type Action = "read" | "write" | "delete" | "manage"

interface Policy {
  allow: Action[]
  /** Route prefixes this role may access */
  routes: string[]
}

const POLICIES: Record<Role, Policy> = {
  ADMIN: {
    allow: ["read", "write", "delete", "manage"],
    routes: ["/dashboard", "/dashboard/admin"],
  },
  TEACHER: {
    allow: ["read", "write"],
    routes: ["/dashboard", "/dashboard/teacher"],
  },
  ACCOUNTANT: {
    allow: ["read", "write"],
    routes: ["/dashboard", "/dashboard/accountant"],
  },
}

/**
 * Returns true if `role` is authorised to access `resource`.
 */
export function evaluatePolicy(role: string, resource: string): boolean {
  const policy = POLICIES[role as Role]
  if (!policy) return false
  return policy.routes.some(
    (r) => resource === r || resource.startsWith(r + "/")
  )
}

/**
 * Returns the home dashboard route for a given role.
 */
export function getDashboardRoute(role: string): string {
  switch (role as Role) {
    case "ADMIN":
      return "/dashboard/admin"
    case "TEACHER":
      return "/dashboard/teacher"
    case "ACCOUNTANT":
      return "/dashboard/accountant"
    default:
      return "/login"
  }
}

/**
 * Returns the allowed actions for a given role.
 */
export function getAllowedActions(role: string): Action[] {
  return POLICIES[role as Role]?.allow ?? []
}
