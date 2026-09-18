# Inline Edit Technical Design

## Content identity
Every editable renderer receives an immutable content reference:
```ts
type EditableRef = {
  entityType: string;
  entityId: string;
  fieldOrBlockId: string;
  locale?: "ar" | "en";
  version: number;
}
```

## Admin rendering
Server confirms admin. Client receives edit capability only for current admin session.

## Editing
1. admin activates Edit Mode;
2. component renders edit handle;
3. handle opens editor;
4. client submits expected version;
5. server checks ADMIN;
6. server validates;
7. optimistic concurrency prevents overwriting a newer edit;
8. transaction writes change;
9. audit event;
10. index job when knowledge content changed;
11. revalidate cache tags;
12. UI refreshes.

## Conflict
Return a conflict result with current server version; do not silently overwrite.

## Delete
Requires confirmation showing affected content and whether index removal will occur.
