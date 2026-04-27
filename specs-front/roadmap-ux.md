# Roadmap UX (fase após alinhamento API)

Estas entregas assumem que a **Fase 1** (contrato de erros + regras RF-07/RF-08 na UI) está estável. Ver [adaptacao-backend-checklist.md](./adaptacao-backend-checklist.md).

## 1. Modo escuro

- **Stack sugerida:** `next-themes` + variáveis CSS no `globals.css` (ou tokens do shadcn/ui com `class` strategy no `layout`).
- **Escopo:** `src/app/layout.tsx`, componentes em `src/components/ui/*`, páginas dashboard e auth.
- **Critério de aceite:** preferência persistida (localStorage), sem flash na hidratação (suppressHydrationWarning no provider se necessário).

## 2. Internacionalização (Português PT ↔ Inglês)

- **Stack sugerida:** `next-intl` (App Router) ou `react-i18next` com namespaces (`common`, `auth`, `vacations`, `errors`).
- **Ícone / seletor de idioma:** componente na barra do dashboard (e opcionalmente no auth); locale na URL (`/pt/dashboard`, `/en/dashboard`) ou cookie `NEXT_LOCALE`.
- **Prioridade de strings:** mensagens de erro vindas da API permanecem no idioma do **backend** até haver catálogo de códigos→mensagem no front; copiar `title`/`detail` ou mapear códigos estáveis se o backend os expuser no futuro.
- **Critério de aceite:** troca de idioma sem perder estado da sessão; datas e números formatados com `Intl` por locale.

## 3. Navegação entre páginas

- **Breadcrumbs** nas secções `dashboard/users`, `dashboard/vacation-requests`, detalhe `[id]`.
- **Navegação lateral (sidebar)** estável com estado ativo por rota; links para “Minhas férias”, “Equipa”, “Todos” conforme role (espelhar permissões do backend).
- **Critério de aceite:** em 3 cliques ou menos desde o dashboard até qualquer detalhe frequente.

## 4. Scroll e botão “Voltar”

- **Scroll:** ao navegar entre rotas do App Router, resetar scroll ao topo (`useEffect` + `window.scrollTo` ou padrão do Next 13+ com `scroll: true` no `Link`).
- **Voltar:** botão explícito nas páginas de detalhe (`vacation-requests/[id]`, `users/[id]`) que chama `router.back()` com fallback `router.push('/dashboard/...')` se não houver histórico.
- **Critério de aceite:** após criar recurso e redirecionar, o utilizador vê topo da página; detalhe tem ação “Voltar” visível em mobile.

## 5. Ordem de implementação sugerida

1. Contrato de erros + toasts (P0 checklist).  
2. i18n (estrutura + inglês como base secundária).  
3. Modo escuro.  
4. Navegação (breadcrumbs + sidebar).  
5. Scroll + voltar.

Documentar decisões (ex.: “detalhe da API sempre PT”) em PR ou neste ficheiro sob secção “Decisões”.
