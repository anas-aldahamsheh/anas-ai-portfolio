# Publishing and Audit

## Publishing
Separate edit/draft from public published state for content where accidental exposure matters.

## Audit event
Capture:
- actor user ID;
- action;
- target type/ID;
- timestamp;
- request/correlation ID;
- safe before/after summary or diff reference;
- IP metadata only if justified by privacy policy;
- result;
- reason where supplied.

Never log:
- passwords;
- full API keys;
- raw session tokens.

## High-value events
- role change;
- prompt publish;
- model assignment;
- secret update;
- CV publish;
- content deletion;
- reindex;
- feature flag change.
