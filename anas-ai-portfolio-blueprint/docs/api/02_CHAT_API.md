# Chat API Contract

Suggested capability endpoint: `POST /api/chat`.

Input:
```json
{
  "message": "string",
  "modeId": "uuid",
  "scope": {"type":"global|project","projectId":"uuid|null"},
  "conversationToken": "opaque optional"
}
```

Server derives:
- role/auth context;
- permissions;
- active AI configuration;
- locale hints;
- rate limits.

Do not trust client-supplied provider/model/prompt IDs for public requests.

Output:
Streaming protocol includes typed events:
- metadata;
- text delta;
- citation catalog/update;
- debug metadata when allowed;
- completion;
- safe error.
