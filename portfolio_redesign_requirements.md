# Portfolio Redesign Requirements
## Recruiter-Focused Personal AI Engineering Portfolio

> **Primary objective:** Redesign the entire public-facing presentation layer so the portfolio markets **Anas Al Dahamsheh as an AI Engineer**, not the portfolio application itself.

---

# 1. Core Product Direction

The current portfolio feels too much like an AI SaaS platform or technical product showcase.

The redesign must change the mental model completely:

**Wrong direction**  
> “Look how advanced this portfolio platform is.”

**Correct direction**  
> “Look what Anas can build, what he has achieved, what he knows, and why a recruiter should hire him.”

The portfolio itself is only the evidence layer.

**Anas is the product.**

Every public-facing UI element, page, section, label, badge, CTA, animation, and piece of copy must be evaluated with this question:

> **Does this help a recruiter or hiring manager understand why they should hire Anas?**

If the answer is no, do one of the following:
- simplify it,
- move it into a project technical detail page,
- hide it from public navigation,
- or remove it from the public-facing experience.

---

# 2. Critical Constraints

## Preserve all existing logic

Do **NOT** remove, break, or rewrite working business logic unless technically necessary.

Preserve:
- APIs
- backend logic
- database behavior
- authentication
- RAG
- vector search
- evaluation systems
- project data
- AI assistant functionality
- admin functionality
- existing technical demos
- job-fit logic
- CV/resume logic
- localization
- dark/light theme support
- existing integrations

The redesign should primarily change:

- information architecture
- public navigation
- page hierarchy
- visual design
- typography
- colors
- spacing
- component presentation
- public copy
- recruiter-focused messaging
- animation
- responsive behavior
- content prioritization

---

# 3. Overall Design Philosophy

The final portfolio must feel:

- extremely simple
- clean
- calm
- premium
- intentional
- professional
- modern
- human-designed
- recruiter-focused
- highly polished
- responsive
- bilingual
- excellent in dark mode
- excellent in light mode
- technically impressive without looking over-engineered

Use the visual restraint of products such as ChatGPT, Linear, Vercel, or similarly clean modern software as **design inspiration only**.

Do **not** copy their branding or exact UI.

The goal is simplicity and restraint.

---

# 4. Remove the “AI-Generated UI” Look

Avoid the common AI-generated design patterns currently visible in the portfolio.

Do NOT overuse:

- gradients
- glowing effects
- neon accents
- glassmorphism
- giant cards
- cards inside cards
- excessive border radius
- too many badges
- too many pills
- too many borders
- excessive shadows
- decorative icons everywhere
- oversized headings
- random dashboards
- excessive technical labels
- artificial “enterprise” language
- fake-looking benchmark panels
- over-complicated layouts
- dense navigation
- unnecessary separators
- exaggerated visual effects

The website must not look like:
- an AI dashboard template,
- an admin console,
- a generic SaaS landing page,
- or an AI-generated portfolio.

---

# 5. Navigation Redesign

The current public navigation exposes too many internal/product-like areas.

Examples that should NOT dominate the public navigation:

- AI Assistant
- RAG
- Job Fit Analyzer
- AI Lab
- Evaluation
- Admin

Instead, the public navigation should be recruiter-oriented.

Recommended public navigation:

- Home
- Projects
- Experience
- Resume
- About
- Contact

Optional:
- AI Assistant

But if the AI Assistant is included, it should clearly be positioned as:

> **Ask About Anas**

not as a product feature.

## Hidden / secondary technical areas

Technical areas such as:

- AI Lab
- Evaluation
- Job Fit Analyzer
- RAG demos
- Internal benchmarks
- Admin
- Edit Mode

should either:

1. move under specific project detail pages,
2. live under a subtle “Technical Demos” section,
3. be accessible through project case studies,
4. or remain hidden from normal public navigation.

`Admin` and `Edit Mode` should never visually compete with the public portfolio experience.

