# CI/CD

On pull request:
- install locked dependencies;
- formatter check;
- ESLint;
- TypeScript;
- unit tests;
- integration tests where available;
- build;
- dependency/security audit;
- migration validation;
- optional Playwright smoke suite.

On protected deployment:
- artifact build;
- migrations;
- deployment;
- smoke tests;
- rollback path.

Do not deploy a failed build.
