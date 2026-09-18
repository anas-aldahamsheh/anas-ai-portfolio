# Environment Configuration

All environment variables are validated at startup.

Categories:
- application URL/environment;
- database;
- auth secret;
- encryption/master secret;
- Qdrant;
- Redis;
- blob storage;
- observability;
- email provider if verification/reset enabled.

AI provider API keys should preferably be configured through encrypted admin secret storage after secure bootstrap. Environment variables may be supported as a deployment-level provider secret source.

Never commit `.env` values.
Provide `.env.example` with variable names and descriptions only.
