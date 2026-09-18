# Dynamic Section Builder

The administrator may not know all future sections. Build a composable section system.

## Admin operations
- create section;
- choose route/page;
- localized title/metadata;
- visibility;
- order;
- draft/published;
- schedule optional future publish support;
- add/reorder/remove blocks;
- clone;
- archive;
- delete with safety checks.

## Supported generic blocks
- rich text;
- heading;
- media;
- link group;
- card collection;
- project collection;
- metrics;
- timeline;
- skill/tag collection;
- accordion;
- tabs;
- quote/evidence;
- table;
- code/architecture block;
- CTA;
- custom data list.

## Security boundary
Do NOT permit arbitrary JavaScript/React code from the database.
"Arbitrary section" means arbitrary composition of safe supported blocks, not remote code execution.

## Extensibility
Adding a new block renderer is a code change isolated behind the block registry; existing sections remain unaffected.
