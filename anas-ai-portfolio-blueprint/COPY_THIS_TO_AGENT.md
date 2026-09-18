# Instruction to the Implementation Agent

You have received the `anas-ai-portfolio-blueprint` package.

Your job is to build the production application exactly according to this package.

Start at `START_HERE.md` and follow its reading order. Do not skip the user engineering principles. Use `FEATURE_TRACKER.md` as the single progress source of truth and update it continuously so another model can continue after quota/session exhaustion.

Do not hardcode portfolio data or owner-specific visible text. Do not invent projects, profile facts, links, metrics, certifications, CV content, or chatbot answers.

Do not redesign the product into an "AI-looking" website. Keep it minimal, neutral, professional and highly polished.

Do not substitute a basic vector-search RAG. Implement the modular pipeline described under `docs/ai/`.

The administrator must control content, sections, localization, models, APIs, prompts, retrieval, reranking and publishing through safe production-grade interfaces.

Public visitors must be able to use the whole portfolio as Guests.

Arabic/English + perfect RTL/LTR behavior is mandatory and release-blocking.

Before marking any feature DONE, satisfy `DEFINITION_OF_DONE.md`.
