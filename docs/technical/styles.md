# EduMyles UI / UX Standards
Design System & Interface Consistency Guide

Version: 1.0  
Owner: EduMyles Product & Engineering Team  
Purpose: Maintain consistent UI/UX across the EduMyles platform.

# 1. Design Philosophy

EduMyles follows a **clean, modern SaaS design style** focused on:

- Simplicity
- Accessibility
- Clarity
- Consistency
- Professional trust

Core design principles:

1. **Consistency over creativity**
2. **Whitespace improves readability**
3. **Actions must be obvious**
4. **Information hierarchy must be clear**


# 2. Color System

All colors must be referenced from **design tokens** in `tokens.css`.
Never hardcode colors directly.
Example (Correct):
```css
background: var(--color-brand-green-800);

Example (Incorrect):
background: #056c40;

2.1 Primary Brand Colors
Name	                Token	                    Hex	          Usage
EduMyles Dark Green	   --color-brand-green-900	    #023c24	      Dark hero sections
EduMyles Green	       --color-brand-green-800	    #056c40	      Primary brand
                            color
Green Hover	           --color-brand-green-700	    #0b7a49	      Hover states

**Used in:**
-Dashboard accents
-Hero sections
-Buttons
-Navigation highlights

2.2 Primary Action Colors
Name	                 Token	                    Hex	          Usage
Primary CTA Red	         --color-brand-red-600	    #e42527	      Main CTA buttons
CTA Hover	             --color-brand-red-700	    #cc2123	      Hover state

**Used in:**
-Get Started
-Sign Up
-Activate Trial
-Primary marketing CTAs

2.3 Accent Colors
Name	                Token	                     Hex	       Usage
Amber Highlight	        --color-brand-yellow-400	 #ffd731	   Highlight sections
Amber Hover	            --color-brand-yellow-500	 #e6c12c	   Accent hover

**Used in:**
-Highlight blocks
-Feature sections
-Marketing areas

2.4 Neutral Colors
Name	               Token	                Hex	        Usage
White	               --color-white	        #ffffff	    Cards / backgrounds
Soft Surface	       --color-surface	        #f8f8f8	    Panels
Border	               --color-border	        #e0e0e0	    Dividers
Primary Text	       --color-text-strong	    #101010	    Headings
Body Text	           --color-text-body	    #6b6b6b	    Paragraphs


# 3. Typography

**Primary font:**
Poppins

**Font hierarchy:**
Element	            Size	            Usage
H1	                44px	            Hero titles
H2	                32px	            Section titles
H3	                24px	            Card titles
Body	            16px	            Paragraph text
Small	            14px	            Metadata


**Rules:**
-Avoid long paragraphs
-Use max line width of 60–70 characters
-Keep section headings clear

4. Buttons
-Buttons follow a consistent hierarchy.

4.1 Primary Button
-Used for the main action on the page

Example:
-Get Started
Activate Trial
-Create School

Color:
Red

Token:
--color-brand-red-600

4.2 Secondary Button
-Used for secondary actions.

Example:
Contact Sales
Learn More

Color:
Dark neutral

4.3 Success Button
-Used inside the product UI

Example:
Save
Confirm

Color:
Green

Token:
--color-brand-green-800

5. Cards

Cards are used for:
-Features
-Pricing
-Testimonials
-Modules

**Standard card styling:**
border-radius: 18px
padding: 2rem
background: white
shadow: soft

Hover behaviour:
translateY(-3px)

*NOTE*
Never use heavy shadows.

6. Layout

Maximum page width:
1200px

Section spacing:
5rem vertical padding

Grid usage:
Grid	            Use
2 column	        text + image
3 column	        feature cards
4 column	        pricing tables

Mobile breakpoint:
900px


7. Spacing System

Use spacing tokens.

Token	                Size
--space-1	            4px
--space-2	            8px
--space-4	            16px
--space-6	            24px
--space-8	            32px
--space-12	            48px
--space-16	            64px

*NOTE*
Never use random margins like margin: 37px.

8. Icons

Icons should be:
-simple
-outline style
-consistent size

Recommended icon library:
Lucide
or
Heroicons

9. Animation Guidelines
Animations must be subtle.

Allowed:
hover elevation
button hover
small transitions

*NOTE*
Avoid:
bouncing animations
long loading animations
flashing effects

10. Component Reuse Rules

Before creating a new component:
-Check existing components
-Reuse existing styles
-Avoid duplicating CSS

**NOTE**
If a new component is created:
add it to components.css
document it here

11. Developer Rules

All developers must follow:
-Use design tokens
-Do not hardcode colors
-Maintain spacing consistency
-Keep components reusable
-Follow typography hierarchy
-Pull requests should be reviewed for UI consistency.

12. Future Improvements

Planned additions to the design system:
-Component library
-Figma design kit
-Dark mode support
-UI testing guidelines
-Accessibility standards
-End of Document
-EduMyles Design System