---

# 6. Homepage Redesign

The homepage should immediately answer:

1. Who is Anas?
2. What does he do?
3. What does he build?
4. What evidence proves his ability?
5. How can I contact him?

## Recommended homepage flow

1. Hero
2. Selected Projects
3. What I Do
4. Experience Highlights
5. Technical Capabilities
6. About
7. AI Recruiter Assistant
8. Contact

Avoid turning the homepage into a dashboard.

---

# 7. Hero Section

The first screen should be extremely simple.

Recommended structure:

**Anas Al Dahamsheh**

**AI Engineer**

Short positioning statement such as:

> I build AI systems, evaluation pipelines, automation tools, and production-ready AI applications.

Primary CTAs:
- View Projects
- Download Resume
- Contact Me

Secondary:
- GitHub
- LinkedIn

Do not lead with implementation details such as:
- model provider
- vector database
- RAG framework
- benchmark names
- internal platform architecture

Those details belong deeper in the portfolio.

---

# 8. Personal Positioning

The website should present Anas around a clear set of capabilities.

Recommended positioning areas:

- AI Engineering
- LLM Evaluation & Red Teaming
- Generative AI Applications
- AI Agents & Automation
- RAG & Retrieval Systems
- Full-Stack AI Applications
- AI Quality & Testing
- Data / Evaluation Pipelines

These should be described in terms of what Anas can **build or deliver**, not as a list of buzzwords.

Bad:

> RAG, Qdrant, BM25, Cross Encoder, Gemini, FastAPI

Better:

> Built retrieval and evaluation systems that combine semantic search, structured testing, and grounded generation.

---

# 9. Projects Must Become the Centerpiece

Projects should be one of the strongest parts of the portfolio.

Each important project should clearly show:

- Project name
- One-sentence purpose
- Problem solved
- What Anas built
- Key engineering decisions
- Technologies used
- Measurable result or impact when available
- Screenshot or real visual
- Live Demo
- GitHub repository if public
- Technical deep dive if relevant

## Important

Do NOT use empty or generic placeholders.

Replace gray project image placeholders with:
- real screenshots,
- product mockups based on real interfaces,
- diagrams,
- or meaningful project visuals.

Avoid inflated project naming that sounds artificial.

Project names should feel credible and understandable.

---

# 10. Project Card Design

Project cards must be simple.

Recommended content:

- real screenshot
- project title
- short description
- 3–5 relevant technologies
- one clear result / capability
- View Project
- Live Demo
- GitHub if available

Avoid:
- excessive category badges
- multiple decorative labels
- giant empty image areas
- unnecessary metadata
- overly technical marketing copy

---

# 11. Project Detail Pages

A project detail page can be technical, but it should still market Anas.

Recommended structure:

1. Project overview
2. Problem
3. My role
4. What I built
5. Architecture
6. Key engineering decisions
7. Challenges
8. Results / impact
9. Tech stack
10. Screenshots / demo
11. Lessons / improvements
12. Live Demo / GitHub

Use first-person ownership language where appropriate:

- Built
- Designed
- Implemented
- Automated
- Evaluated
- Integrated
- Improved
- Delivered

Avoid generic platform language that removes Anas from the story.

---

# 12. Stop Marketing the Portfolio Itself

Remove or demote public-facing phrases such as:

- Powered by Gemini 3.1 Flash Lite
- RAG Grounded
- Strict Grounding Guarantee
- Vector Search with Qdrant
- Real Execution • Zero Mockups
- Portfolio Golden Benchmark v1
- Production-grade retrieval platform
- Enterprise-grade portfolio intelligence

These statements market the website instead of Anas.

They may remain in:
- architecture sections,
- project technical details,
- implementation notes,
- AI Lab documentation,

but should not dominate the recruiter experience.

---

# 13. Rewrite Technical Copy Around Anas

