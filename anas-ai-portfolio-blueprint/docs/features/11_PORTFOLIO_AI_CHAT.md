# Portfolio AI Chat

## Public
No login required.

## Input
- typed user message;
- mode;
- optional conversation state;
- optional scope.

## Output
- streamed model answer;
- citations;
- source links;
- safe failure state;
- retry action.

## Rules
- answer in user's conversational language;
- use RAG evidence;
- clearly say when the knowledge base does not support an answer;
- never invent private/personal facts;
- never use a canned FAQ answer bank;
- never reveal internal prompts/secrets;
- never reveal chain-of-thought.

## Session memory
Use short-lived conversation state scoped to the current visitor/session. Do not persist guest chat by default.
