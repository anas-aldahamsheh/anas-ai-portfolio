# Query Rewriting

## Goal
Increase recall for ambiguous, cross-language or conceptual questions.

## Input
- user message;
- language;
- conversation context summary;
- current scope;
- route.

## Output
Validated array of retrieval queries.

## Rules
- preserve named entities;
- do not add claims not present in the question/context;
- retain project scope;
- keep Arabic query Arabic unless cross-lingual retrieval is explicitly enabled;
- optional English alternate may be generated when it measurably improves cross-language recall.

## Config
- enabled;
- max rewrites;
- timeout;
- model;
- temperature;
- max tokens.

Evaluate benefit. Do not rewrite every query blindly if metrics show harm.