Transform technology-centered copy into achievement/capability-centered copy.

Bad:

> Production-grade hybrid retrieval architecture.

Better:

> Built a hybrid retrieval system combining dense and lexical search to improve evidence retrieval quality.

Bad:

> Vector Search with Qdrant.

Better:

> Implemented semantic retrieval and reranking for evidence-grounded AI responses.

Bad:

> Portfolio Golden Benchmark v1.

Better:

> Built an evaluation workflow to measure retrieval quality, grounding, and response relevance.

The subject should usually be **Anas**, not the platform.

---

# 14. AI Assistant Redesign

The AI Assistant should become a recruiter-facing assistant.

Its purpose:

> Help visitors understand Anas's skills, projects, experience, qualifications, and relevance to a role.

Rename or reposition it around ideas such as:

- Ask About Anas
- Recruiter Assistant
- Ask My Portfolio
- Career & Project Assistant

## Recommended quick questions

- What are Anas's strongest AI engineering skills?
- Summarize Anas's experience for an AI Engineer role.
- What production AI projects has Anas built?
- What evidence supports Anas's LLM evaluation experience?
- Which of Anas's projects are most relevant to this role?
- What technologies has Anas used?
- What are Anas's strongest engineering achievements?
- How can I contact Anas?
- Summarize Anas for a recruiter.
- What makes Anas relevant for an AI Engineer position?

Avoid quick questions focused on how the portfolio itself works.

Bad:
> How does the hybrid RAG retrieval pipeline work in this platform?

That belongs in technical project documentation, not the main recruiter experience.

---

# 15. AI Lab

Keep the AI Lab functionality.

Do not remove working logic.

However, reposition it as:

> Interactive Technical Demos

or:

> Engineering Experiments

The purpose is to prove Anas's capabilities.

Each demo should have a short introduction such as:

> Built by Anas to demonstrate hybrid retrieval, reranking, evaluation, and grounded generation techniques.

Technical detail can remain available to interested engineers.

But the first impression must explain what **Anas demonstrated or built**.

---

# 16. Evaluation Dashboard

Keep the evaluation functionality.

Do not make it look like a random product dashboard.

Introduce it as evidence of engineering capability.

Example:

> An interactive evaluation environment built to measure retrieval quality, grounding, relevance, latency, and bilingual consistency.

Explain:
- why it exists,
- what Anas implemented,
- what it demonstrates.

Do not make benchmark numbers the centerpiece without context.

---

# 17. Job Fit Analyzer

If kept public, position it as one of Anas's projects.

Do not make it feel like a core section of the portfolio navigation.

The page should clearly communicate:

- what problem it solves,
- how it works,
- what Anas built,
- where AI is used,
- where deterministic code is used,
- how scoring works,
- what the technical challenges were.

---

# 18. Resume / CV Page

The current resume page should not feel like only a giant PDF viewer.

Recommended structure:

1. Simple heading
2. Short professional summary
3. Download Resume button
4. Open PDF button
5. Optional in-page preview
6. Key experience highlights
7. Contact links

The PDF viewer can remain, but should not dominate the entire experience.

The page should make the resume easy to:
- scan,
- open,
- download,
- and understand.

---

# 19. Experience Section

Create a clean Experience section or page.

For each role show:

- Company
- Role
- Period
- Short summary
- Main responsibilities
- Important achievements
- Impact
- relevant technologies

Focus on evidence and outcomes.

Do not turn it into a long generic job description.

---

# 20. Achievements & Evidence

Where truthful and available, highlight measurable impact.

Examples of useful evidence:

- throughput
- number of evaluations
- conversations generated
- automation speed
- accuracy
- delivery time
- time saved
- manual work replaced
- concurrency
- dataset size
- reliability improvements
- project completion speed
- scale

Do not invent numbers.

Every metric must be based on real user-provided information.

---

# 21. About Page

The About section should be concise.

Focus on:

