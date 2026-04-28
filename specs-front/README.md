# Specs front-end — Task Flow

Documentação de planeamento e contrato para alinhar o **`task-flow-frontend`** (Next.js) com o **`task-flow-backend`** após a refatoração (regras de férias, `ProblemDetail`, smoke 23 cenários).

## Documentos

| Ficheiro | Conteúdo |
| --- | --- |
| [api-contract-and-errors.md](./api-contract-and-errors.md) | Corpo de erro RFC, mapeamento HTTP → UI, payloads de férias/utilizadores |
| [adaptacao-backend-checklist.md](./adaptacao-backend-checklist.md) | Lista de tarefas por ficheiro/hook no repositório `task-flow-frontend` |
| [roadmap-ux.md](./roadmap-ux.md) | Fase 2+: modo escuro, PT/EN, navegação, scroll e voltar |

## Fonte de verdade (API)

- `task-flow-backend/specs/endpoint-test-guide.md` — matriz de status e fluxos críticos
- `task-flow-backend/specs/spec.md` — RF-07 (overlap), RF-08 (gestor na criação)
- `task-flow-backend/specs/design.md` — regras de negócio resumidas
- `task-flow-backend/scripts/smoke_api.py` — regressão automatizada

## Ordem recomendada

1. **Contrato de erros** (`api-errors` + interceptor) — sem isto, toasts mostram mensagens genéricas ou vazias.
2. **Férias** — mensagens 400 (sem gestor), 409 (overlap PENDING/APPROVED), tipos alinhados ao DTO.
3. **Fluxos admin** — criar utilizador → atribuir gestor antes de o colaborador pedir férias (RF-08).
4. **Roadmap UX** — após o utilizador perceber erros e fluxos corretos.
