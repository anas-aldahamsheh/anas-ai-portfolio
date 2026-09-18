# Upload Security

For CV/media uploads:
- authenticated ADMIN only;
- size limits;
- extension is not trusted;
- MIME is not trusted alone;
- inspect magic bytes;
- restrict allowed formats;
- random server-side storage keys;
- no executable upload handling;
- safe content disposition;
- image reprocessing where appropriate;
- PDF handling assumes untrusted content;
- storage bucket permissions private by default;
- public delivery via controlled published object/URL.
