# Model Health and Capability Checks

Before assigning a model to a role, validate capability.

Embedding:
- returns numeric vector;
- expected dimension;
- handles Arabic sample;
- handles English sample.

Reranker:
- accepts query/document pairs;
- returns comparable relevance score/order;
- handles Arabic + English.

Generation:
- supports required structured output/streaming policy where used.

Admin "Test" action displays sanitized result.
Never test with secrets in prompt text.
