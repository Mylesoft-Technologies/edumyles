# Team color guide


## Primary brand colors

- EduMyles Green (main brand/logo/buttons): #056c40 → --color-brand-green-800

- Dark Green (hero/pricing/dark sections): #023c24 → --color-brand-green-900

- Green Hover / active states: #0b7a49 → --color-brand-green-700

## Action colors

-Primary CTA Red buttons: #e42527 → --color-brand-red-600

- Primary CTA hover: #cc2123 → --color-brand-red-700

## Accent colors

- Highlight yellow sections / badges: #ffd731 → --color-brand-yellow-400

- Highlight hover / stronger yellow: #e6c12c → --color-brand-yellow-500

## Neutral colors

- Main text / headings: #101010 → --color-text-strong
## Status colors

- Success text: #166534

- Error text: #dc2626

- Warning text: #92400e

# Team rules to keep UI consistent

## Use these rules across the team:

### Colors

- Never write raw hex values directly in component CSS unless adding a new approved token.

Use:

background: var(--color-brand-red-600);

Not:

background: #e42527;
Buttons

Red = primary CTA

Green = product/action CTA

Yellow = accent/highlight CTA

Black/dark = secondary emphasis

Outline = tertiary/quiet action

### Cards

Use .card for normal cards

Use .card card-soft for lighter panels

Use .card card-dark only on dark sections

### Text

h1 only once per page section hero

h2 for major section titles

h3 for card titles

body text should use muted gray, not pure black

Spacing

Prefer spacing variables, not arbitrary pixel values.

Use:

gap: var(--space-6);
padding: var(--space-8);
Example usage in a section
.feature-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-sm);
}


You will find the files in landing/src/app/globals.css.
For detailed information find the document named styels.md in the doc section.