- Computer Engineering background
- AI Engineering focus
- AI evaluation experience
- practical software building
- interest in production AI systems
- engineering approach

Avoid generic personality paragraphs.

---

# 22. Contact Section

Make contacting Anas effortless.

Include:

- Email
- LinkedIn
- GitHub
- Resume download

Optional:
- simple contact form

Do not require users to navigate deeply before finding contact details.

---

# 23. Visual Design System

## Palette

Use a very small palette.

Recommended philosophy:

### Light Mode
- warm or neutral off-white background
- white / subtle surface
- dark charcoal main text
- muted gray secondary text
- light neutral borders
- one accent color

### Dark Mode
- near-black background
- slightly lighter neutral surfaces
- soft off-white main text
- muted gray secondary text
- subtle borders
- the same accent color

Avoid multiple competing accent colors.

Use semantic colors only when needed:
- success
- warning
- error
- informational

---

# 24. Typography

Use one high-quality modern sans-serif family.

Rules:

- clear hierarchy
- restrained sizing
- readable line-height
- consistent weights
- limited font-size scale
- avoid huge hero headings
- avoid bolding everything

Typography should provide hierarchy without depending on cards and borders.

---

# 25. Spacing

Spacing should feel intentional.

Use:
- generous whitespace
- consistent vertical rhythm
- predictable section spacing
- aligned content grids
- consistent max-width

Do not fill every empty area with decoration.

Whitespace is part of the design.

---

# 26. Cards

Use cards only when they serve a real functional purpose.

Do NOT wrap:
- every sentence,
- every section,
- every metric,
- every label,
- every action

inside cards.

Prefer:
- flat sections
- grouped content
- simple dividers
- whitespace

---

# 27. Borders & Shadows

Use:
- subtle neutral borders
- very soft shadow only where useful

Avoid:
- heavy shadows
- glowing outlines
- nested borders
- excessive elevation
- large floating cards

---

# 28. Rounded Corners

Use moderate consistent corner radii.

Avoid extremely rounded “AI SaaS” cards and pills everywhere.

Pills should only be used where semantically useful:
- tags
- filters
- status
- compact metadata

---

# 29. Buttons

Use a small button system:

- Primary
- Secondary
- Ghost / Text

Avoid many visual button variants.

CTAs should be visually obvious but not oversized.

---

# 30. Icons

Use icons only when they improve comprehension.

Do not place icons next to every heading or label just for decoration.

Maintain one consistent icon style.

---

# 31. Dark & Light Mode

Both themes must be intentionally designed.

Do not simply invert colors.

Requirements:

- equal hierarchy in both modes
- readable contrast
- consistent accent
- appropriate surface separation
- readable borders
- accessible states
- matching component quality

Theme switching should be smooth.

---

# 32. Animation Philosophy

The portfolio should contain many polished animation opportunities while still feeling calm.

The correct rule is:

> **Lots of motion opportunities, very little visual noise.**

Use subtle animations such as:

- smooth page transitions
- section reveal on scroll
- staggered project card entrances
- subtle text reveal
- soft navbar state changes
- hover elevation
- button micro-interactions
- animated underline
- screenshot hover zoom
- smooth theme transition
- count-up animation for real metrics
- tab transitions
- accordion transitions
- AI Assistant open/close animation
- modal transitions
- route transitions
- skeleton loading states
- subtle progress animation
- smooth filter transitions

Do NOT use:

- bouncing elements
- neon glow
- constant floating icons
- excessive parallax
- random movement
- distracting looping effects
- flashy loading animations
- huge motion effects

Animation should improve perceived quality, not call attention to itself.

---

# 33. Responsive Design

The site must be fully polished on:

- desktop
- laptop
- tablet
- mobile

Do not simply stack everything.

Mobile must preserve:

- hierarchy
- spacing
- readability
- navigation clarity
- usable controls
- touch target sizes
- project readability
- theme quality

