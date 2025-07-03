# TypeScript Guide - @kineticapps/icons

This guide covers TypeScript usage with @kineticapps/icons, including type definitions, advanced patterns, and best practices.

## Table of Contents

- [Type Definitions](#type-definitions)
- [Basic TypeScript Usage](#basic-typescript-usage)
- [Advanced Patterns](#advanced-patterns)
- [Type Guards and Utilities](#type-guards-and-utilities)
- [Generic Components](#generic-components)
- [Module Augmentation](#module-augmentation)
- [Best Practices](#best-practices)

## Type Definitions

### Core Types

```typescript
// Icon name type - union of all available icon names
export type IconName = 'activity' | 'airplay' | 'anchor' | /* ... all icon names */;

// Icon size type
export type IconSize = string | number;

// Icon component props
export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  variant?: 'line' | 'solid';
  strokeWidth?: number;
  className?: string; // React Web only
  style?: React.CSSProperties | ViewStyle; // Platform specific
}

// Individual icon component props
export interface KineticIconProps {
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
  className?: string; // React Web only
  style?: React.CSSProperties | ViewStyle;
}

// Icon component type
export type KineticIcon = React.ForwardRefExoticComponent<KineticIconProps>;
```

## Basic TypeScript Usage

### Importing Types

```typescript
import { 
  Icon, 
  IconName, 
  IconProps, 
  KineticIcon,
  KineticIconProps 
} from '@kineticapps/icons';
```

### Type-Safe Icon Names

```typescript
// ✅ Valid - TypeScript knows these are valid icon names
const validIcon: IconName = 'heart';
const anotherValid: IconName = 'star';

// ❌ Error - TypeScript will catch invalid names
const invalidIcon: IconName = 'not-an-icon'; // Type error
```

### Component Props

```typescript
interface MyComponentProps {
  icon: IconName;
  iconSize?: number;
  iconColor?: string;
}

function MyComponent({ icon, iconSize = 24, iconColor = '#000' }: MyComponentProps) {
  return <Icon name={icon} size={iconSize} color={iconColor} />;
}
```

## Advanced Patterns

### Icon Registry Pattern

```typescript
import { KineticIcon, home, user, settings, bell } from '@kineticapps/icons';

// Create a typed icon registry
interface IconRegistry {
  home: KineticIcon;
  user: KineticIcon;
  settings: KineticIcon;
  notifications: KineticIcon;
}

const icons: IconRegistry = {
  home,
  user,
  settings,
  notifications: bell, // Map different names
};

// Type-safe icon lookup
function getIcon<K extends keyof IconRegistry>(name: K): IconRegistry[K] {
  return icons[name];
}
```

### Conditional Icon Types

```typescript
type StatusIconName = 'checkCircle' | 'xCircle' | 'alertCircle';
type NavigationIconName = 'home' | 'search' | 'user' | 'settings';

interface StatusIconProps {
  status: 'success' | 'error' | 'warning';
  size?: number;
}

const statusIconMap: Record<StatusIconProps['status'], StatusIconName> = {
  success: 'checkCircle',
  error: 'xCircle',
  warning: 'alertCircle',
};

function StatusIcon({ status, size = 20 }: StatusIconProps) {
  const iconName = statusIconMap[status];
  const color = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  }[status];
  
  return <Icon name={iconName} size={size} color={color} variant="solid" />;
}
```

### Factory Pattern

```typescript
import { IconName, IconProps } from '@kineticapps/icons';

// Icon configuration factory
interface IconConfig extends Omit<IconProps, 'name'> {
  name: IconName;
  label: string;
  category?: string;
}

function createIconConfig(
  name: IconName,
  label: string,
  overrides?: Partial<IconConfig>
): IconConfig {
  return {
    name,
    label,
    size: 24,
    color: 'currentColor',
    variant: 'line',
    ...overrides,
  };
}

// Usage
const navigationIcons: IconConfig[] = [
  createIconConfig('home', 'Home', { category: 'navigation' }),
  createIconConfig('user', 'Profile', { category: 'navigation' }),
  createIconConfig('settings', 'Settings', { category: 'navigation', variant: 'solid' }),
];
```

## Type Guards and Utilities

### Icon Name Validation

```typescript
import { IconName } from '@kineticapps/icons';

// Type guard to check if a string is a valid icon name
function isValidIconName(name: string): name is IconName {
  // This would ideally check against the actual icon list
  return true; // Simplified
}

// Safe icon component
interface SafeIconProps extends Omit<IconProps, 'name'> {
  name: string;
  fallback?: IconName;
}

function SafeIcon({ name, fallback = 'help', ...props }: SafeIconProps) {
  const iconName = isValidIconName(name) ? name : fallback;
  return <Icon name={iconName} {...props} />;
}
```

### Variant Type Guards

```typescript
type IconVariant = 'line' | 'solid';

function hasVariant(iconName: IconName, variant: IconVariant): boolean {
  // Check if a specific variant exists for an icon
  if (variant === 'solid') {
    return iconName !== 'someLineOnlyIcon'; // Example
  }
  return true;
}

function getIconWithFallback(
  name: IconName,
  preferredVariant: IconVariant
): { name: IconName; variant: IconVariant } {
  const variant = hasVariant(name, preferredVariant) ? preferredVariant : 'line';
  return { name, variant };
}
```

## Generic Components

### Generic Icon Button

```typescript
interface IconButtonProps<T extends IconName = IconName> {
  icon: T;
  onClick: (icon: T) => void;
  variant?: 'line' | 'solid';
  size?: number;
}

function IconButton<T extends IconName>({
  icon,
  onClick,
  variant = 'line',
  size = 24,
}: IconButtonProps<T>) {
  return (
    <button onClick={() => onClick(icon)}>
      <Icon name={icon} variant={variant} size={size} />
    </button>
  );
}

// Usage with specific icon subset
type ActionIcon = 'edit' | 'trash' | 'save';

function ActionBar() {
  const handleAction = (icon: ActionIcon) => {
    console.log(`Action: ${icon}`);
  };
  
  return (
    <>
      <IconButton<ActionIcon> icon="edit" onClick={handleAction} />
      <IconButton<ActionIcon> icon="trash" onClick={handleAction} />
      <IconButton<ActionIcon> icon="save" onClick={handleAction} />
    </>
  );
}
```

### Generic Icon List

```typescript
interface IconListItem<T extends IconName = IconName> {
  id: string;
  icon: T;
  label: string;
  onClick?: () => void;
}

interface IconListProps<T extends IconName = IconName> {
  items: IconListItem<T>[];
  iconSize?: number;
  iconColor?: string;
}

function IconList<T extends IconName>({ 
  items, 
  iconSize = 20, 
  iconColor 
}: IconListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={item.onClick}>
          <Icon name={item.icon} size={iconSize} color={iconColor} />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
```

## Module Augmentation

### Extending Icon Types

```typescript
// In your project's types file
declare module '@kineticapps/icons' {
  // Add custom props to all icons
  interface KineticIconProps {
    testID?: string; // For testing
    accessible?: boolean; // For accessibility
  }
  
  // Add custom metadata
  interface IconMetadata {
    category?: string;
    keywords?: string[];
    deprecated?: boolean;
  }
}
```

### Creating Icon Subsets

```typescript
import { IconName } from '@kineticapps/icons';

// Define icon categories
type SocialIcon = Extract<IconName, 'facebook' | 'twitter' | 'instagram' | 'linkedin'>;
type FileIcon = Extract<IconName, 'file' | 'fileText' | 'fileImage' | 'fileVideo'>;
type ArrowIcon = Extract<IconName, 'arrowUp' | 'arrowDown' | 'arrowLeft' | 'arrowRight'>;

// Category-specific components
interface SocialIconProps {
  platform: SocialIcon;
  size?: number;
}

function SocialIcon({ platform, size = 24 }: SocialIconProps) {
  return <Icon name={platform} size={size} />;
}
```

## Best Practices

### 1. Use Const Assertions

```typescript
// Use const assertion for icon configurations
const ICON_CONFIG = {
  navigation: {
    home: { icon: 'home', label: 'Home' },
    profile: { icon: 'user', label: 'Profile' },
  },
} as const;

type NavigationKey = keyof typeof ICON_CONFIG.navigation;
```

### 2. Create Type-Safe Mappings

```typescript
// Type-safe icon mapping
const iconMap = {
  success: 'checkCircle',
  error: 'xCircle',
  warning: 'alertTriangle',
  info: 'infoCircle',
} as const satisfies Record<string, IconName>;

type StatusType = keyof typeof iconMap;
```

### 3. Use Discriminated Unions

```typescript
type IconAction = 
  | { type: 'navigate'; icon: NavigationIconName; to: string }
  | { type: 'action'; icon: ActionIcon; handler: () => void }
  | { type: 'external'; icon: 'externalLink'; url: string };

function handleIconAction(action: IconAction) {
  switch (action.type) {
    case 'navigate':
      // TypeScript knows action.icon is NavigationIconName
      break;
    case 'action':
      // TypeScript knows action.handler exists
      action.handler();
      break;
    case 'external':
      // TypeScript knows action.url exists
      window.open(action.url);
      break;
  }
}
```

### 4. Type-Safe Theme Integration

```typescript
interface Theme {
  icons: {
    defaultSize: number;
    colors: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    variants: {
      default: 'line';
      active: 'solid';
    };
  };
}

interface ThemedIconProps {
  name: IconName;
  variant?: keyof Theme['icons']['variants'];
  color?: keyof Theme['icons']['colors'];
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 16, md: 24, lg: 32 } as const;

function ThemedIcon({ 
  name, 
  variant = 'default',
  color = 'primary',
  size = 'md' 
}: ThemedIconProps) {
  const theme = useTheme(); // Assuming a theme hook
  
  return (
    <Icon
      name={name}
      variant={theme.icons.variants[variant]}
      color={theme.icons.colors[color]}
      size={sizeMap[size]}
    />
  );
}
```

### 5. Error Boundaries

```typescript
interface IconErrorBoundaryState {
  hasError: boolean;
  iconName?: string;
}

class IconErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: IconName },
  IconErrorBoundaryState
> {
  state: IconErrorBoundaryState = { hasError: false };
  
  static getDerivedStateFromError(error: Error): IconErrorBoundaryState {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <Icon name={this.props.fallback || 'alertCircle'} />;
    }
    
    return this.props.children;
  }
}
```

## Next Steps

- Review the [React Guide](./react-guide.md) for web-specific patterns
- Check the [React Native Guide](./react-native-guide.md) for mobile patterns
- Explore [Examples](./examples.md) for real-world usage
- Read the [API Reference](../README.md#api-reference) for complete type documentation