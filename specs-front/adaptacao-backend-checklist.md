# Checklist — adaptar o front ao backend atual

Marcar `[x]` conforme for implementando. Referência técnica: [api-contract-and-errors.md](./api-contract-and-errors.md).

## Prioridade P0 — erros e mensagens

- [x] **`src/lib/api-errors.ts`**: ler `detail` (e fallbacks) do `ProblemDetail`; tipar resposta de erro.
- [x] **Interceptor de resposta** em `src/lib/api.ts`: normalizar 4xx/5xx com `parseApiFailure` em `apiPrivate` e `apiPublic` (erro de *request* já não passa por `handleApiError`).
- [x] Hooks com `console.error` passam a **toast** ou **estado de erro** com `getErrorMessage` (lista de férias, equipa, aprovadas, utilizadores, detalhe, etc.).

## Prioridade P1 — férias

- [x] **`src/hooks/vacation/useCreateVacationRequest.ts`**: toasts com mensagem da API (**400** gestor/validação, **403**, **409** overlap); `onSuccess` para redirecionar após criação.
- [x] **`src/types/vacation.ts`**: `userRole?: string | null` em `VacationRequest` e `VacationRequestListItem`.
- [x] **`useActionsVacation`**: aprovar / rejeitar / cancelar com toast a partir de `detail` da API.
- [x] Página **edição** `PUT` de férias: detalhe `PENDING` (dono ou ADMIN) com `useUpdateVacationRequest` → `PUT /vacation-requests/{id}`; erros **409**/outros via `parseApiFailure` / toast.

## Prioridade P2 — utilizadores (admin)

- [x] Fluxo **criar utilizador** → **atribuir gestor** documentado na UI (modal criar, lista de utilizadores, nova férias, detalhe com texto RF-08).
- [x] **`useChangeManager`**: mensagens via `parseApiFailure`; após sucesso `fetchUser` + `useEffect` sincroniza `selectedManager` com `user.managerId`.

## Prioridade P3 — consistência

- [ ] Revisar `README.md` do frontend com variáveis de ambiente e link para `specs-front`.
- [ ] (Opcional) testes e2e ou smoke Playwright que chamem a API local com os mesmos fluxos do `smoke_api.py` (23 passos reduzidos ao subconjunto crítico).

## Prioridade P4 — UX dashboard / auth / navegação

- [x] Login rápido: remover atalho **Funcionário** (`useQuickSignIn`, `sign-in`).
- [x] Dashboard: métricas de férias (pendentes / aprovadas / rejeitadas) a partir de `GET /vacation-requests` (gestão) ou `GET /vacation-requests/my` (colaborador); total de utilizadores só para ADMIN/MANAGER; cartão **Configurações** removido (sem rota).
- [x] Sidebar: nome e email reais após login/registo (`buildSessionUser` + `GET /auth/me` no registo); entrada **Dashboard** também para `USER`.
- [x] `/dashboard/users`: botão **Voltar** para o dashboard; colaborador `USER` redirecionado e sem chamadas a `/users/managers-and-admins`.
- [x] Registo: `autoComplete="off"` no formulário/email para evitar pré-preenchimento pelo browser; `sign-up` no middleware com token → dashboard.
- [x] Backend: `AccessDeniedException` → **403** ProblemDetail (evita 500 em endpoints `@PreAuthorize` para `USER`).

## Ficheiros já identificados

| Área | Ficheiros |
| --- | --- |
| HTTP / erros | `src/lib/api.ts`, `src/lib/api-errors.ts` |
| Férias | `src/hooks/vacation/*`, `src/components/VacationRequestsTable.tsx`, `src/app/dashboard/vacation-requests/**` |
| Utilizadores | `src/hooks/users/*`, `src/components/UsersTable.tsx`, `src/app/dashboard/users/**` |
| Auth | `src/hooks/auth/*`, `src/lib/auth-user.ts`, `src/app/(auth)/*`, `src/middleware.ts` |
