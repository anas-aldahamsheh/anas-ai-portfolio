# Conversation Language Resolution

Requirement: answer in the language the visitor uses with the AI.

## Strategy
1. inspect latest meaningful user message;
2. use deterministic Unicode/script heuristics for obvious Arabic vs Latin text;
3. use conversation locale as a weak signal;
4. if ambiguous/mixed, use a small language-classification model/provider step or the configured generator in structured-output mode;
5. respect explicit user instruction to answer in another language.

## Output
`ar` or `en` initially.

## Direction
The answer container uses the resolved language and appropriate direction.
Code blocks/URLs remain readable LTR as necessary.

## Tests
- Arabic colloquial text;
- Modern Standard Arabic;
- English;
- Arabic with English tech terms;
- English with Arabic project name;
- one-word ambiguous messages;
- explicit "answer in English/Arabic".
