# Production Deployment

## Pre-deploy
- all CI checks pass;
- environment validation passes;
- migrations reviewed;
- backup/recovery posture checked;
- AI provider config validated in target environment;
- current index version valid.

## Deployment
1. deploy compatible app build;
2. run safe migrations;
3. run smoke tests;
4. verify health/readiness;
5. verify public Arabic/English page;
6. verify guest chat;
7. verify admin authorization;
8. monitor errors.

## Rollback
Document:
- prior app artifact;
- DB migration compatibility;
- prompt/model config rollback;
- vector index version rollback.

Never deploy an app that requires a destructive migration before compatible code is live.
