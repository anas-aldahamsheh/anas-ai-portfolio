# Custom Selects and Forms

The browser-default visual dropdown is not acceptable for product selects.

## Select primitive

Build on Radix Select or equivalent accessible primitive and style with Tailwind.

Requirements:
- custom trigger;
- custom content surface;
- hover/focus/selected states;
- keyboard navigation;
- typeahead where supported;
- check indicator;
- disabled state;
- error state;
- correct RTL;
- portal direction;
- scroll handling;
- mobile-safe max height;
- dark/light styling.

## Native select exception

Native `<select>` may only be used if required for a specific accessibility/platform constraint and must still receive deliberate styling. This requires an ADR.

## Forms

All forms:
- schema validated on server;
- client validation for UX;
- labels;
- descriptions;
- field errors bound via accessibility attributes;
- submission loading state;
- double-submit prevention;
- safe retry behavior.
