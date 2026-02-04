# Release Notes

## Version 2026-02-04

### Major Tech Stack Modernization

**Complete migration from Bootstrap to Tailwind CSS** resulting in significant performance improvements.

#### Performance Improvements

- **Bundle Size Reduction**: 35% smaller total bundle
  - CSS: 311.67 KB → 10.69 KB (96.6% reduction)
  - JavaScript: 478.69 KB → 408.50 KB (14.7% reduction)
  - Total (gzipped): 192.85 KB → 126.04 KB (34.6% reduction)
- **Module Optimization**: 20% fewer modules transformed (1493 → 1189)
- **Dependencies**: Reduced from 32 to 26 packages

#### Technical Changes

- Replaced Bootstrap 5 + react-bootstrap with Tailwind CSS v4
- Replaced analytics wrapper packages with direct gtag.js integration
- Converted Bootstrap Icons to inline SVG icons
- Maintained all existing functionality with improved performance
- Enhanced dark mode support with better color contrast
- Cleaner, more maintainable component code

#### Visual Improvements

- Improved text readability in both light and dark modes
- Better color contrast throughout the UI
- Consistent styling with Owlbear Rodeo theme
- Smoother hover states and transitions
- Responsive dropdown menu for navigation

---
