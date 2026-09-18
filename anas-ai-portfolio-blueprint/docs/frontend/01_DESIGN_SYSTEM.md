# Design System

## Direction

Minimal, professional, content-first.

### Visual rules
- neutral color scale;
- one restrained accent token allowed, configurable;
- no multi-color gradient backgrounds;
- no neon glows;
- no random blobs;
- no decorative 3D objects;
- no oversized "AI" badges;
- no excessive rounded cards;
- use borders/spacing/type hierarchy before shadows.

### Typography
Use a high-quality Latin + Arabic pairing or a variable font family with excellent Arabic/Latin coverage. Font files must be loaded legally and optimized. Define typography tokens rather than ad-hoc sizes.

### Spacing
Use a consistent spacing scale. Prefer whitespace to decorative separators.

### Components
Project-owned components:
- Button
- IconButton
- Link
- Card
- Surface
- Dialog
- Popover
- Tooltip
- Select
- Combobox
- Tabs
- Accordion
- Toast
- Input
- Textarea
- Switch
- Checkbox
- Radio
- FileUpload
- DataTable
- Skeleton
- EmptyState
- ErrorState
- AdminEditHandle

### Focus
Every interactive element has a visible focus state in light/dark.

### Theme tokens
Expose safe theme tokens to admin:
- accent;
- neutral family;
- radius scale choice;
- density choice;
- motion intensity;
- content max width.

Do not permit arbitrary executable CSS through admin.
