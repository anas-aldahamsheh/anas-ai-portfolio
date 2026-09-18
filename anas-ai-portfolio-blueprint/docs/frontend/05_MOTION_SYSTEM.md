# Motion System

Animation should make the product feel polished, not theatrical.

## Principles
- short;
- subtle;
- interruptible;
- state-driven;
- performant;
- reduced-motion aware.

## Use motion for
- page/section reveal;
- popover/dialog transitions;
- inline edit controls;
- button feedback;
- skeleton-to-content transition;
- project card micro-interaction;
- chat message arrival;
- copy-success feedback;
- theme toggle;
- admin side panel;
- accordion/tabs.

## Do not
- animate every paragraph independently;
- use constant floating decorations;
- use parallax that harms readability;
- block interaction during animation;
- create long entrance sequences.

## Reduced motion
When `prefers-reduced-motion: reduce`:
- remove transforms and complex transitions;
- retain necessary state changes instantly or with minimal opacity.
