# AI Evaluation

Maintain separate evaluation of retrieval and generation.

## Retrieval dataset
Each case:
- query;
- language;
- expected relevant source IDs;
- optional route;
- optional scope.

Metrics:
- Recall@K;
- Precision@K;
- MRR;
- nDCG where useful.

## Generation dataset
Each case:
- query;
- expected supported facts;
- prohibited unsupported claims;
- expected language;
- evidence.

Metrics:
- faithfulness;
- citation correctness;
- answer relevance;
- task success;
- refusal/insufficient-evidence correctness;
- Arabic/English parity.

## Regression gate
Changing:
- embedding model;
- reranker;
- generation model;
- router;
- prompt;
- chunking;
- retrieval weights

must trigger relevant evaluation before activation/publishing when practical.
