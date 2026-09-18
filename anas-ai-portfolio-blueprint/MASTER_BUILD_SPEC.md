# Master Build Specification

## 1. Product identity

Working product name: **Anas AI Portfolio**.

The production name, logo text, navigation labels, descriptions, footer text, and all visible branding are database-managed values. The code must not assume a permanent display name.

## 2. Primary objective

Create a portfolio that demonstrates both AI engineering and web engineering through the product itself. It must be useful to recruiters, hiring managers, engineers, and general visitors.

The portfolio is simultaneously:
1. a public professional portfolio;
2. a dynamic CMS;
3. a modular advanced RAG application;
4. an AI evaluation showcase;
5. an admin-controlled AI control plane;
6. a bilingual RTL/LTR web application.

## 3. Public access model

A visitor must be able to use the entire public site as a Guest:
- browse every published public section;
- open projects;
- open project deep dives;
- use the AI assistant;
- use project-scoped AI;
- use Job Fit Analyzer;
- view CV;
- download CV;
- open/copy GitHub profile;
- open/copy LinkedIn profile;
- use AI Lab demos intended for public access;
- view public evaluation dashboard;
- switch Arabic/English;
- switch light/dark;
- sign up or sign in only if desired.

Do not gate core portfolio functionality behind authentication.

## 4. Roles

Exactly these product roles initially:
- `GUEST` — not stored as an account role; unauthenticated request context.
- `USER` — authenticated non-admin.
- `ADMIN` — privileged administrator.

Authorization is server-enforced. Hiding admin buttons is not security.

## 5. Administration model

The administrator must be able to control the site without editing source code for routine content or AI configuration.

Admin control includes:
- create/edit/archive/delete/reorder sections;
- create arbitrary content pages from supported composable blocks;
- create/edit/archive/delete projects;
- project metadata and project deep-dive content;
- navigation;
- footer;
- UI text and translations;
- CV current version and version history;
- GitHub and LinkedIn values;
- chatbot modes and labels;
- prompts and prompt versions;
- generation providers/models;
- embedding providers/models;
- reranker providers/models;
- endpoint URLs;
- encrypted API credentials;
- timeout/retry/rate settings;
- RAG chunking and retrieval parameters;
- router settings;
- query rewriting settings;
- context budget;
- citation requirements;
- evaluation datasets/config;
- feature flags;
- theme tokens exposed by the system;
- publishing state;
- audit logs.

## 6. Global inline editing

When an authenticated ADMIN enables Edit Mode:
- every editable dynamic content region exposes an unobtrusive edit affordance;
- edits open a contextual editor or inspector;
- save updates the authoritative store;
- affected cache paths/tags are invalidated;
- published changes appear immediately after successful save;
- destructive actions require explicit confirmation;
- draft/published workflow is supported where appropriate.

Normal visitors must never see edit affordances.

## 7. Dynamic-content rule

Do not embed portfolio facts in JSX/TS/JSON source files.

Use semantic keys and database-backed content.

Examples:
- allowed in code: `nav.cv`
- forbidden in code: `"CV"` as the permanent public label
- allowed in code: `social.github`
- forbidden in code: a GitHub URL belonging to the portfolio owner
- allowed in code: `sectionType: "project_grid"`
- forbidden in code: hardcoded project names/descriptions

## 8. AI response rule

No answer bank, phrase lookup table, canned FAQ response, or keyword-to-answer mapping.

Every substantive chatbot answer is generated at request time by the configured generation model using:
- conversation state;
- mode instructions;
- retrieved authoritative context;
- citation metadata.

Deterministic application logic may be used for security, authorization, routing constraints, validation, budgets, and UI behavior. Do not use an LLM for rules that should be deterministic.

## 9. Language behavior

- Supported interface languages initially: Arabic (`ar`) and English (`en`).
- The assistant responds in the language of the latest meaningful user message unless the user explicitly requests another language.
- Arabic responses use natural Arabic; do not force English technical terms to be translated when common usage favors English.
- English responses use professional English.
- Mixed text must remain readable.
- Direction is automatic and correct at document, component, input, popover, dialog, tooltip, table, chart, chat, and rich-content levels.

## 10. CV behavior

Public route: `/cv`.

Requirements:
- embedded CV viewer;
- responsive;
- downloadable current CV;
- admin upload/replace;
- CV version history;
- public endpoint exposes only current published CV;
- correct `Content-Disposition` on download;
- no public direct access to private/archive versions.

## 11. Social profile behavior

Clicking GitHub or LinkedIn opens a polished popover/card containing:
- account label/handle if configured;
- canonical URL;
- Copy action;
- Open Profile action.

The Open Profile action launches the external profile in a new safe tab using `noopener,noreferrer`.

## 12. Conversation modes

Feature display name: **Conversation Mode**.

Initial modes:
- General
- Recruiter
- Technical

Mode labels/descriptions are dynamic/localized content. Mode behavior is controlled through prompt registry entries and configuration.

## 13. Job matching feature

Feature display concept: **Job Fit Analyzer**.

Purpose:
- visitor pastes a job description;
- system maps documented portfolio evidence to role requirements;
- separates strong evidence, partial evidence, and not-found requirements;
- cites supporting projects/experience;
- never fabricates qualifications;
- does not silently treat inferred skills as verified facts.

## 14. Project Deep Dive

Each project can expose:
- overview;
- problem;
- constraints;
- solution;
- architecture;
- implementation;
- tech stack;
- challenges;
- decisions/trade-offs;
- results;
- media;
- links;
- evidence/citations;
- Ask AI About This Project.

All fields are dynamic and optional. Renderer must handle absent blocks gracefully.

## 15. Ask AI About This Project

A project-scoped chat:
- injects a hard retrieval filter for the selected project;
- does not rely only on prompt wording to scope retrieval;
- may include globally relevant profile data only when policy/config explicitly allows it;
- shows project scope clearly;
- allows user to leave scope.

## 16. Design

Minimal, neutral, precise, responsive, professional.

No AI-template aesthetic.

Use Tailwind for styling. All selects/dropdowns must be custom-styled components. Do not expose browser-default unstyled `<select>` UX.

## 17. Production requirement

The project is not complete when it only runs locally.

It must include:
- reproducible production build;
- migrations;
- environment validation;
- CI;
- security checks;
- observability;
- health/readiness endpoints;
- backups/recovery documentation;
- rate limiting;
- error handling;
- accessible UI;
- tests;
- deployment documentation;
- rollback procedure;
- operational runbooks.
