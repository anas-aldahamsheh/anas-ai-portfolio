# RAG Debug View

Show engineering transparency without exposing chain-of-thought.

Allowed telemetry:
- resolved language;
- mode;
- route/intent label;
- query rewrite count;
- retrieval methods;
- candidate count;
- reranked count;
- source IDs/titles;
- scores when meaningful;
- context token count;
- model/provider IDs;
- latency by stage;
- citation validation state.

Never show:
- private system prompts to public visitors;
- API keys;
- hidden chain-of-thought;
- secret configuration;
- raw sensitive logs.

Admin view may show more operational metadata than public view.
