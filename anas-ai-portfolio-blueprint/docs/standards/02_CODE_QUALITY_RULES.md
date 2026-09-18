# Code Quality Rules

- TypeScript strict.
- No implicit `any`.
- Prefer explicit domain types.
- Keep components focused.
- Server Components by default.
- Minimize client bundle.
- No business rules in JSX.
- No database calls from UI components.
- No vendor SDK use outside adapters.
- No repeated Zod schemas across boundaries; centralize meaningful contracts.
- No deep relative imports across modules; use controlled aliases.
- No circular dependencies.
- Avoid barrel files that obscure dependencies.
- Errors use typed application error categories.
- Comments explain rationale.
- Every TODO contains owner/context or issue reference.
- No commented-out code.
