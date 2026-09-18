# Threat Model

## Assets
- admin account;
- API/provider credentials;
- unpublished content;
- CV/media;
- user accounts;
- AI configuration;
- prompt registry;
- audit logs;
- database;
- vector index.

## Threats
- broken access control;
- privilege escalation;
- credential theft;
- XSS;
- CSRF;
- SQL injection;
- SSRF through configurable endpoints;
- malicious file upload;
- prompt injection;
- data exfiltration through RAG;
- public retrieval of draft/admin content;
- brute force;
- API cost abuse;
- poisoned content/index;
- insecure redirects;
- secret leakage in logs;
- supply-chain vulnerabilities.

## Controls
- server-side RBAC;
- Zod validation;
- ORM parameterization;
- CSP/security headers;
- safe URL allow/deny rules for provider endpoints;
- file magic-byte validation;
- rate limits;
- encrypted secrets;
- audit;
- prompt injection boundaries;
- retrieval filters;
- dependency scanning;
- safe markdown renderer;
- no arbitrary admin JS execution.
