# Non-Negotiables

These rules override convenience and shortcuts.

1. Use Next.js as the web application framework.
2. Use TypeScript with strict mode.
3. Use Tailwind CSS for styling.
4. Use a modular-monolith architecture unless a documented ADR justifies extraction.
5. No hardcoded portfolio content.
6. No hardcoded owner-specific GitHub/LinkedIn URLs.
7. No hardcoded CV content.
8. No canned chatbot answer database.
9. No keyword-response chatbot.
10. No ungrounded claims about the portfolio owner.
11. Public portfolio is fully usable without login.
12. Admin capabilities are server-authorized.
13. All user-facing content has Arabic and English handling.
14. RTL/LTR correctness is a release blocker.
15. CSS must use logical directions where applicable.
16. Every native-looking select/dropdown must use the project's styled Select primitive.
17. Light and dark modes are first-class and tested.
18. The UI must remain visually restrained.
19. No neon/gradient-heavy AI aesthetic.
20. Motion must respect `prefers-reduced-motion`.
21. Every external AI/provider dependency is behind an adapter.
22. Embedding model/provider is configurable.
23. Reranker model/provider is configurable.
24. Generation model/provider is configurable.
25. Prompt registry is versioned and admin-editable.
26. API secrets are encrypted at rest or stored through a secure secret mechanism, never plaintext in client-visible data.
27. RAG is modular; each stage is independently replaceable/testable.
28. Retrieval and generation are evaluated separately.
29. Deleting content removes or tombstones associated vector entries correctly.
30. Model changes support safe re-indexing and versioning.
31. No production feature is `DONE` without tests and documentation.
32. Avoid storing guest chat history by default.
33. Do not expose chain-of-thought. RAG debug shows pipeline metadata only.
34. Site operations must degrade safely if an AI provider is unavailable.
35. All destructive admin actions require confirmation.
36. Every admin write is audit logged.
37. Server validation is mandatory.
38. Rate limiting is mandatory for auth, chat, job analysis, and admin-sensitive endpoints.
39. Production errors never expose stack traces or secrets.
40. Every architectural change that contradicts this package requires an ADR explaining why.
