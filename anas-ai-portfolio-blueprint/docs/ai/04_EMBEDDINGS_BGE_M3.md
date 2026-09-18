# Embeddings — Default BGE-M3

## Default model
`BAAI/bge-m3`

Reasons:
- multilingual;
- supports 100+ languages;
- Arabic included in model training language list;
- English support;
- 1024-d dense embeddings;
- up to 8192-token input;
- supports dense and learned sparse/multi-function retrieval;
- open-source MIT license.

## Important cost distinction
The model weights are open-source/free to use under their license.
Hosted inference is not automatically free. Hosting/provider cost is separate.

The application therefore separates:
- model ID;
- inference provider;
- endpoint;
- credentials;
- pricing/quota metadata.

## Admin settings
- provider;
- endpoint;
- model ID;
- dimension;
- max input tokens;
- batch size;
- timeout;
- retry count;
- normalization;
- index version;
- enabled flag.

## Migration
Changing embedding dimension/model requires new vector collection/version and safe reindex. Do not mix vectors from incompatible models.
