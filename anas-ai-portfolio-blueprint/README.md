# Anas AI Portfolio — Production Blueprint Package

This ZIP is the authoritative implementation specification for a production-grade bilingual AI engineering portfolio.

## What this package is

It is not a mockup, a brainstorm, or a loose suggestion list. It is a handoff package for an implementation agent. The agent must read the files in the order defined in `START_HERE.md`, update `FEATURE_TRACKER.md` continuously, and implement the system without inventing product behavior that contradicts these documents.

## Product summary

Build a clean, minimal, professional portfolio website using Next.js. The site presents Anas's projects, CV, profile, skills, experience, certifications, AI lab, evaluation work, and any future content sections created by an administrator. The public website must be fully usable by guests. Sign-up and sign-in exist, but authentication must never be a barrier for recruiters.

The website contains a multilingual RAG-powered assistant that:
- answers in the language used by the visitor;
- supports Arabic and English strongly;
- applies correct RTL/LTR behavior everywhere;
- can answer about Anas and the portfolio knowledge base;
- can be scoped to a specific project;
- supports General, Recruiter, and Technical conversation modes;
- provides grounded citations;
- contains no canned answer bank or hardcoded portfolio facts.

The administrator has complete control over content, sections, navigation labels, CV, social profiles, UI text, prompts, providers, model identifiers, API endpoints, API keys, retrieval parameters, reranking, model routing, evaluation, publishing, and relevant design settings.

## Non-negotiable design language

The visual language must be restrained and human-designed:
- monochrome / neutral first;
- generous spacing;
- excellent typography;
- subtle borders;
- subtle elevation;
- motion that communicates hierarchy and state;
- no neon gradients;
- no random glowing blobs;
- no generic "AI dashboard" visual clichés;
- no excessive glassmorphism;
- no decoration without purpose.

Think of the clarity and restraint of modern productivity products, not an AI-generated landing-page template.

## Mandatory runtime rule

**No portfolio content, project facts, CV text, social links, navigation labels, localized UI labels, chatbot answers, or business content may be hardcoded in source files.**

The source code may contain:
- semantic keys;
- schemas;
- types;
- validation rules;
- safe operational constants;
- component logic.

The source code must not contain user-facing content values that belong to the portfolio/CMS. All such values come from the database/configuration layer and are editable by an administrator.

Prompt specifications in this ZIP are design contracts. Production prompts must be stored in the prompt registry/database, versioned, and editable from the Admin Panel.

## Read first

1. `START_HERE.md`
2. `MASTER_BUILD_SPEC.md`
3. `NON_NEGOTIABLES.md`
4. `TECH_STACK_LOCK.md`
5. `FEATURE_TRACKER.md`
6. `BUILD_PHASES.md`
7. `PROJECT_STRUCTURE.md`
8. `docs/standards/00_USER_ENGINEERING_PRINCIPLES.md`
9. `AGENT_EXECUTION_CONTRACT.md`

Then implement in tracker order.
