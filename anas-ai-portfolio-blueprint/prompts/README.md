# Prompt Specifications — Not Runtime Hardcoded Prompts

This directory defines prompt responsibilities and schemas for the implementation agent.

**Production prompt text must live in the database prompt registry and be editable/versioned through Admin.**

Do not import Markdown files from this directory at runtime as hidden static product behavior.

Each prompt role requires:
- semantic role ID;
- version;
- input schema;
- output schema if structured;
- safety constraints;
- language behavior;
- evaluation cases.
