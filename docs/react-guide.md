# React Guide - @kineticapps/icons

This guide covers everything you need to know about using @kineticapps/icons in your React web applications.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Styling](#styling)
- [TypeScript](#typescript)
- [Performance Optimization](#performance-optimization)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

- React 16.8 or higher
- Node.js 14 or higher

### Setting up GitHub Packages

Since this is a private package, you need to configure npm to use GitHub Packages:

1. Create a personal access token on GitHub with `read:packages` permission
2. Configure your `.npmrc` file:

```bash
# In your project root
echo "@kineticapps:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc
```

3. Install the package:

```bash
npm install @kineticapps/icons
# or
yarn add @kineticapps/icons
# or
pnpm add @kineticapps/icons
```

## Basic Usage

### Using the Icon Component

The simplest way to use icons is with the `Icon` component:

```jsx
import { Icon } from '@kineticapps/icons';

function App() {
  return (
    <div>
      <Icon name="heart" />
      <Icon name="star" size={32} color="#FFD700" />
      <Icon name="check" variant="solid" />
    </div>
  );
}
```

### Direct Icon Import

For better tree-shaking and type safety:

```jsx
import { heart, star, checkSolid } from '@kineticapps/icons';

function App() {
  const HeartIcon = heart;
  
  return (
    <div>
      <HeartIcon />
      <star size={32} color="#FFD700" />
      <checkSolid />
    </div>
  );
}
```

## Advanced Usage

### Dynamic Icon Selection

```jsx
import { Icon } from '@kineticapps/icons';

function DynamicIcon({ iconName, isActive }) {
  return (
    <Icon 
      name={iconName}
      variant={isActive ? 'solid' : 'line'}
      color={isActive ? '#007AFF' : '#666'}
    />
  );
}
```

### Icon Mapping

```jsx
import { home, user, settings, bell } from '@kineticapps/icons';

const iconMap = {
  home,
  user,
  settings,
  notifications: bell
};

function NavigationItem({ icon, label }) {
  const IconComponent = iconMap[icon];
  
  return (
    <button>
      <IconComponent size={20} />
      <span>{label}</span>
    </button>
  );
}
```

### With Animation

```jsx
import { useState } from 'react';
import { heart, heartSolid } from '@kineticapps/icons';

function LikeButton() {
  const [liked, setLiked] = useState(false);
  const HeartIcon = liked ? heartSolid : heart;
  
  return (
    <button
      onClick={() => setLiked(!liked)}
      style={{ transition: 'all 0.2s' }}
    >
      <HeartIcon 
        size={24}
        color={liked ? '#FF0000' : '#666'}
        style={{
          transform: liked ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.2s'
        }}
      />
    </button>
  );
}
```

## Styling

### Using CSS Classes

```jsx
<Icon name="star" className="icon-star" />
```

```css
.icon-star {
  width: 24px;
  height: 24px;
  color: gold;
  transition: transform 0.2s;
}

.icon-star:hover {
  transform: rotate(15deg);
}
```

### With Tailwind CSS

```jsx
<Icon 
  name="bell" 
  className="w-6 h-6 text-gray-600 hover:text-blue-500 transition-colors"
/>
```

### Inline Styles

```jsx
<Icon 
  name="arrow-right"
  style={{
    color: '#007AFF',
    transform: 'translateX(2px)',
    transition: 'transform 0.2s'
  }}
/>
```

### CSS-in-JS (styled-components)

```jsx
import styled from 'styled-components';
import { bell } from '@kineticapps/icons';

const StyledBell = styled(bell)`
  color: ${props => props.hasNotifications ? '#FF0000' : '#666'};
  position: relative;
  
  &:hover {
    color: #007AFF;
  }
`;

function NotificationBell({ count }) {
  return <StyledBell hasNotifications={count > 0} />;
}
```

## TypeScript

### Type Imports

```typescript
import { Icon, IconName, IconProps, KineticIcon } from '@kineticapps/icons';
```

### Typed Icon Names

```typescript
const iconName: IconName = 'heart'; // Type-safe
const invalidName: IconName = 'invalid'; // TypeScript error
```

### Component Props

```typescript
interface ButtonProps {
  icon: IconName;
  variant?: 'line' | 'solid';
  onClick: () => void;
}

function IconButton({ icon, variant = 'line', onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      <Icon name={icon} variant={variant} />
    </button>
  );
}
```

### Creating Typed Icon Maps

```typescript
import { KineticIcon, home, user, settings } from '@kineticapps/icons';

type NavigationIcon = 'home' | 'user' | 'settings';

const navigationIcons: Record<NavigationIcon, KineticIcon> = {
  home,
  user,
  settings
};
```

## Performance Optimization

### Tree Shaking

Always prefer direct imports for better tree shaking:

```jsx
// ✅ Good - only includes used icons
import { heart, star } from '@kineticapps/icons';

// ❌ Avoid - includes all icon logic
import * as Icons from '@kineticapps/icons';
```

### Lazy Loading Icons

```jsx
import { lazy, Suspense } from 'react';

const LazyIcon = lazy(() => 
  import('@kineticapps/icons').then(module => ({ 
    default: module.Icon 
  }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyIcon name="heart" />
    </Suspense>
  );
}
```

### Memoization

```jsx
import { memo, useMemo } from 'react';
import { Icon } from '@kineticapps/icons';

const MemoizedIcon = memo(Icon);

function ExpensiveComponent({ iconName }) {
  const icon = useMemo(
    () => <MemoizedIcon name={iconName} />,
    [iconName]
  );
  
  return <div>{icon}</div>;
}
```

## Common Patterns

### Icon Button

```jsx
function IconButton({ icon, label, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="icon-button"
      {...props}
    >
      <Icon name={icon} size={20} />
    </button>
  );
}
```

### Icon with Badge

```jsx
function IconWithBadge({ icon, count }) {
  return (
    <div className="relative">
      <Icon name={icon} size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}
```

### Navigation Menu

```jsx
const menuItems = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'user', label: 'Profile', path: '/profile' },
  { icon: 'settings', label: 'Settings', path: '/settings' }
];

function NavigationMenu() {
  return (
    <nav>
      {menuItems.map(item => (
        <a key={item.path} href={item.path}>
          <Icon name={item.icon} size={20} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
```

### Loading States

```jsx
function LoadingButton({ loading, onClick, children }) {
  return (
    <button onClick={onClick} disabled={loading}>
      {loading ? (
        <Icon name="spinner" className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
```

## Troubleshooting

### Icons Not Displaying

1. **Check Installation**: Ensure the package is properly installed
   ```bash
   npm list @kineticapps/icons
   ```

2. **Verify Import**: Make sure you're importing correctly
   ```jsx
   // Correct
   import { Icon } from '@kineticapps/icons';
   
   // Incorrect
   import Icon from '@kineticapps/icons/Icon';
   ```

3. **Check Icon Name**: Verify the icon name exists
   ```jsx
   // Use TypeScript for autocomplete
   import type { IconName } from '@kineticapps/icons';
   ```

### TypeScript Errors

1. **Missing Types**: Ensure TypeScript is configured properly
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true
     }
   }
   ```

2. **Type Conflicts**: Clear TypeScript cache
   ```bash
   rm -rf node_modules/.cache
   npx tsc --build --clean
   ```

### Bundle Size Issues

1. **Check Imports**: Ensure you're not importing all icons
   ```jsx
   // Use specific imports
   import { heart } from '@kineticapps/icons';
   
   // Not
   import * as Icons from '@kineticapps/icons';
   ```

2. **Analyze Bundle**: Use bundle analyzer
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   ```

### Styling Issues

1. **CSS Specificity**: Icons inherit currentColor by default
   ```css
   /* Ensure parent has color set */
   .icon-container {
     color: #333;
   }
   ```

2. **Size Conflicts**: The size prop sets both width and height
   ```jsx
   // These are equivalent
   <Icon name="heart" size={24} />
   <Icon name="heart" style={{ width: 24, height: 24 }} />
   ```

## Next Steps

- Explore the [TypeScript Guide](./typescript-guide.md) for advanced type usage
- Check out [Examples](./examples.md) for more use cases
- Read the [Contributing Guide](./contributing.md) to add new icons