# Nickle Color Palette

## Primary Colors

### Nickle Green (Primary Brand Color)
```
HEX:  #22C55E
RGB:  34, 197, 94
CMYK: 83, 0, 52, 23
HSL:  142°, 71%, 45%
```
**Usage:** Primary actions, logos, key highlights, success states, income, house savings

---

### Dark Gray (Text & Headers)
```
HEX:  #1F2937
RGB:  31, 41, 55
CMYK: 44, 25, 0, 78
HSL:  214°, 28%, 17%
```
**Usage:** Headlines, body text, dark backgrounds

---

## Secondary Colors

### Blue (Car/Transport)
```
HEX:  #3B82F6
RGB:  59, 130, 246
CMYK: 76, 47, 0, 4
HSL:  217°, 91%, 60%
```
**Usage:** Car-related features, transport savings, informational elements

---

### Orange (Expenses)
```
HEX:  #F97316
RGB:  249, 115, 22
CMYK: 0, 54, 91, 2
HSL:  25°, 95%, 53%
```
**Usage:** Expense categories, warnings, attention-grabbing elements

---

### Purple (Savings)
```
HEX:  #A855F7
RGB:  168, 85, 247
CMYK: 32, 66, 0, 3
HSL:  271°, 91%, 65%
```
**Usage:** Savings goals, achievements, success milestones

---

### Gray (Supporting Text)
```
HEX:  #6B7280
RGB:  107, 114, 128
CMYK: 16, 11, 0, 50
HSL:  220°, 9%, 46%
```
**Usage:** Secondary text, captions, metadata, subtle elements

---

### Light Gray (Backgrounds)
```
HEX:  #F3F4F6
RGB:  243, 244, 246
CMYK: 1, 1, 0, 4
HSL:  220°, 14%, 96%
```
**Usage:** Page backgrounds, cards, subtle separators

---

## Color Combinations

### High Contrast (Accessibility)
- **Text on White:** Dark Gray (#1F2937) ✓ WCAG AAA
- **Text on Light Gray:** Dark Gray (#1F2937) ✓ WCAG AAA
- **White on Nickle Green:** White (#FFFFFF) ✓ WCAG AA
- **White on Blue:** White (#FFFFFF) ✓ WCAG AA
- **White on Orange:** White (#FFFFFF) ✓ WCAG AA
- **White on Purple:** White (#FFFFFF) ✓ WCAG AA

### Recommended Pairings
- **Income:** Nickle Green + Light Green background (#F0FDF4)
- **Expenses:** Orange + Light Orange background (#FFF7ED)
- **Savings:** Purple + Light Purple background (#FAF5FF)
- **Car:** Blue + Light Blue background (#DBEAFE)
- **House:** Green + Light Green background (#DCFCE7)

---

## CSS Variables

```css
:root {
  /* Primary */
  --nickle-green: #22C55E;
  --dark-gray: #1F2937;
  
  /* Secondary */
  --blue: #3B82F6;
  --orange: #F97316;
  --purple: #A855F7;
  --gray: #6B7280;
  --light-gray: #F3F4F6;
  
  /* Light variants */
  --green-light: #F0FDF4;
  --blue-light: #DBEAFE;
  --orange-light: #FFF7ED;
  --purple-light: #FAF5FF;
  
  /* Semantic */
  --color-primary: var(--nickle-green);
  --color-text: var(--dark-gray);
  --color-text-secondary: var(--gray);
  --color-background: var(--light-gray);
  --color-success: var(--nickle-green);
  --color-warning: var(--orange);
  --color-info: var(--blue);
}
```

---

## Tailwind CSS Classes

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'nickle-green': '#22C55E',
        'dark-gray': '#1F2937',
        'blue': '#3B82F6',
        'orange': '#F97316',
        'purple': '#A855F7',
        'gray': '#6B7280',
        'light-gray': '#F3F4F6',
      }
    }
  }
}
```

---

## Usage Examples

### Buttons
```css
/* Primary Button */
background: #22C55E;
color: #FFFFFF;
border: none;

/* Secondary Button */
background: transparent;
color: #22C55E;
border: 2px solid #22C55E;

/* Danger Button */
background: #F97316;
color: #FFFFFF;
border: none;
```

### Cards
```css
/* Income Card */
background: #F0FDF4;
border: 2px solid #22C55E;

/* Expense Card */
background: #FFF7ED;
border: 2px solid #F97316;

/* Savings Card */
background: #FAF5FF;
border: 2px solid #A855F7;
```

### Text
```css
/* Heading */
color: #1F2937;
font-weight: bold;

/* Body */
color: #1F2937;

/* Caption */
color: #6B7280;
```

---

**© 2025 Nickle. All rights reserved.**
