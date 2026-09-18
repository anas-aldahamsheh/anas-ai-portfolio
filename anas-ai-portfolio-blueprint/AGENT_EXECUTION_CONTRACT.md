# Agent Execution Contract

## Agent behavior

The implementation agent is an executor, not a product designer. Product choices already defined in this package are not optional.

### MUST
- follow the tracker order unless dependency constraints require a documented change;
- make small coherent commits;
- keep the repository buildable;
- write tests with implementation;
- update docs with behavior changes;
- validate Arabic and English;
- validate RTL and LTR;
- implement server-side authorization;
- preserve modular provider interfaces;
- update tracker evidence.

### MUST NOT
- replace the architecture with microservices without an ADR;
- hardcode portfolio content "temporarily";
- use mock project data in production paths;
- add a fake testimonial;
- fabricate metrics;
- create an AI-looking neon design;
- silently downgrade Arabic retrieval;
- skip reranking because dense retrieval "seems good";
- hide admin pages only in navigation and call that authorization;
- store plaintext API keys;
- expose raw chain-of-thought;
- mark tasks done based on visual appearance only;
- add dependencies without a reason.

## Decision hierarchy

When instructions conflict, use:
1. security and correctness;
2. this package's explicit non-negotiables;
3. user's engineering principles;
4. feature specification;
5. maintainability/simplicity;
6. implementation convenience.

## Progress bookkeeping

Every completed feature entry in `FEATURE_TRACKER.md` must include:
- status;
- commit hash or PR reference;
- tests added;
- relevant paths;
- migrations;
- config changes;
- known limitations.

## Handoff quality

A replacement agent must be able to answer:
- what is finished?
- what is partially finished?
- what is broken?
- what commands pass?
- what migrations were applied?
- what is the next task?
- what environment variables are still missing?

If these are not clear, the handoff is incomplete.
