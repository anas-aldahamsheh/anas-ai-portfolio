# Definition of Done

A feature is DONE only when all applicable checks pass.

- Functional behavior matches the feature spec.
- No hardcoded portfolio content was introduced.
- Arabic works.
- English works.
- RTL works.
- LTR works.
- Light mode works.
- Dark mode works.
- Mobile works.
- Desktop works.
- Loading state exists.
- Empty state exists.
- Error state exists.
- Server validation exists.
- Authorization is server-enforced where relevant.
- Rate limiting exists where relevant.
- Structured logs exist for operationally meaningful failures.
- Unit tests cover business logic.
- Integration tests cover boundaries.
- E2E covers critical user path.
- Accessibility behavior is validated.
- No critical/high known dependency vulnerability introduced.
- Documentation updated.
- Migrations are committed.
- Build passes.
- Typecheck passes.
- Lint passes.
- Tests pass.
- Rollback implications understood.
- Tracker updated.

For AI features additionally:
- provider errors handled;
- timeout handled;
- retry policy bounded;
- outputs validated;
- prompt version recorded;
- model/provider version recorded;
- retrieval trace recorded;
- no chain-of-thought exposed;
- grounding/evaluation tests pass.
