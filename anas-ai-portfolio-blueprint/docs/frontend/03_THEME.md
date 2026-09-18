# Light/Dark Theme

## Modes
- light
- dark
- system

## Persistence
Guest: cookie/local preference.
Authenticated user: profile preference may synchronize, but site remains usable before auth.

## Server rendering
Avoid first-paint flash:
- determine preference server-side where possible;
- set theme class/data attribute before interactive hydration.

## Admin
Admin can control safe design tokens, not inject arbitrary CSS/JS.

## QA
Every component must be reviewed in:
- light + Arabic
- dark + Arabic
- light + English
- dark + English

No text/background combination may depend on color alone for meaning.
