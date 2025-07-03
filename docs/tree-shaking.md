# Tree-shaking with @kineticapps/icons

## Import Methods

### Method 1: Named Imports (Standard)
```typescript
import { Activity, Calendar, Settings } from '@kineticapps/icons';
```
This works but may not tree-shake perfectly with all bundlers.

### Method 2: Direct Icon Imports (Recommended for optimal bundle size)
```typescript
// Import specific icon directly
import Activity from '@kineticapps/icons/dist/icons/line/1_5px/Activity';
import ActivitySolid from '@kineticapps/icons/dist/icons/solid/Activity';
```

### Method 3: Variant-specific Imports
```typescript
// Import only line icons
import { Activity, Calendar } from '@kineticapps/icons/line';

// Import only solid icons  
import { ActivitySolid, CalendarSolid } from '@kineticapps/icons/solid';
```

## Bundle Size Comparison

- Full import: ~500KB (all icons)
- Named imports: ~10-50KB (depending on bundler)
- Direct imports: ~2-3KB per icon

## Webpack/Vite Configuration

For optimal tree-shaking, ensure your bundler is configured properly:

### Webpack
```javascript
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
};
```

### Vite
Tree-shaking is enabled by default in production builds.