Navigation should transform cleanly on smaller screens.

---

# 34. Bilingual Design

Arabic and English must both feel first-class.

Requirements:

- correct RTL / LTR
- mirrored layout where appropriate
- correct spacing
- proper text alignment
- proper icon placement
- navigation adaptation
- readable typography
- no broken mixed-direction UI
- consistent design quality in both languages

Do not design English first and treat Arabic as a patch.

---

# 35. Admin / Edit Controls

Public users should not be distracted by:

- Admin
- Edit Mode
- Control Center
- internal maintenance tools

These should be:
- hidden unless authenticated,
- visually secondary,
- or moved to a separate admin experience.

The public portfolio must remain clean.

---

# 36. Content Rules

Public-facing copy should:

- be concise
- be factual
- be recruiter-friendly
- emphasize Anas's role
- emphasize outcomes
- avoid unnecessary jargon
- avoid inflated claims
- avoid artificial enterprise language
- avoid generic AI copy
- avoid marketing the portfolio itself

Use active ownership language.

Good:
- I built
- I designed
- I implemented
- I automated
- I evaluated
- I integrated
- I improved

When third-person language is needed:
- Anas built
- Anas designed
- Anas implemented

---

# 37. CTA Strategy

Every important page should contain a CTA related to Anas.

Recommended:

- View My Projects
- Download My Resume
- View GitHub
- Visit LinkedIn
- Contact Me
- Ask About My Experience
- See How I Built This
- Explore My Work
- View Live Demo

Avoid product-oriented CTAs such as:
- Open Platform
- Explore System
- Run Benchmark
- Launch Console

unless they appear inside a technical project demo.

---

# 38. Information Hierarchy

The strongest information should be the easiest to find.

Priority order:

1. Name
2. Role
3. Value proposition
4. Selected projects
5. Experience
6. Achievements
7. Resume
8. Technical depth
9. AI demos
10. Internal platform details

Do not place implementation trivia above career-relevant information.

---

# 39. Technical Depth Without Visual Noise

Technical depth is still valuable.

Do not remove it.

Instead, progressively disclose it.

Example:

Project overview  
→ Architecture  
→ Technical decisions  
→ Evaluation  
→ Benchmarks  
→ Raw implementation details

This lets recruiters understand the project quickly while engineers can go deeper.

---

# 40. Recommended Homepage Structure

## Hero
- Name
- AI Engineer
- one-sentence positioning
- primary CTAs
- GitHub / LinkedIn

## Selected Work
3–5 strongest projects with real screenshots.

## What I Build
Simple capability summary.

## Experience Highlights
Key career evidence.

## Engineering Strengths
AI evaluation, agents, automation, RAG, full-stack AI.

## Selected Achievements
Real metrics where available.

## Ask About Anas
Recruiter-oriented AI assistant.

## Contact
Fast and obvious.

---

# 41. Recommended Project Page Structure

For each project:

## Project Name

### What it is
One short paragraph.

### Problem
What problem existed?

### My Role
What exactly did Anas own?

### What I Built
Specific implementation.

### Architecture
Simple diagram or structured explanation.

### Key Features
Only meaningful features.

### Engineering Challenges
What was difficult?

### Results
Measured or qualitative impact.

### Technologies
Relevant stack.

### Screenshots / Demo

### Links
- Live Demo
- GitHub
- Technical Details

---

# 42. Quality Bar

The final product should feel:

- intentionally designed
- coherent
- recruiter-friendly
- fast
- polished
- modern
- credible
- technically strong
- visually restrained
- consistent

It should NOT feel:

- template-generated
- AI-generated
- overly futuristic
- noisy
- dashboard-heavy
- self-promotional about the website itself
- stuffed with buzzwords

---

# 43. Implementation Process

Before changing code:

## Step 1 — Audit
Inspect the existing application and identify:

