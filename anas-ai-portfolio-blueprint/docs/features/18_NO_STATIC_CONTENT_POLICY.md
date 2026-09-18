# No Static Portfolio Content Policy

## Forbidden in source
- owner biography;
- project names/descriptions;
- CV text;
- skill lists;
- certificates;
- GitHub/LinkedIn URLs;
- section titles;
- navigation display labels;
- chatbot factual answers;
- FAQ answers;
- owner-specific metrics.

## Allowed
- semantic identifiers;
- enum-like internal codes;
- validation error codes;
- route paths;
- component type names;
- schemas;
- role names;
- security rules;
- protocol constants.

## UI labels
Visible labels must resolve from the localization/content registry.

## Empty database
The public app may show a configuration-safe state resolved through database-configured system text. Initial content population is an explicit admin/bootstrap process, not a hidden seed of owner data.

Do not create demo portfolio content in production migrations.
