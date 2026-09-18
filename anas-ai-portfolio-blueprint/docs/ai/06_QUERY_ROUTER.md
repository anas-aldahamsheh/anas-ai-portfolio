# Query Router

Purpose: choose retrieval policy and scope, not generate the final answer.

## Initial route labels
Store route definitions/config in the database. Suggested semantic categories:
- profile;
- project;
- skills;
- experience;
- certification;
- technical detail;
- job fit;
- CV;
- broad portfolio.

## Output schema
```json
{
  "route_id": "string",
  "confidence": 0.0,
  "entity_hints": [],
  "needs_rewrite": true,
  "retrieval_policy_id": "string"
}
```

## Safety
Router output is validated.
Invalid/unknown route falls back to a safe broad retrieval policy configured in DB.

## No hardcoded answer behavior
Router selects a policy. It does not map questions to canned responses.
