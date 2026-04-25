export interface JwtPayload {
  roles: string[];
  name: string;
  rules: string[];
  userId: string;
  email: string;
  status: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  jti: string;
  type: string;
}
