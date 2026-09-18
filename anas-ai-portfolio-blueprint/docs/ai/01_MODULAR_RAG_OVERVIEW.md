# Modular Advanced RAG Overview

The RAG pipeline must be composed from replaceable stages.

```text
Request
  -> Language Resolver
  -> Scope Resolver
  -> Query Router
  -> Query Rewriter (optional/configurable)
  -> Retrieval Plan
      -> Dense Retriever
      -> Sparse Retriever
      -> Metadata Filters
  -> Fusion
  -> Reranker
  -> Deduplicator
  -> Context Budgeter
  -> Prompt Builder
  -> Generator
  -> Output Validator
  -> Citation Validator
  -> Response
```

## Port contracts

Define interfaces for:
- `LanguageResolver`
- `QueryRouter`
- `QueryRewriter`
- `EmbeddingProvider`
- `DenseRetriever`
- `SparseRetriever`
- `FusionStrategy`
- `Reranker`
- `ContextBuilder`
- `GenerationProvider`
- `CitationValidator`

## Replaceability target

Replacing the embedding provider must not require editing the chatbot route.
Replacing Qdrant must not require editing project pages.
Changing reranker must not require editing context builder.

## Configuration
Every threshold/limit/model reference belongs to versioned configuration, not scattered constants.
