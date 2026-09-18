# Arabic + English AI Quality Gate

The system is not considered multilingual merely because the UI translates.

## Retrieval test sets
Maintain separate:
- Arabic queries -> Arabic evidence;
- English queries -> English evidence;
- Arabic query -> English evidence when expected;
- English query -> Arabic evidence when expected;
- mixed Arabic/English technical queries.

## Generation
Evaluate:
- language adherence;
- naturalness;
- technical terminology;
- citation correctness;
- no accidental direction corruption.

## Activation
A model/provider change that improves English but materially breaks Arabic must not be activated without explicit documented decision.
