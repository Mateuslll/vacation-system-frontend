# 🏢 Task Flow Manager

> **Sistema Completo de Gestão Empresarial**

Sistema moderno e completo para gerenciamento de usuários, solicitações de férias e processos empresariais. Desenvolvido com Next.js 15, React 19 e as mais modernas tecnologias web.

## 🎯 **Funcionalidades Principais**

### 👥 **Gestão de Usuários**
- ✅ **CRUD Completo** - Criar, visualizar, editar e gerenciar usuários
- ✅ **Sistema de Roles** - USER, MANAGER, ADMIN com permissões específicas
- ✅ **Atribuição de Managers** - Hierarquia organizacional
- ✅ **Filtros Avançados** - Busca por colaboradores e roles
- ✅ **Interface Responsiva** - Tabelas e modais otimizados

### 🏖️ **Gestão de Férias**
- ✅ **Solicitações Inteligentes** - Calendário com validações de negócio
- ✅ **Aprovação/Rejeição** - Fluxo completo com comentários
- ✅ **Filtros por Contexto** - Todas/Minhas/Meu Time
- ✅ **Validações Automáticas** - Mínimo 5 dias, datas bloqueadas
- ✅ **Dashboard Analytics** - Cards com estatísticas em tempo real

### 🔐 **Autenticação & Autorização**
- ✅ **Login/Registro** - Fluxo completo com validação
- ✅ **JWT Tokens** - Sessões seguras com refresh automático
- ✅ **Quick Login** - Botões para Admin/User (desenvolvimento)
- ✅ **Proteção de Rotas** - Middleware de autenticação
- ✅ **Controle de Acesso** - UI dinâmica baseada em roles

---

## ⚡ Quick Review (Docker Hub)

As duas imagens publicas ja estao no Docker Hub:
- `mateuslll/taskflow-frontend:latest`
- `mateuslll/taskflow-backend:latest`

### Step by step

1. Execute o comando abaixo na raiz de **qualquer um** dos dois repositorios (`task-flow-frontend` ou `task-flow-backend`), onde existe o ficheiro `docker-compose.review.yml`:

   ```bash
   docker compose -p task-flow-app -f docker-compose.review.yml up -d
   ```

2. O Docker vai iniciar todo o ambiente automaticamente (**frontend + backend + base de dados**).

3. Abra a aplicacao em: `http://localhost:3000`

**Acessos:**
- Frontend: http://localhost:3000
- API: http://localhost:8080/api/v1
- Swagger: http://localhost:8080/swagger-ui/index.html
- PostgreSQL: localhost:5540 (user: `taskflow`, password: `taskflow123`, db: `taskflow`)

Para encerrar:

```bash
docker compose -p task-flow-app -f docker-compose.review.yml down
```

---

