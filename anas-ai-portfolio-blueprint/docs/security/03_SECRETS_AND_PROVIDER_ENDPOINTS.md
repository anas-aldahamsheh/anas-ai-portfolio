# Secrets and Provider Endpoints

## Secrets
Provider credential fields are write-only from browser perspective.

Encrypt at rest using a server-held key or external secret manager.

## SSRF
Because admin may configure provider base URLs:
- parse URLs;
- require HTTPS in production unless explicit safe self-hosted network policy;
- block loopback/link-local/cloud metadata destinations from public/admin supplied URLs by default;
- resolve DNS carefully;
- maintain allowlist policy if feasible;
- never let public users choose arbitrary upstream URL.

## Logs
Redact:
- Authorization;
- cookies;
- API keys;
- secret query params;
- access tokens.