- visual clutter
- unnecessary cards
- excessive navigation
- duplicated components
- inconsistent colors
- poor spacing
- unnecessary badges
- unnecessary technical copy
- recruiter-irrelevant pages
- internal controls exposed publicly
- mobile issues
- dark/light inconsistencies
- Arabic/English inconsistencies

## Step 2 — Information Architecture
Create the new public structure before redesigning components.

## Step 3 — Design System
Define:
- typography
- colors
- spacing
- radii
- borders
- buttons
- surfaces
- animation tokens
- theme variables

## Step 4 — Navigation
Simplify navigation and hide internal/admin concepts.

## Step 5 — Homepage
Rebuild around Anas.

## Step 6 — Projects
Convert projects into recruiter-friendly case studies.

## Step 7 — Resume / Experience
Make career information easy to consume.

## Step 8 — AI Assistant
Make it market Anas intelligently.

## Step 9 — Technical Demos
Preserve advanced functionality but move it into the correct hierarchy.

## Step 10 — Animation
Add subtle polished motion after layout and hierarchy are correct.

## Step 11 — Responsive Pass
Test all major breakpoints.

## Step 12 — Dark / Light Pass
Validate both themes independently.

## Step 13 — Arabic / English Pass
Validate full RTL/LTR parity.

## Step 14 — Final QA
Ensure no existing logic was broken.

---

# 44. Acceptance Criteria

The redesign is successful only if:

- A recruiter understands who Anas is within seconds.
- The homepage clearly presents Anas as an AI Engineer.
- The portfolio does not look like a SaaS dashboard.
- The website no longer markets itself more than Anas.
- Project screenshots are real or meaningful.
- Technical features are contextualized as proof of Anas's ability.
- Navigation is simpler.
- Admin controls are not distracting public users.
- Both themes are polished.
- Mobile is polished.
- Arabic and English are equally polished.
- Animations are smooth and subtle.
- No working logic has been broken.
- Existing backend and AI functionality remains intact.
- The design feels human-made.
- The site is visually simple despite containing advanced functionality.
- Every major page helps answer why Anas is worth interviewing or hiring.

---

# 45. Master Instruction for the Agent

Use the following instruction as the primary redesign rule:

> **The portfolio must market ANAS, not market the portfolio application itself.**
>
> Anas is the product.
>
> His skills, engineering ability, projects, experience, achievements, and credibility are the value proposition.
>
> Every UI element must be evaluated with one question:
>
> **“Does this help a recruiter or hiring manager understand why they should hire Anas?”**
>
> If the answer is no, simplify it, move it into a technical project detail page, hide it from the public-facing experience, or remove it.
>
> Do not delete or break existing application logic, APIs, backend functionality, RAG, evaluation systems, admin capabilities, AI functionality, or technical demos.
>
> Completely redesign the presentation layer, information architecture, visual hierarchy, copy, navigation, and public user experience.
>
> The final design must be:
>
> - extremely simple
> - premium
> - minimal
> - human-designed
> - highly polished
> - recruiter-focused
> - responsive
> - bilingual
> - excellent in both dark and light mode
> - rich in subtle high-quality animation
> - free from stereotypical AI-generated UI patterns
>
> Use ChatGPT-level visual restraint as design inspiration without copying ChatGPT.
>
> Remove unnecessary cards, borders, badges, technical jargon, product self-promotion, fake-looking dashboards, excessive navigation items, and decorative complexity.
>
> Do not make the website look like an AI SaaS product.
>
> Make it look like the personal portfolio of a strong AI Engineer.
>
> **Do not improve the UI by adding more. Improve it by removing unnecessary things.**

---

# 46. Final Design Rule

Whenever there is a choice between:

> “more visually impressive”

and:

> “more simple, clear, recruiter-friendly, and usable”

always choose:

> **more simple, clear, recruiter-friendly, and usable.**

The advanced engineering should be visible through the work itself — not through visual noise.
