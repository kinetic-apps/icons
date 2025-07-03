# Tree-shaking Strategy for @kineticapps/icons

## Current Issues
1. All icons are bundled into large index files (line-1_5px.ts, solid.ts)
2. Using `export * from './components'` prevents effective tree-shaking
3. Even importing a single icon brings in all icons

## Proposed Solution

### Option 1: Deep Imports (Recommended)
Allow users to import icons directly:
```typescript
// Instead of:
import { Activity } from '@kineticapps/icons';

// Use:
import Activity from '@kineticapps/icons/dist/icons/Activity';
// or with variants:
import { ActivityLine15px, ActivitySolid } from '@kineticapps/icons/dist/icons/Activity';
```

### Option 2: Subpath Exports
Configure package.json exports for each icon:
```json
{
  "exports": {
    "./Activity": {
      "import": "./dist/icons/Activity.mjs",
      "require": "./dist/icons/Activity.js",
      "types": "./dist/icons/Activity.d.ts"
    }
    // ... for each icon
  }
}
```

### Option 3: Build-time Optimization
Create a babel/webpack plugin that transforms:
```typescript
import { Activity } from '@kineticapps/icons';
```
Into:
```typescript
import Activity from '@kineticapps/icons/dist/icons/Activity';
```

## Implementation Steps

1. **Update build process** to create individual icon modules
2. **Avoid barrel exports** in the main index
3. **Document import patterns** for users
4. **Consider creating a codemod** for migration