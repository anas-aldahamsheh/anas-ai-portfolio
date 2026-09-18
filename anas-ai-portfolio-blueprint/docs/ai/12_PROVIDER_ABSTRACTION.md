# AI Provider Abstraction

Separate model role from provider.

## Roles
- generation;
- embedding;
- reranking;
- optional router/rewrite/evaluator.

## Database concepts
`ai_provider`
`ai_model`
`ai_model_assignment`
`ai_secret_reference`
`ai_runtime_policy`

## Provider interface behavior
- request;
- timeout;
- cancellation;
- response validation;
- normalized usage metrics;
- normalized errors;
- health check.

## Admin
Changing active model assignment must not require deployment.

## Secret safety
Client receives display-safe provider metadata only.
Secret values never round-trip to client after creation.
Show only masked fingerprint/last characters where safe.
