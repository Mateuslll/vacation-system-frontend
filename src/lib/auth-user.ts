export type AuthUserPayload = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status?: string;
};

export function displayNameFromAuthUser(user: AuthUserPayload): string {
  const n = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return n || user.email;
}

export function buildSessionUser(user: AuthUserPayload, roles: string[]) {
  return {
    id: user.id,
    email: user.email,
    name: displayNameFromAuthUser(user),
    status: user.status === "INACTIVE" ? "INACTIVE" as const : "ACTIVE" as const,
    roles,
  };
}

export function canManageUsers(roles?: string[] | null): boolean {
  return roles?.some((r) => r === "ADMIN" || r === "MANAGER") ?? false;
}
