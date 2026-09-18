# Authentication and Admin Security

- proven auth library;
- secure cookies;
- session rotation/expiration;
- password reset tokens single-use/expiring;
- rate limit sign-in;
- generic auth failure;
- email verification ready;
- optional MFA should be straightforward to add for admin;
- ADMIN role cannot be set by registration input;
- bootstrap admin through secure one-time CLI/env process;
- all admin APIs call shared authorization guard;
- CSRF protections appropriate to mutation mechanism;
- audit sensitive admin actions.

Use deny-by-default permission helpers.
