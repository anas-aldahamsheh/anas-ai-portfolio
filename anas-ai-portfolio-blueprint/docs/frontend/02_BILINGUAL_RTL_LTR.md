# Bilingual Arabic/English + RTL/LTR Specification

This is a release-blocking feature.

## Root direction

For each locale:
- Arabic -> `<html lang="ar" dir="rtl">`
- English -> `<html lang="en" dir="ltr">`

## Mixed dynamic content

Use `dir="auto"` on content whose script may differ from page locale:
- chat messages;
- URLs;
- code;
- project titles entered independently;
- pasted job descriptions;
- citation titles;
- user inputs where appropriate.

## CSS rule

Use logical layout properties.

Prefer:
- margin-inline-start/end;
- padding-inline-start/end;
- inset-inline-start/end;
- text-align: start/end;
- Tailwind logical utilities where available.

Avoid direction-assuming:
- `left-*` / `right-*` for semantic spacing;
- hardcoded arrow direction;
- manually reversed DOM purely for RTL.

## Directional icons

Icons meaning "forward/back", chevrons and breadcrumbs must mirror by direction.
Non-directional icons must not mirror.

## Overlay components

The following must inherit/receive correct direction:
- Dialog
- Popover
- Tooltip
- Dropdown
- Select content
- Command palette
- Toasts
- admin editors

Portals must not lose the current locale direction.

## Chat

Each message wrapper has direction determined from its content or conversation language.
Code blocks remain LTR.
URLs must not break layout.

## Tables and charts

- table alignment uses logical start/end;
- numeric columns can remain LTR where readability requires;
- chart legends follow current locale;
- axis numerical direction should not be arbitrarily reversed.

## Tests

E2E screenshots/behavior must cover:
- Arabic light;
- Arabic dark;
- English light;
- English dark;
- mixed Arabic + English;
- long URLs;
- inline code;
- mobile dialogs;
- select menus;
- admin edit overlays.
