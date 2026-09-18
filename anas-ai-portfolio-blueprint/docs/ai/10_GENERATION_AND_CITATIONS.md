# Grounded Generation and Citations

## Generator
Receives:
- response language;
- conversation mode;
- user message;
- scoped context;
- citation identifiers;
- behavioral prompt version.

## Grounding rule
If evidence is insufficient, answer that the portfolio knowledge base does not contain enough verified information.

## Citation rule
Every factual portfolio claim that depends on retrieved content should map to one or more source IDs.

## Validation
Post-generation validation checks:
- cited source IDs exist;
- no unknown citation ID;
- required citations present;
- response language matches request;
- structured result schema valid if used.

## No chain of thought
Do not request or expose private reasoning. Ask models for concise answer and evidence references.
