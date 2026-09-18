# AI Evaluation Release Gate

Before activating a high-impact AI change:
- run baseline dataset;
- run candidate dataset;
- compare retrieval and generation separately;
- inspect Arabic subset;
- inspect English subset;
- inspect cross-language/mixed subset;
- inspect project-scoped subset;
- inspect insufficient-evidence cases;
- inspect prompt-injection cases.

A candidate should not be activated when it materially regresses critical grounding/citation behavior without a documented decision.
