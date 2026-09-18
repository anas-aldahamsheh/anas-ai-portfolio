# Chunking Strategy

Chunking is strategy-driven and admin-configurable within validated safe ranges.

## Default strategy
- semantic/block-aware first;
- preserve project/block boundaries;
- do not mix unrelated entities;
- retain source hierarchy metadata;
- split oversized blocks with overlap.

## Configuration
Examples:
- target tokens;
- max tokens;
- overlap;
- minimum chunk length;
- heading carryover;
- locale-aware splitting.

## Avoid
- fixed character slicing that breaks Arabic words;
- chunks containing content from two projects;
- huge chunks that exhaust context;
- tiny chunks without meaning.

## Versioning
Store `chunker_version` and config hash with vectors.
Changing chunking creates a new index version and evaluation run before activation.
