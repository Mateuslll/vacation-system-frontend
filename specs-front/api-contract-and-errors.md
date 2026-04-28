# Contrato da API e erros no front-end

## 1. Formato de erro (Spring RFC 7807 `ProblemDetail`)

O backend devolve JSON com campos típicos:

- `type`, `title`, `status`, `detail`, `instance`, `timestamp`
- opcional: `errors` (lista de violações)

**Problema atual no front:** em `task-flow-frontend/src/lib/api-errors.ts`, a mensagem é lida de `data?.message`. O Spring usa **`detail`**, não `message`. Resultado: muitas respostas 4xx caem em texto genérico `"API Error"`.

**Correção recomendada:** extrair mensagem assim (ordem de prioridade):

1. `data.detail` (string)
2. `data.title` (se útil e curto)
3. primeiro item de `data.errors` se existir estrutura conhecida
4. fallback `"Erro na API"` / i18n

Tipar `ProblemDetail` num interface TypeScript partilhado (ex.: `src/types/problem-detail.ts`).

## 2. Mapeamento HTTP → comportamento UI

| Status | Significado típico | Ação UI sugerida |
| --- | --- | --- |
| **400** | Validação, gestor ausente ao criar férias, regra de negócio bloqueante | Toast de aviso com `detail`; em formulários, marcar contexto se `errors` vier preenchido |
| **401** | Token inválido/expirado | Limpar sessão, redirecionar sign-in; opcional refresh se existir fluxo |
| **403** | Sem permissão (ex.: MANAGER/ADMIN a criar férias; aprovar fora da equipa) | Toast claro; esconder ações proibidas quando possível (derivado do role) |
| **404** | Recurso inexistente | Página 404 ou toast + voltar |
| **409** | Conflito: overlap de férias (PENDING/APPROVED), pedido já processado ao editar/cancelar | Toast com **texto do servidor** (overlap explica período conflituoso na `detail` quando disponível) |
| **422** | Validação semântica (ex.: período inválido no domínio) | Igual a 400 com copy específica |

## 3. Regras de negócio que o UI deve refletir

### Férias (`POST /vacation-requests`)

- Apenas utilizadores com role **USER** criam pedidos (403 para ADMIN/MANAGER).
- **Gestor obrigatório:** `managerId` tem de estar definido no utilizador autenticado; caso contrário **400** com mensagem explícita (ver RF-08 no backend `specs/spec.md`).
- **Overlap:** não pode haver sobreposição (datas inclusivas) com outro pedido **PENDING** ou **APPROVED** do mesmo utilizador ou de outro colaborador (**409**).

**Implicações UX:**

- Antes de mostrar o formulário “Nova solicitação”, pode mostrar callout se `GET /users/{id}` ou `/auth/me` indicar `managerId` null (evitar submissão frustrante).
- Após criar colaborador (admin), sugerir passo “Atribuir gestor” se ainda não existir.

### Resposta de férias (`VacationRequestResponseDTO`)

Campos expostos pelo backend (alinhamento de tipos):

| Campo | Tipo JSON |
| --- | --- |
| `id`, `userId`, `approvedBy` | UUID string |
| `userName`, `userRole`, `reason`, `status`, `approvedByName`, `rejectionReason` | string |
| `startDate`, `endDate` | `yyyy-MM-dd` |
| `days` | number |
| `createdAt`, `updatedAt`, `processedAt` | ISO-8601 date-time |

O tipo `VacationRequest` em `src/types/vacation.ts` deve incluir **`userRole`** (opcional `string | null`) para não perder dados se a UI precisar.

## 4. Auth

- Login: o front (`useAuthForm`) espera `accessToken`, `refreshToken`, `expiresIn` e **`user`** no JSON de login, e ainda chama **`GET /auth/me`** para enriquecer `roles`. Manter alinhado com `LoginUserOutput` / controller actuais do backend; se RF-01 em `task-flow-backend/specs/spec.md` (login sem `user`) for implementada no futuro, ajustar o hook para popular o store só a partir de `/auth/me`.
- Base URL: `NEXT_PUBLIC_API_BASE_URL` ou `NEXT_API_BASE_URL` em `src/lib/api.ts`; alinhar porta com o guia (8080 vs 8082 no smoke).

## 5. Testes manuais cruzados

Reutilizar a lista “go/no-go” em `task-flow-backend/specs/endpoint-test-guide.md` §4, com foco nos cenários 3–6 (criação com gestor, overlap 403/409, aprovação equipa vs fora da equipa).
