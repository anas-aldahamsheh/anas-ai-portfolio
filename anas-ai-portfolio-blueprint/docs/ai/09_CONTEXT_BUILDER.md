# Context Builder

Context selection is deterministic after retrieval/reranking.

## Responsibilities
- deduplicate overlapping chunks;
- enforce entity/scope constraints;
- preserve source IDs;
- fit token budget;
- favor higher-ranked unique evidence;
- include minimal source metadata needed for citations;
- avoid repeated near-identical paragraphs.

## Token budget
Budget is model-aware and configured.
Reserve space for:
- system/policy prompt;
- conversation context;
- user message;
- generated answer.

## Context format
Use structured delimiters and treat retrieved content as untrusted data, not instructions.

Prompt injection text inside documents must not gain authority.
