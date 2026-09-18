# Dynamic UI Text Registry

The codebase uses semantic keys, not hardcoded portfolio/UI copy.

## Example key shape

```text
navigation.cv
navigation.projects
actions.download
actions.copy
social.github.title
social.linkedin.title
chat.mode.general.label
chat.mode.recruiter.label
chat.mode.technical.label
```

The examples above are keys only, not production values.

## Runtime resolution

`LocalizedTextService.get(key, locale)` returns the published value.

## No silent fallback copy

If a required production text key is missing:
- log a structured configuration error;
- use configured locale fallback only if a database value exists in fallback locale;
- admin health dashboard reports missing translation;
- do not hide the problem by embedding English strings in code.

## Publishing gate

A content item can optionally require both `ar` and `en` translations before public publish.
Global UI keys require both languages.
