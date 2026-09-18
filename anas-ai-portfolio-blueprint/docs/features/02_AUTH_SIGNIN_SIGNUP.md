# Sign In / Sign Up

Use Better Auth with PostgreSQL/Drizzle.

## Requirements
- email + password;
- secure password hashing delegated to proven library;
- server session;
- sign-out;
- email verification capability;
- password reset capability;
- CSRF/session protections from chosen auth framework;
- rate limiting;
- generic errors that do not enable easy account enumeration.

## UI
Auth exists but must clearly communicate that browsing the portfolio does not require an account.

## No admin self-elevation
A normal user cannot set or request the ADMIN role from client-controlled input.
