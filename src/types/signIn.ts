/** Corpo real de `POST /auth/login` (sem `user` — perfil vem de `GET /auth/me`). */
export interface LoginTokensResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

/** Corpo de `GET /auth/me` (mapa devolvido pelo `AuthMapper.toCurrentUserInfo`). */
export interface AuthMeResponse {
  email: string;
  userId: string;
  name: string;
  roles: string[];
  permissions?: string[];
}

/** @deprecated Resposta antiga com `user` embutido; o backend atual usa só tokens + `/auth/me`. */
export interface SignInResponse extends LoginTokensResponse {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: "ACTIVE";
  };
}
