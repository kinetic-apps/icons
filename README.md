# @kineticapps/icons

A comprehensive icon library for React and React Native applications, featuring over 2,300+ beautifully crafted icons in line and solid variants.

## Features

- 🎨 **2,300+ icons** in two variants (line and solid)
- 📱 **React & React Native support** with platform-specific optimizations
- 🎯 **TypeScript support** with full type safety
- 🌲 **Tree-shakeable** - only import the icons you use
- 🎨 **Customizable** - control size, color, and stroke width
- ⚡ **Optimized** - minimal bundle size impact

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

### Peer Dependencies

For React Native projects, you'll also need:
```bash
npm install react-native-svg
```

## Usage

### React (Web)

```jsx
import { Icon } from '@kineticapps/icons';

// Using the Icon component with dynamic icon names
function MyComponent() {
  return (
    <Icon name="heart" size={24} color="#FF5733" />
  );
}

// You can also specify variants
<Icon name="heart" variant="solid" size={32} />
<Icon name="heart" variant="line" strokeWidth={2} />
```

### React Native

```jsx
import { Icon } from '@kineticapps/icons';

function MyComponent() {
  return (
    <Icon name="heart" size={24} color="#FF5733" />
  );
}
```

### Direct Icon Import

For better tree-shaking and type safety, you can import icons directly:

```jsx
// React/React Native
import { heart, heartSolid } from '@kineticapps/icons';

function MyComponent() {
  const HeartIcon = heart;
  const HeartSolidIcon = heartSolid;
  
  return (
    <>
      <HeartIcon size={24} color="#FF5733" />
      <HeartSolidIcon size={24} color="#FF5733" />
    </>
  );
}
```

### TypeScript

The library includes full TypeScript support:

```typescript
import { Icon, IconName, IconProps } from '@kineticapps/icons';

// IconName type includes all available icon names
const iconName: IconName = 'heart';

// Type-safe props
const iconProps: IconProps = {
  name: 'heart',
  size: 24,
  color: '#FF5733',
  variant: 'solid'
};

// Direct imports are also fully typed
import { activity } from '@kineticapps/icons';
// activity: KineticIcon
```

## API Reference

### Icon Component

The main component for rendering icons dynamically.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `IconName` | required | The name of the icon to render |
| `size` | `number \| string` | `24` | Size of the icon |
| `color` | `string` | `"currentColor"` | Color of the icon |
| `variant` | `"line" \| "solid"` | `"line"` | Icon variant to use |
| `strokeWidth` | `number` | `1.5` | Stroke width for line variants |
| `className` | `string` | - | CSS class name (React Web only) |
| `style` | `object` | - | Inline styles |

### Individual Icon Components

Each icon can be imported as a separate component:

```jsx
import { activity, activitySolid } from '@kineticapps/icons';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Size of the icon |
| `color` | `string` | `"currentColor"` | Color of the icon |
| `strokeWidth` | `number` | `1.5` | Stroke width (line variants only) |
| `className` | `string` | - | CSS class name (React Web only) |
| `style` | `object` | - | Inline styles |

## Icon Naming Convention

Icons follow a consistent naming pattern:
- Base name: `iconName` (e.g., `heart`, `arrowRight`)
- Solid variant: `iconNameSolid` (e.g., `heartSolid`, `arrowRightSolid`)

## Examples

### Customizing Icons

```jsx
// Custom size and color
<Icon name="star" size={48} color="#FFD700" />

// Custom stroke width for line icons
<Icon name="circle" variant="line" strokeWidth={2.5} />

// Using with Tailwind CSS (React Web)
<Icon name="check" className="w-6 h-6 text-green-500" />

// Custom styles
<Icon 
  name="bell" 
  style={{ transform: 'rotate(15deg)' }}
/>
```

### Icon Button Example

```jsx
function IconButton({ icon, onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label}>
      <Icon name={icon} size={20} />
    </button>
  );
}
```

### Conditional Rendering

```jsx
function StatusIcon({ status }) {
  const iconName = status === 'success' ? 'checkCircle' : 'xCircle';
  const color = status === 'success' ? '#10B981' : '#EF4444';
  
  return <Icon name={iconName} color={color} variant="solid" />;
}
```

### React Native with Styling

```jsx
import { View, TouchableOpacity } from 'react-native';
import { Icon } from '@kineticapps/icons';

function IconButton({ icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 12 }}>
        <Icon name={icon} size={24} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );
}
```

## Available Icons

The library includes 2,300+ icons. To see all available icons:

1. Check the [test app](./test-app) for React or [expo-test-app](./expo-test-app) for React Native
2. Use TypeScript autocomplete with the `IconName` type
3. Browse the [icon source files](./icons)

### Icon Categories

Icons are organized into various categories:
- **Navigation**: arrow, chevron, caret icons
- **Actions**: edit, delete, save, share icons
- **UI Elements**: menu, close, check, plus, minus icons
- **Media**: play, pause, volume, camera icons
- **Communication**: mail, phone, message, notification icons
- **Files**: folder, file, document, download icons
- **Commerce**: cart, payment, currency icons
- And many more...

## Performance

### Tree Shaking

The library is designed to be tree-shakeable. When you import individual icons, only those icons will be included in your bundle:

```jsx
// ✅ Good - only imports what you use
import { heart, star } from '@kineticapps/icons';

// ⚠️ Less optimal - imports the Icon component logic
import { Icon } from '@kineticapps/icons';
```

### Bundle Size

- Individual icons: ~0.5-2KB each (uncompressed)
- Icon component: ~4KB (uncompressed)
- Full library: ~800KB (uncompressed, before tree-shaking)

## Browser Support

- React: All modern browsers (Chrome, Firefox, Safari, Edge)
- React Native: iOS 11+, Android 5+

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
3. The build process will automatically generate components for both platforms

### Testing Icons

To test the icons locally:

```bash
# For React (Web)
cd test-app
npm install
npm run dev

# For React Native
cd expo-test-app
npm install
npm start
```

## Development

For internal development:

1. Follow the existing icon naming conventions
2. Ensure icons work on both React and React Native
3. Test your changes in both test apps
4. Update documentation if needed

See the [Icon Development Guide](./docs/icon-development.md) for detailed instructions.

## License

MIT © Kinetic Apps