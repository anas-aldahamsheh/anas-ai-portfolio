# Administrator Full Control Requirement

"Full control" is implemented through safe configuration surfaces, not arbitrary code execution.

Admin can control:
- visible content;
- section structure;
- localized labels;
- navigation;
- CV;
- social accounts;
- project data;
- block data;
- publish state;
- supported layout settings;
- theme tokens;
- feature flags;
- AI providers;
- endpoint URLs subject to SSRF protections;
- credentials through write-only secret fields;
- model IDs;
- model assignments;
- prompts;
- RAG parameters;
- index lifecycle;
- evaluation configuration.

Admin cannot:
- upload arbitrary server-executed JavaScript;
- bypass authorization;
- expose secrets to client;
- disable non-bypassable security invariants such as server-side auth checks;
- create an unsafe provider URL without passing policy validation.

This interpretation satisfies control without violating production security.
