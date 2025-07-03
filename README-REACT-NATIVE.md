# Using @kineticapps/icons in React Native / Expo

## Important Note

Currently, the icons use web SVG elements. For React Native, you'll need to ensure your bundler supports SVG transformation or use React Native Web.

## Installation

```bash
npm install @kineticapps/icons react-native-svg
# or
yarn add @kineticapps/icons react-native-svg
# or
pnpm add @kineticapps/icons react-native-svg
```

For Expo:
```bash
npx expo install @kineticapps/icons react-native-svg
```

## Usage

### Basic Usage

```tsx
import { activity, bell01, heart } from '@kineticapps/icons';

function MyComponent() {
  return (
    <View>
      <activity size={24} color="#000" />
      <bell01 size={32} color="red" />
      <heart size={48} color="pink" />
    </View>
  );
}
```

### Using the Icon Component

```tsx
import { Icon } from '@kineticapps/icons';

function MyComponent() {
  return (
    <View>
      <Icon name="activity" size="md" color="#000" />
      <Icon name="bell01" size={32} color="red" variant="line" />
      <Icon name="heart" size="xl" color="pink" variant="solid" />
    </View>
  );
}
```

### Available Sizes

- `xs`: 12px
- `sm`: 16px
- `md`: 24px (default)
- `lg`: 32px
- `xl`: 48px
- Or use any number

### TypeScript Support

All icon names are fully typed:

```tsx
import { Icon, type IconName } from '@kineticapps/icons';

const iconName: IconName = 'activity'; // ✅ TypeScript knows all valid names
```

### Performance Tips

1. **Import only what you need** - Each icon is tree-shakeable
2. **Use consistent sizes** - This helps with layout performance
3. **Prefer the Icon component** for dynamic icons

## Styling

Icons accept all standard React Native style props:

```tsx
<Icon 
  name="activity" 
  size={24} 
  color="#000"
  style={{ 
    marginRight: 8,
    transform: [{ rotate: '45deg' }]
  }} 
/>
```

## Common Patterns

### Icon Button
```tsx
<TouchableOpacity onPress={handlePress}>
  <Icon name="settings01" size={24} color="#007AFF" />
</TouchableOpacity>
```

### With Text
```tsx
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Icon name="mail01" size={20} color="#666" />
  <Text style={{ marginLeft: 8 }}>Email</Text>
</View>
```

### Tab Bar Icons
```tsx
function TabBarIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <Icon 
      name={name} 
      size={24} 
      color={focused ? '#007AFF' : '#999'} 
    />
  );
}
```

## Troubleshooting

If icons appear as black boxes or don't render:
1. Make sure `react-native-svg` is properly installed
2. For Expo, run `npx expo install react-native-svg`
3. Clear your metro cache: `npx expo start -c`