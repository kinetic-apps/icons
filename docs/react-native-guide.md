# React Native Guide - @kineticapps/icons

This guide covers everything you need to know about using @kineticapps/icons in your React Native applications.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [Styling](#styling)
- [Platform-Specific Usage](#platform-specific-usage)
- [TypeScript](#typescript)
- [Performance Optimization](#performance-optimization)
- [Common Patterns](#common-patterns)
- [Expo Support](#expo-support)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

- React Native 0.60 or higher
- react-native-svg 12.0 or higher

### Setting up GitHub Packages

Since this is a private package, you need to configure npm to use GitHub Packages:

1. Create a personal access token on GitHub with `read:packages` permission
2. Configure your `.npmrc` file:

```bash
# In your project root
echo "@kineticapps:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc
```

3. Install the package and peer dependencies:

```bash
npm install @kineticapps/icons react-native-svg
# or
yarn add @kineticapps/icons react-native-svg
```

### iOS Setup

For iOS, you need to run pod install:

```bash
cd ios && pod install
```

### Android Setup

Android should work automatically with React Native 0.60+ autolinking.

## Basic Usage

### Using the Icon Component

```jsx
import { Icon } from '@kineticapps/icons';
import { View } from 'react-native';

function App() {
  return (
    <View>
      <Icon name="heart" />
      <Icon name="star" size={32} color="#FFD700" />
      <Icon name="check" variant="solid" />
    </View>
  );
}
```

### Direct Icon Import

```jsx
import { heart, star, checkSolid } from '@kineticapps/icons';
import { View } from 'react-native';

function App() {
  const HeartIcon = heart;
  
  return (
    <View>
      <HeartIcon />
      <star size={32} color="#FFD700" />
      <checkSolid />
    </View>
  );
}
```

## Advanced Usage

### With TouchableOpacity

```jsx
import { TouchableOpacity } from 'react-native';
import { Icon } from '@kineticapps/icons';

function IconButton({ icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={icon} size={24} color="#007AFF" />
    </TouchableOpacity>
  );
}
```

### Dynamic Icon Selection

```jsx
import { Icon } from '@kineticapps/icons';
import { View, Text } from 'react-native';

function ListItem({ icon, title, isActive }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon 
        name={icon}
        variant={isActive ? 'solid' : 'line'}
        color={isActive ? '#007AFF' : '#666'}
      />
      <Text style={{ marginLeft: 8 }}>{title}</Text>
    </View>
  );
}
```

### With Reanimated

```jsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { heart, heartSolid } from '@kineticapps/icons';

function AnimatedLikeButton() {
  const [liked, setLiked] = useState(false);
  const scale = useSharedValue(1);
  
  const HeartIcon = liked ? heartSolid : heart;
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePress = () => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
    setLiked(!liked);
  };
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <HeartIcon size={24} color={liked ? '#FF0000' : '#666'} />
      </Animated.View>
    </TouchableOpacity>
  );
}
```

## Styling

### With StyleSheet

```jsx
import { StyleSheet, View } from 'react-native';
import { Icon } from '@kineticapps/icons';

const styles = StyleSheet.create({
  iconContainer: {
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
});

function StyledIcon() {
  return (
    <View style={styles.iconContainer}>
      <Icon name="bell" size={24} color="#333" />
    </View>
  );
}
```

### Inline Styles

```jsx
<Icon 
  name="arrow-right"
  size={24}
  style={{ transform: [{ rotate: '45deg' }] }}
/>
```

### With Styled Components

```jsx
import styled from 'styled-components/native';
import { bell } from '@kineticapps/icons';

const StyledBellContainer = styled.View`
  padding: 12px;
  background-color: ${props => props.hasNotifications ? '#FFE5E5' : '#F0F0F0'};
  border-radius: 20px;
`;

function NotificationBell({ count }) {
  return (
    <StyledBellContainer hasNotifications={count > 0}>
      <bell size={24} color={count > 0 ? '#FF0000' : '#666'} />
    </StyledBellContainer>
  );
}
```

## Platform-Specific Usage

### Platform-Specific Icons

```jsx
import { Platform } from 'react-native';
import { Icon } from '@kineticapps/icons';

function PlatformIcon() {
  return (
    <Icon 
      name={Platform.OS === 'ios' ? 'chevronRight' : 'arrowRight'}
      size={20}
    />
  );
}
```

### Platform-Specific Styling

```jsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  icon: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

## TypeScript

### Type Imports

```typescript
import { Icon, IconName, IconProps, KineticIcon } from '@kineticapps/icons';
import type { ViewStyle } from 'react-native';
```

### Typed Components

```typescript
interface IconButtonProps {
  icon: IconName;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

function IconButton({ 
  icon, 
  onPress, 
  size = 24, 
  color = '#007AFF',
  style 
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Icon name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}
```

### Navigation Types

```typescript
import { NavigationProp } from '@react-navigation/native';
import { IconName } from '@kineticapps/icons';

type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

interface TabConfig {
  name: keyof TabParamList;
  icon: IconName;
  label: string;
}

const tabs: TabConfig[] = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Profile', icon: 'user', label: 'Profile' },
  { name: 'Settings', icon: 'settings', label: 'Settings' },
];
```

## Performance Optimization

### Using React.memo

```jsx
import { memo } from 'react';
import { Icon } from '@kineticapps/icons';

const MemoizedIcon = memo(Icon);

function ExpensiveList({ items }) {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <View>
          <MemoizedIcon name={item.icon} />
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
}
```

### Optimizing Lists

```jsx
import { FlatList, View, Text } from 'react-native';
import { Icon } from '@kineticapps/icons';

function IconList({ icons }) {
  const renderIcon = useCallback(({ item }) => (
    <View style={styles.iconItem}>
      <Icon name={item.name} size={24} />
      <Text>{item.label}</Text>
    </View>
  ), []);
  
  return (
    <FlatList
      data={icons}
      renderItem={renderIcon}
      keyExtractor={item => item.name}
      getItemLayout={(data, index) => ({
        length: 80,
        offset: 80 * index,
        index,
      })}
    />
  );
}
```

## Common Patterns

### Tab Bar Icons

```jsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@kineticapps/icons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: 'home',
            Search: 'search',
            Profile: 'user',
          };
          
          return (
            <Icon
              name={icons[route.name]}
              variant={focused ? 'solid' : 'line'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### Action Sheet Icons

```jsx
import ActionSheet from 'react-native-actionsheet';
import { Icon } from '@kineticapps/icons';

function ActionSheetWithIcons() {
  const actionSheet = useRef();
  
  const options = [
    { icon: 'camera', label: 'Take Photo' },
    { icon: 'image', label: 'Choose from Library' },
    { icon: 'x', label: 'Cancel' },
  ];
  
  return (
    <>
      <TouchableOpacity onPress={() => actionSheet.current.show()}>
        <Icon name="plus" size={24} />
      </TouchableOpacity>
      
      <ActionSheet
        ref={actionSheet}
        options={options.map(opt => opt.label)}
        cancelButtonIndex={2}
        onPress={(index) => {
          // Handle selection
        }}
      />
    </>
  );
}
```

### Loading States

```jsx
import { ActivityIndicator, View } from 'react-native';
import { Icon } from '@kineticapps/icons';

function LoadingIcon({ loading, icon, ...props }) {
  if (loading) {
    return <ActivityIndicator size="small" color="#007AFF" />;
  }
  
  return <Icon name={icon} {...props} />;
}
```

### Badge Icon

```jsx
function BadgeIcon({ icon, count, size = 24 }) {
  return (
    <View>
      <Icon name={icon} size={size} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
```

## Expo Support

The library works seamlessly with Expo:

### Expo Installation

```bash
expo install @kineticapps/icons react-native-svg
```

### Using with Expo Icons

```jsx
import { Icon } from '@kineticapps/icons';
import { Ionicons } from '@expo/vector-icons';

function MixedIcons() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Icon name="heart" size={24} />
      <Ionicons name="ios-heart" size={24} />
    </View>
  );
}
```

## Troubleshooting

### Icons Not Displaying

1. **Check react-native-svg**: Ensure it's properly installed
   ```bash
   npx react-native info
   ```

2. **iOS Pod Issues**: 
   ```bash
   cd ios && pod deintegrate && pod install
   ```

3. **Metro Cache**: Clear Metro bundler cache
   ```bash
   npx react-native start --reset-cache
   ```

### Android Build Issues

1. **Clean Build**:
   ```bash
   cd android && ./gradlew clean
   ```

2. **Check Gradle Sync**: Ensure android/app/build.gradle has proper dependencies

### TypeScript Errors

1. **Update Types**:
   ```bash
   npm install --save-dev @types/react-native
   ```

2. **Check tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-native",
       "moduleResolution": "node"
     }
   }
   ```

### Performance Issues

1. **Use Production Build**: Test performance in release mode
   ```bash
   npx react-native run-ios --configuration Release
   npx react-native run-android --variant=release
   ```

2. **Enable Hermes**: For better performance on Android
   ```gradle
   android {
     ...
     hermesEnabled = true
   }
   ```

### SVG Rendering Issues

1. **Check ViewBox**: Icons should maintain aspect ratio
2. **Color Inheritance**: Ensure parent views don't override colors
3. **Transform Issues**: Some transforms may not work as expected on Android

## Next Steps

- Explore the [TypeScript Guide](./typescript-guide.md) for advanced type usage
- Check out [Examples](./examples.md) for more use cases
- Read the [Icon Development Guide](./icon-development.md) to add new icons
- View the [Performance Guide](./performance.md) for optimization tips