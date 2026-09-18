# Current State

Last updated: F030 completed.

## Current feature
F030 — Conversation language matching (DONE). Next is F031 — Portfolio AI Chat.

## Repository state
- Branch: `feat/f030-conversation-language-matching`
- Last commit: Pending commit
- Completed features:
  - F001: Foundation & repository quality (DONE)
  - F002: Database & migrations (DONE)
  - F003: Authentication (DONE)
  - F004: RBAC & admin protection (DONE)
  - F005: Guest-first public access (DONE)
  - F006: Dynamic localization registry (DONE)
  - F007: Automatic RTL/LTR system (DONE)
  - F008: Light/dark theme (DONE)
  - F009: Design system & custom Select (DONE)
  - F010: Motion system (DONE)
  - F011: Dynamic navigation/footer (DONE)
  - F012: Dynamic section builder (DONE)
  - F013: Global admin inline edit mode (DONE)
  - F014: CV viewer/download/versioning (DONE)
  - F015: GitHub profile popover (DONE)
  - F016: LinkedIn profile popover (DONE)
  - F017: Project catalog (DONE)
  - F018: Project Deep Dive (DONE)
  - F019: AI provider/model registry (DONE)
  - F020: Secrets management (DONE)
  - F021: Prompt registry & versioning (DONE)
  - F022: RAG ingestion pipeline (DONE)
  - F023: BGE-M3 embedding adapter (DONE)
  - F024: Hybrid retrieval (DONE)
  - F025: Query Router (DONE)
  - F026: Query Rewriting (DONE)
  - F027: BGE Reranker Adapter (DONE)
  - F028: Context builder/dedup/budget (DONE)
  - F029: Grounded generation & citations (DONE)
  - F030: Conversation language matching (DONE)
- Conversation Language Matching Architecture implemented:
  - Contracts (`src/ai/contracts/language-resolution.ts`): `ScriptDirection`, `LanguageResolutionStrategy`, `LanguageResolutionInput`, `LanguageResolutionResult`, `LanguageResolverPort`, Zod validation schemas.
  - Heuristic Language Resolver (`src/ai/language/heuristic-resolver.ts`): `getScriptDirection`, `resolveLanguageHeuristics` evaluating explicit instructions in Arabic and English, Unicode script frequencies, Arabic and English sentence indicators/particles, handling Arabic framing with English technical terms, English framing with Arabic project names, single-word loanwords, and weak conversationLocale / previousLanguage fallback.
  - Language Resolver Service (`src/ai/language/language-resolver.ts`): `LanguageResolver` service implementing `LanguageResolverPort`.
  - Grounded Generator Integration (`src/ai/generation/grounded-generator.ts`): Integrated `languageResolver` to automatically resolve conversational language when `responseLanguage` is omitted in `GenerationInput`.
  - Admin Testing API (`app/api/admin/ai/language/test/route.ts`): Admin route for testing conversational language resolution.
  - Test suites: 506 unit and integration tests passing in Vitest across 81 test suites (81/81 passing).
- Full verification passed (Prettier 100%, ESLint 0 errors/warnings, TypeScript strict 0 errors, Vitest 506/506, Next.js build clean with all 42 static & dynamic routes compiled).

## Last successful commands
- `pnpm format:check` (passed, 100% clean)
- `pnpm lint` (passed, 0 errors, 0 warnings)
- `pnpm typecheck` (passed, strict mode, 0 errors)
- `pnpm test` (passed, 506/506 tests passed across 81 suites)
- `pnpm build` (passed, all 42 static SSG and dynamic SSR routes compiled cleanly)

## Database migrations
- `drizzle/0000_great_wendell_vaughn.sql` (committed)

## Active blockers
None.

## Next action
Begin **F031 — Portfolio AI Chat**:
1. Review `docs/features/01_AI_CHAT.md` and blueprint specs.
2. Create branch `feat/f031-portfolio-ai-chat`.
3. Implement public streaming chat endpoint (`/api/chat`), chat UI drawer/panel, message thread state, citation popovers/pills, rate limit guards, and RTL/LTR message bubbles.
4. Author unit/integration tests and verify all 5 quality gates.
