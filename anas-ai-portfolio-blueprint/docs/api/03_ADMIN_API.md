# Admin API

All endpoints/mutations:
- authenticated;
- ADMIN authorized;
- validated;
- audited where sensitive;
- CSRF/session-safe;
- rate protected where relevant.

Sensitive write examples:
- provider secret update;
- model assignment;
- prompt publish;
- section delete;
- CV publish;
- reindex.

Never return plaintext stored secrets.
