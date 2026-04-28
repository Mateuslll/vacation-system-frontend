/** Query `GET /users?status=` — alinhado com `UserStatusFilter` no backend. */
export type UserListStatusFilter = "ACTIVE" | "INACTIVE" | "ALL";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  managerId: string | null;
  roles: string[];
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "USER" | "MANAGER";

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  department?: string;
  position?: string;
  roles?: string[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE";
  managerId?: string | null;
  roles?: string[];
}