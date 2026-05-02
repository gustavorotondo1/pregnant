# Pregnant

Aplicacao web responsiva para acompanhamento completo de gestacao, com foco em bem-estar, informacao e organizacao da jornada.

## Stack

- Next.js 16 + TypeScript + App Router
- Tailwind CSS 4
- Supabase (Auth Google OAuth, PostgreSQL, Storage)
- React Hook Form + Zod (validacoes)
- Recharts (graficos)
- React Calendar (consultas)
- React Toastify (feedback de acoes)
- html2canvas + jsPDF (exportacao PDF)
- idb + Service Worker (base offline-first)

## Funcionalidades implementadas

- Login Google com Supabase (com fallback de modo demonstracao)
- Onboarding de primeiro acesso (nome, peso, semana, DPP, DUM)
- Dashboard com resumo semanal, proxima consulta e grafico de peso
- Registro de saude (peso, pressao, glicemia)
- Diario de bem-estar com sintomas e observacoes
- Gestao de consultas (calendario, agendamento e historico)
- Exames/documentos com upload inicial e galeria
- Guia semanal personalizavel (1 a 42)
- Ferramentas: calculadora gestacional, contador de contracoes, checklists
- Perfil com diretrizes de privacidade e LGPD/GDPR
- Exportacao de relatorio em PDF
- Modo claro/escuro

## Estrutura

- src/app: rotas da aplicacao
- src/components: componentes reutilizaveis
- src/hooks: hooks customizados
- src/lib: utilitarios, mock data e integracao Supabase
- src/types: tipos de dominio
- supabase/schema.sql: schema SQL completo com RLS

## Setup local

1. Instale dependencias:

```bash
npm install
```

2. Configure variaveis:

```bash
cp .env.example .env.local
```

Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.

3. Aplique o schema no Supabase SQL Editor:

- Execute o conteudo de supabase/schema.sql
- Configure Google OAuth no painel do Supabase Auth
- Adicione a URL de callback correspondente ao seu ambiente

4. Rode em desenvolvimento:

```bash
npm run dev
```

## Compliance e seguranca

- RLS habilitado para tabelas sensiveis
- Politicas para acesso somente ao proprio usuario
- Bucket de storage privado
- Base para operacoes de privacidade (consentimento, exportacao e exclusao)

## Acessibilidade e UX

- Contraste adequado em temas claro e escuro
- Labels e mensagens de erro amigaveis
- Layout mobile-first e navegacao previsivel
- Textos empaticos e linguagem humanizada

## Proximos passos recomendados

1. Conectar todos os formularios ao Supabase (atualmente com base pronta e fluxos iniciais)
2. Implementar notificacoes push para lembretes de consulta
3. Adicionar testes E2E dos fluxos criticos
4. Refinar PWA com estrategia de cache por rota e sincronizacao em background
