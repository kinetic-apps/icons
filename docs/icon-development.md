# Icon Development Guide - @kineticapps/icons

This guide helps team members add new icons and maintain the icon library.

## Table of Contents

- [Getting Started](#getting-started)
- [Adding New Icons](#adding-new-icons)
- [Icon Guidelines](#icon-guidelines)
- [Development Workflow](#development-workflow)
- [Testing Your Changes](#testing-your-changes)
- [Code Style](#code-style)

## Getting Started

### Prerequisites

- Node.js 14 or higher
- SVG editor (Figma, Illustrator, Inkscape, etc.)
- Basic knowledge of SVG format

### Setting Up

1. Clone the repository:
   ```bash
   git clone git@github.com:kineticapps/kinetic-icons.git
   cd kinetic-icons
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a new branch:
   ```bash
   git checkout -b add-new-icons
   ```

## Adding New Icons

### Icon Structure

Icons are organized in the following structure:
```
icons/
├── Line/
│   └── 1.5px/
│       ├── activity.svg
│       ├── airplay.svg
│       └── ...
└── Solid/
    ├── activity.svg
    ├── airplay.svg
    └── ...
```

### Adding a New Icon

1. **Create the SVG files**:
   - Line variant: Save to `icons/Line/1.5px/your-icon-name.svg`
   - Solid variant: Save to `icons/Solid/your-icon-name.svg`

2. **Follow naming conventions**:
   - Use kebab-case: `arrow-right.svg`, not `ArrowRight.svg`
   - Be descriptive: `credit-card.svg`, not `cc.svg`
   - Use common prefixes:
     - `arrow-*` for arrows
     - `chevron-*` for chevrons
     - `file-*` for file types
     - `alert-*` for alerts

3. **Build the icons**:
   ```bash
   npm run build
   ```

4. **Test your icons**:
   ```bash
   # Test in React
   cd test-app
   npm run dev
   
   # Test in React Native
   cd ../expo-test-app
   npm start
   ```

## Icon Guidelines

### Design Principles

1. **Consistent Size**: All icons should be designed on a 24x24 grid
2. **Stroke Width**: Line icons should use 1.5px stroke width
3. **Color**: Icons should use `currentColor` for flexibility
4. **Simplicity**: Icons should be simple and recognizable at small sizes
5. **Alignment**: Icons should be optically centered within the viewbox

### SVG Requirements

#### Required Attributes
```xml
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Icon paths -->
</svg>
```

#### Line Icons
```xml
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path 
    d="M12 2L2 7L12 12L22 7L12 2Z" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  />
</svg>
```

#### Solid Icons
```xml
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path 
    d="M12 2L2 7L12 12L22 7L12 2Z" 
    fill="currentColor"
  />
</svg>
```

### Icon Checklist

Before submitting an icon, ensure:

- [ ] Icon is designed on a 24x24 grid
- [ ] ViewBox is set to "0 0 24 24"
- [ ] No hardcoded colors (use `currentColor`)
- [ ] Line variant uses 1.5px stroke width
- [ ] Both line and solid variants exist
- [ ] Icon is optically centered
- [ ] Icon is recognizable at 16px size
- [ ] SVG is optimized (no unnecessary attributes)
- [ ] File name follows kebab-case convention

## Development Workflow

### Building Icons

The build process converts SVG files to React components:

```bash
# Build all icons
npm run build

# This runs:
# 1. build-icons.js - Builds React components
# 2. build-icons-rn.js - Builds React Native components
# 3. build-icons-data.js - Generates icon metadata
```

### File Generation

The build process generates:
- `src/components/` - React components
- `src/components-rn/` - React Native components
- `src/icon-data/` - Icon metadata
- TypeScript definitions

### Local Development

1. Make changes to SVG files
2. Run `npm run build`
3. Test in both test apps
4. Commit your changes

## Testing Your Changes

### React Testing

```bash
cd test-app
npm install
npm run dev
```

1. Open http://localhost:5173
2. Search for your new icon
3. Test both variants
4. Test different sizes and colors

### React Native Testing

```bash
cd expo-test-app
npm install
npm start
```

1. Open in Expo Go or simulator
2. Search for your new icon
3. Test both variants
4. Test on both iOS and Android

### Testing Checklist

- [ ] Icon appears in both test apps
- [ ] Both line and solid variants work
- [ ] Icon scales properly at different sizes
- [ ] Color prop works correctly
- [ ] No console errors
- [ ] Icon is centered properly

## Committing Changes

### Commit Guidelines

Follow conventional commits:
```bash
# Adding new icons
git commit -m "feat: add shopping-cart and shopping-bag icons"

# Fixing existing icons
git commit -m "fix: correct alignment for arrow-right icon"

# Updating documentation
git commit -m "docs: update icon development guide"
```

### Pushing Changes

1. **Push your changes**:
   ```bash
   git push origin your-branch-name
   ```

2. **Create a merge request or notify the team about your changes**

## Code Style

### SVG Formatting

Use consistent formatting for SVG files:
```xml
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path 
    d="M12 2L2 7L12 12L22 7L12 2Z" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  />
</svg>
```

### Optimization

Before submitting, optimize your SVGs:
1. Remove unnecessary attributes
2. Round coordinates to reasonable precision
3. Remove empty groups
4. Merge paths where possible

### Tools for Optimization

- [SVGO](https://github.com/svg/svgo) - Command line tool
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Online tool
- Figma plugins for SVG export

## Getting Help

- Check existing icons for examples
- Review the [Icon Guidelines](#icon-guidelines)
- Ask the team in Slack
- Check the design system documentation