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

/** Alinha com `ROLE_ADMIN` no Spring e `ADMIN` no JWT / store. */
export function normalizeRoleName(role: string): string {
  return role.replace(/^ROLE_/i, "");
}

export function canManageUsers(roles?: string[] | null): boolean {
  return (
    roles?.some((r) => {
      const n = normalizeRoleName(r);
      return n === "ADMIN" || n === "MANAGER";
    }) ?? false
  );
}
