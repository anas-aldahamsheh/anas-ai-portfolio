# Global Admin Inline Edit Mode

## Behavior
Admin toolbar toggles Edit Mode.

When enabled:
- editable regions show a subtle pencil/edit handle on hover and keyboard focus;
- handle opens a contextual editor;
- content changes are validated;
- optimistic UI is allowed only with rollback;
- saved changes update cache tags;
- publish state is explicit.

## Scope
Inline editing applies to:
- text blocks;
- section metadata;
- navigation labels;
- social profiles;
- project fields;
- supported layout settings;
- UI text;
- feature labels.

Sensitive AI/provider settings remain in dedicated Admin Control Center instead of cluttering public pages.

## Accessibility
Edit handles must be reachable and labeled by keyboard/screen reader.
