# @kineticapps/icons

Kinetic Apps icon library - a comprehensive set of customizable SVG icons for React and React Native applications.

## Installation

This is a private package published to GitHub Packages. First, configure your `.npmrc`:

```bash
echo "@kineticapps:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}" >> .npmrc
```

Then install:

```bash
npm install @kineticapps/icons
# or
yarn add @kineticapps/icons
# or
pnpm add @kineticapps/icons
```

## Usage

### React (Web)

```tsx
import { Activity, Bell, Heart } from '@kineticapps/icons';

// Default usage
<Activity />

// Custom size and color
<Activity size={32} color="#FF5733" />

// Custom stroke width (for line icons)
<Activity strokeWidth={2} />

// Import specific variants
import { ActivityLine15px } from '@kineticapps/icons/line';
import { ActivitySolid } from '@kineticapps/icons/solid';
```

### React Native

```tsx
import { Activity, Bell, Heart } from '@kineticapps/icons';

// Works the same as web
<Activity size={32} color="#FF5733" />

// Or use the Icon component for dynamic icons
import { Icon } from '@kineticapps/icons/native';

<Icon name="activity" variant="line" size={32} color="#FF5733" />
```

## Available Icons

The library includes hundreds of icons in two variants:
- **Line**: Outline icons with 1.5px stroke width
- **Solid**: Filled icons

All icons support the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | number \| string | 24 | Icon size (width and height) |
| color | string | 'currentColor' | Icon color |
| strokeWidth | number \| string | 1.5 | Stroke width (line icons only) |
| ...props | SVGProps | - | Any valid SVG props |

## Tree Shaking

The package is fully tree-shakable. Only the icons you import will be included in your bundle:

```tsx
// ✅ Good - only imports what you need
import { Activity, Bell } from '@kineticapps/icons';

// ❌ Avoid - imports all icons
import * as Icons from '@kineticapps/icons';
```

## Development

### Building the Package

```bash
npm run build
```

This will:
1. Convert all SVG files to React/React Native components
2. Generate TypeScript definitions
3. Bundle with tree-shaking support

### Adding New Icons

1. Add SVG files to the appropriate directory:
   - `icons/Line/1.5px/` for line icons
   - `icons/Solid/` for solid icons
2. Run `npm run build`
3. Commit and push - the package will be automatically released

## License

MIT © Kinetic Apps