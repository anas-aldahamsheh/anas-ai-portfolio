# Prompt Injection and RAG Security

Retrieved documents are data, not trusted instructions.

## Protections
- explicit prompt boundary;
- allowlist tool access;
- no sensitive tools in public chat;
- scope/access filters before retrieval;
- output citation validation;
- sanitize rendered markdown/HTML;
- reject attempts to reveal hidden prompts/secrets;
- no execution of code from retrieved content;
- no dynamic eval.

## Admin content
Admin-entered content is still treated as content, not system instruction.

## Job descriptions
A pasted JD is untrusted user input. It must never override system policy.
