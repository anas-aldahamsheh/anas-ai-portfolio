# Conversation Mode

User-facing control concept: **Conversation Mode**.

Initial modes:
- General
- Recruiter
- Technical

Labels/descriptions are localized database values.

## General
Balanced explanation for ordinary visitors.

## Recruiter
Concise, evidence-first, role-relevant summaries. No fabricated fit claims.

## Technical
Allows deeper architecture, engineering trade-offs, stack, evaluation and implementation detail when supported by sources.

## Implementation
Modes map to prompt-policy versions. The client sends a mode ID; server verifies it is an enabled published mode.
