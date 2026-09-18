# Hybrid Retrieval

Use semantic + lexical/sparse retrieval.

## Candidate generation
- dense top K;
- sparse/BM25 or learned sparse top K;
- mandatory metadata filters;
- optional section/entity filters.

## Fusion
Use Reciprocal Rank Fusion by default because scores across retrievers may not be calibrated.

Configurable:
- dense K;
- sparse K;
- fusion K;
- RRF constant;
- minimum thresholds;
- final candidate cap.

## Arabic
Lexical tokenization must not assume English-only stemming. Use a provider/index strategy known to handle Unicode and Arabic text.

## Scoped retrieval
Project-scoped chat applies project metadata filters before candidate retrieval.

## Evaluation
Compare:
- dense only;
- sparse only;
- hybrid;
- hybrid + rerank.
