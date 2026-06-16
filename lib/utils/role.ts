export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;

type RolePayload = {
  role_name?: string;
};

export function hasRole(userRoles: string | undefined, roleName: string): boolean {
  if (!userRoles) return false;

  try {
    const roles = JSON.parse(userRoles) as unknown;
    return (
      Array.isArray(roles) &&
      roles.some((role) => typeof role === 'object' && role !== null && (role as RolePayload).role_name === roleName)
    );
  } catch {
    return false;
  }
}

export function isAdmin(userRoles: string | undefined): boolean {
  return hasRole(userRoles, ROLES.ADMIN);
}

export function isTeacher(userRoles: string | undefined): boolean {
  return hasRole(userRoles, ROLES.TEACHER);
}

export function isStudent(userRoles: string | undefined): boolean {
  return hasRole(userRoles, ROLES.STUDENT);
}
