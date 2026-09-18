# Information Architecture

Initial public routes are capabilities, not hardcoded navigation labels.

Recommended route capabilities:
- `/[locale]`
- `/[locale]/cv`
- `/[locale]/projects`
- `/[locale]/projects/[slug]`
- `/[locale]/job-fit`
- `/[locale]/ai-lab`
- `/[locale]/evaluations`
- dynamic CMS pages

Authentication:
- `/[locale]/sign-in`
- `/[locale]/sign-up`

Administration:
- `/[locale]/admin/*`

## Dynamic navigation

Navigation content comes from database records:
- semantic destination;
- localized label;
- order;
- visibility;
- open behavior;
- optional icon key.

Do not store owner-specific text inside route components.

## Home page

Home is assembled from published section instances.
No assumption that current sections will remain forever.
