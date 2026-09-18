# Admin RBAC

## Authorization
Every `/admin` page and every privileged mutation checks the session and ADMIN permission server-side.

## Deny by default
Unknown role or missing permission -> deny.

## UI
Admin navigation is rendered only after verified admin context.
This is convenience, not the security boundary.

## Audit
Role changes, secret changes, model changes, prompt publishing, section deletion, CV publishing and reindex operations are audited.