## 🛠️ **Stack Tecnológico**

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - App Router, Server Components, Turbopack
- **[React 19](https://react.dev/)** - Hooks, Context, Suspense
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática completa
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilização utilitária moderna
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes acessíveis e customizáveis

### **Estado & Forms**
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado global
- **[React Hook Form](https://react-hook-form.com/)** - Formulários performáticos
- **[Yup](https://github.com/jquense/yup)** - Validação de schemas
- **[js-cookie](https://github.com/js-cookie/js-cookie)** - Gestão de cookies/tokens

### **UI/UX & Utils**
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones modernos e consistentes
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[Axios](https://axios-http.com/)** - Cliente HTTP com interceptadores

---

## 📂 **Arquitetura de Pastas**

```
src/
├── 📱 app/                     # Next.js App Router
│   ├── 🔐 (auth)/             # Grupo de rotas de autenticação
│   │   ├── sign-in/           # Página de login
│   │   └── sign-up/           # Página de registro
│   ├── 📊 dashboard/          # Área administrativa protegida
│   │   ├── users/             # Gestão de usuários
│   │   │   ├── [id]/          # Detalhes do usuário
│   │   │   └── page.tsx       # Lista de usuários
│   │   ├── vacation-requests/ # Gestão de férias
│   │   │   ├── [id]/          # Detalhes da solicitação
│   │   │   ├── new/           # Nova solicitação
│   │   │   └── page.tsx       # Lista de solicitações
│   │   ├── layout.tsx         # Layout com sidebar
│   │   └── page.tsx           # Dashboard principal
│   ├── favicon.ico            # Ícone da aplicação
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout raiz
│   └── page.tsx               # Página inicial
│
├── 🧩 components/             # Componentes reutilizáveis
│   ├── ui/                    # Componentes base (shadcn/ui)
│   │   ├── button.tsx         # Botões estilizados
│   │   ├── card.tsx           # Cards e containers
│   │   ├── dialog.tsx         # Modals e diálogos
│   │   ├── input.tsx          # Campos de entrada
│   │   ├── select.tsx         # Dropdowns e selects
│   │   └── ...                # Outros componentes UI
│   ├── CreateUserModal.tsx    # Modal de criação de usuário
│   ├── VacationRequestsTable.tsx # Tabela de solicitações
│   └── customInput.tsx        # Input customizado
│
├── 🎣 hooks/                  # Custom Hooks por domínio
│   ├── auth/                  # Hooks de autenticação
│   │   ├── useAuthForm.ts     # Login/logout
│   │   ├── useQuickSignIn.ts  # Login rápido (dev)
│   │   └── useRegisterUser.ts # Registro de usuário
│   ├── users/                 # Hooks de usuários
│   │   ├── useCreateUser.ts   # Criação de usuário
│   │   ├── useGetUser.ts      # Buscar usuário específico
│   │   ├── useListUsers.ts    # Listar usuários
│   │   └── ...                # Outros hooks de usuário
│   └── vacation/              # Hooks de férias
│       ├── useGetVacationRequests.ts    # Listar solicitações
│       ├── useCreateVacationRequest.ts  # Criar solicitação
│       ├── useActionsVacation.ts        # Aprovar/rejeitar
│       └── ...                # Outros hooks de férias
│
├── 📚 lib/                    # Utilitários e configurações
│   ├── api.ts                 # Cliente Axios configurado
│   ├── api-errors.ts          # Tratamento de erros HTTP
│   ├── utils.ts               # Utilitários gerais (cn, etc)
│   └── validations/           # Schemas de validação
│       └── schemas/           # Schemas Yup organizados
│
├── 🗃️ stores/                 # Estado global (Zustand)
│   └── user.ts                # Store do usuário logado
│
├── 🏷️ types/                  # Definições TypeScript
│   ├── forms.ts               # Tipos de formulários
│   ├── jwt.ts                 # Tipos de autenticação
│   ├── user.ts                # Tipos de usuário
│   └── vacation.ts            # Tipos de férias
│
├── middleware.ts              # Middleware de autenticação
└── ...                        # Configurações (Tailwind, etc)
```

---

## 🚀 **Como Executar**

### **Pré-requisitos**
- **Node.js** 18+
- **npm** ou **yarn**
- **Backend API** rodando (configurar URL no `.env`)

### **Instalação**

1. **Clone o repositório**
```bash
git clone https://bitbucket.org/mateuslll/task-flow-frontend/src/main/
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute em desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Abra no navegador**
```
http://localhost:3000
```

### **Build para Produção**
```bash
npm run build

npm run start
```

---

## 🎮 **Como Usar**

### **Acesso Rápido (Desenvolvimento)**
1. **Acesse** `http://localhost:3000`
2. **Use os botões de Quick Login:**
    - 🔴 **Administrador** - Acesso completo
    - 🟡 **Funcionário** - Acesso limitado

### **Login Manual**
- **Email Admin:** `admin@taskflow.com`
- **Senha:** `Admin@123`
- **Email User:** `user@taskflow.com`
- **Senha:** `User@123`

### **Fluxo Principal**

#### **Como Administrador/Manager:**
1. 📊 **Dashboard** → Visão geral do sistema
2. 👥 **Usuários** → Criar, editar, atribuir managers
3. 🏖️ **Solicitações de Férias** → Aprovar/rejeitar, visualizar todas
4. ⚙️ **Configurações** → Personalizar sistema

#### **Como Funcionário (USER):**
1. 📊 **Dashboard** → Visão pessoal
2. 🏖️ **Minhas Férias** → Criar e acompanhar solicitações

---

## 🔐 **Sistema de Roles**

| Role | Acesso | Funcionalidades |
|------|--------|-----------------|
| **👑 ADMIN** | Completo | Todos os usuários, configurações, relatórios |
| **👨‍💼 MANAGER** | Parcial | Usuários da equipe, aprovações, gestão |
| **👤 USER** | Limitado | Apenas próprias férias e dados pessoais |

---

## 🎨 **Padrões de Código**

### **Componentes**
```tsx
interface ComponentProps {
}

export function Component({ ...props }: ComponentProps) {
  return ();
}
```

### **Hooks Customizados**
```tsx
export const useCustomHook = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const action = async () => {
  };

  return { data, loading, error, action };
};
```

### **Validação com Yup**
```tsx
export const schema = yup.object({
  field: yup.string().required('Campo obrigatório'),
});

export type SchemaType = yup.InferType<typeof schema>;
```

---

## 🏗️ **Arquitetura & Decisões**

### **App Router (Next.js 15)**
- **Layouts aninhados** para diferentes seções
- **Grupos de rotas** `(auth)` para organização
- **Loading states** com Suspense boundaries
- **Middleware** para proteção de rotas

### **Estado Global**
- **Zustand** para estado do usuário autenticado
- **Persistência** automática no localStorage
- **Hooks customizados** para lógica de negócio específica

### **Estilização**
- **Tailwind CSS** com utilitários consistentes
- **shadcn/ui** para componentes base acessíveis
- **Variants API** para consistência visual
- **Responsive design** mobile-first

### **Performance**
- **Code splitting** automático por rota
- **Lazy loading** de componentes pesados
- **Optimized images** e fonts
- **Bundle analysis** com Turbopack