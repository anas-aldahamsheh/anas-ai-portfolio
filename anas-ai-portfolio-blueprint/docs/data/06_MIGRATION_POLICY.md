# Migration Policy

- Every schema change is a committed Drizzle migration.
- No undocumented manual production schema editing.
- Migrations are reviewed for locks/data loss.
- destructive migrations use expand/migrate/contract where needed.
- deployment runs compatible migration ordering.
- backup/restore procedure documented before risky data migrations.
- rollback plan considers whether DB migration is reversible.

Vector index migrations are versioned separately from SQL migrations.
