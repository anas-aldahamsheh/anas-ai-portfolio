# Dynamic Content Model

## Source of truth

PostgreSQL stores content and structure.

## Page
Defines route capability and publication.

## Section
A page contains ordered sections.
A section has:
- stable ID;
- semantic type;
- display config;
- order;
- visibility;
- publish state;
- localization.

## Block
A section contains ordered safe blocks.
Block stores typed JSON validated against block-specific Zod schema.

## Translation
Do not duplicate structural IDs by language unnecessarily. Keep structure stable and localized values separate.

## Publishing
Recommended states:
- draft;
- published;
- archived.

Content editing and public retrieval should be separate enough to prevent accidental draft leakage.
