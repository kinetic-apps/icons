# Examples - @kineticapps/icons

This guide provides practical examples of using @kineticapps/icons in various scenarios.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Navigation Examples](#navigation-examples)
- [Form Examples](#form-examples)
- [Animation Examples](#animation-examples)
- [State Management](#state-management)
- [Accessibility](#accessibility)
- [Real World Components](#real-world-components)

## Basic Examples

### Icon Button

```jsx
// React
import { Icon } from '@kineticapps/icons';

function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="icon-button"
    >
      <Icon name={icon} size={20} />
    </button>
  );
}

// React Native
import { TouchableOpacity } from 'react-native';
import { Icon } from '@kineticapps/icons';

function IconButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={label}
      style={styles.iconButton}
    >
      <Icon name={icon} size={20} />
    </TouchableOpacity>
  );
}
```

### Icon with Text

```jsx
// React
function IconLabel({ icon, text, color = '#333' }) {
  return (
    <div className="icon-label">
      <Icon name={icon} size={16} color={color} />
      <span style={{ marginLeft: 8, color }}>{text}</span>
    </div>
  );
}

// React Native
function IconLabel({ icon, text, color = '#333' }) {
  return (
    <View style={styles.iconLabel}>
      <Icon name={icon} size={16} color={color} />
      <Text style={[styles.labelText, { color }]}>{text}</Text>
    </View>
  );
}
```

## Navigation Examples

### Tab Bar Navigation

```jsx
// React with React Router
import { NavLink } from 'react-router-dom';
import { Icon } from '@kineticapps/icons';

const tabs = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/search', icon: 'search', label: 'Search' },
  { path: '/profile', icon: 'user', label: 'Profile' },
];

function TabBar() {
  return (
    <nav className="tab-bar">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <Icon
                name={tab.icon}
                variant={isActive ? 'solid' : 'line'}
                size={24}
              />
              <span>{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
```

```jsx
// React Native with React Navigation
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
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### Breadcrumb Navigation

```jsx
// React
import { Icon } from '@kineticapps/icons';

function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => (
          <li key={item.href} className="breadcrumb-item">
            {index > 0 && (
              <Icon 
                name="chevronRight" 
                size={16} 
                className="breadcrumb-separator"
              />
            )}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

## Form Examples

### Input with Icon

```jsx
// React
function SearchInput({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="search-form">
      <Icon name="search" size={20} className="search-icon" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search..."
        className="search-input"
      />
      <button type="submit" className="search-button">
        <Icon name="arrowRight" size={16} />
      </button>
    </form>
  );
}

// React Native
function SearchInput({ value, onChangeText, onSubmit }) {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search" size={20} color="#666" />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search..."
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity onPress={onSubmit}>
        <Icon name="arrowRight" size={16} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}
```

### Form Validation States

```jsx
// React
function FormField({ label, value, onChange, error, success }) {
  const getIcon = () => {
    if (error) return { name: 'xCircle', color: '#EF4444' };
    if (success) return { name: 'checkCircle', color: '#10B981' };
    return null;
  };

  const icon = getIcon();

  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="input-wrapper">
        <input
          value={value}
          onChange={onChange}
          className={`input ${error ? 'error' : ''} ${success ? 'success' : ''}`}
        />
        {icon && (
          <Icon 
            name={icon.name} 
            size={20} 
            color={icon.color}
            variant="solid"
          />
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
```

### Password Input Toggle

```jsx
// React
function PasswordInput({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder="Enter password"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        <Icon 
          name={showPassword ? 'eyeOff' : 'eye'} 
          size={20}
        />
      </button>
    </div>
  );
}
```

## Animation Examples

### Animated Like Button

```jsx
// React with CSS
function LikeButton({ initialLiked = false, onLike }) {
  const [liked, setLiked] = useState(initialLiked);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setLiked(!liked);
    setAnimating(true);
    onLike(!liked);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`like-button ${animating ? 'animating' : ''}`}
    >
      <Icon
        name="heart"
        variant={liked ? 'solid' : 'line'}
        size={24}
        color={liked ? '#FF0000' : '#666'}
      />
    </button>
  );
}

// CSS
.like-button.animating svg {
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

```jsx
// React Native with Reanimated
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

function LikeButton({ initialLiked = false, onLike }) {
  const [liked, setLiked] = useState(initialLiked);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    setLiked(!liked);
    onLike(!liked);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Icon
          name="heart"
          variant={liked ? 'solid' : 'line'}
          size={24}
          color={liked ? '#FF0000' : '#666'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
```

### Loading Spinner

```jsx
// React
function LoadingSpinner({ size = 24, color = '#007AFF' }) {
  return (
    <div className="loading-spinner">
      <Icon name="loader" size={size} color={color} />
    </div>
  );
}

// CSS
.loading-spinner svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## State Management

### Icon State with Redux

```jsx
// Redux slice
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    theme: 'light',
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

// Component
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@kineticapps/icons';

function SidebarToggle() {
  const collapsed = useSelector(state => state.ui.sidebarCollapsed);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(toggleSidebar())}>
      <Icon 
        name={collapsed ? 'menuUnfold' : 'menuFold'}
        size={20}
      />
    </button>
  );
}
```

### Icon Theme Context

```jsx
// Theme context
import { createContext, useContext } from 'react';

const IconThemeContext = createContext({
  defaultSize: 24,
  defaultColor: 'currentColor',
  defaultVariant: 'line',
});

export function IconThemeProvider({ children, theme }) {
  return (
    <IconThemeContext.Provider value={theme}>
      {children}
    </IconThemeContext.Provider>
  );
}

// Themed Icon component
function ThemedIcon({ name, size, color, variant, ...props }) {
  const theme = useContext(IconThemeContext);
  
  return (
    <Icon
      name={name}
      size={size || theme.defaultSize}
      color={color || theme.defaultColor}
      variant={variant || theme.defaultVariant}
      {...props}
    />
  );
}
```

## Accessibility

### Accessible Icon Button

```jsx
// React
function AccessibleIconButton({ 
  icon, 
  label, 
  onClick,
  disabled = false,
  loading = false 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={label}
      aria-busy={loading}
      className="accessible-icon-button"
    >
      {loading ? (
        <Icon name="loader" size={20} className="spinning" />
      ) : (
        <Icon name={icon} size={20} />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
```

### Icon with Tooltip

```jsx
// React with Radix UI
import * as Tooltip from '@radix-ui/react-tooltip';
import { Icon } from '@kineticapps/icons';

function IconWithTooltip({ icon, tooltip, ...props }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="icon-tooltip-trigger">
            <Icon name={icon} {...props} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="tooltip-content">
            {tooltip}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
```

## Real World Components

### Notification Badge

```jsx
// React
function NotificationBadge({ count = 0 }) {
  return (
    <div className="notification-badge">
      <Icon name="bell" size={24} />
      {count > 0 && (
        <span className="badge">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}

// CSS
.notification-badge {
  position: relative;
  display: inline-block;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #FF0000;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}
```

### File Upload

```jsx
// React
function FileUpload({ onFileSelect }) {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files);
    }
  };
  
  return (
    <div
      className={`file-upload ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Icon name="upload" size={48} color="#666" />
      <p>Drag and drop files here or click to browse</p>
      <input
        type="file"
        onChange={(e) => onFileSelect(e.target.files)}
        multiple
      />
    </div>
  );
}
```

### Social Share

```jsx
// React
const socialPlatforms = [
  { name: 'facebook', icon: 'facebook', color: '#1877F2' },
  { name: 'twitter', icon: 'twitter', color: '#1DA1F2' },
  { name: 'linkedin', icon: 'linkedin', color: '#0A66C2' },
  { name: 'mail', icon: 'mail', color: '#EA4335' },
];

function SocialShare({ url, title }) {
  const shareUrls = {
    facebook: `https://facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    linkedin: `https://linkedin.com/sharing/share-offsite/?url=${url}`,
    mail: `mailto:?subject=${title}&body=${url}`,
  };
  
  return (
    <div className="social-share">
      <span>Share:</span>
      {socialPlatforms.map(platform => (
        <a
          key={platform.name}
          href={shareUrls[platform.name]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
        >
          <Icon
            name={platform.icon}
            size={20}
            color={platform.color}
          />
        </a>
      ))}
    </div>
  );
}
```

### Rating Component

```jsx
// React
function Rating({ value, onChange, max = 5 }) {
  const [hoverValue, setHoverValue] = useState(null);
  
  return (
    <div className="rating">
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        const filled = ratingValue <= (hoverValue || value);
        
        return (
          <button
            key={index}
            onClick={() => onChange(ratingValue)}
            onMouseEnter={() => setHoverValue(ratingValue)}
            onMouseLeave={() => setHoverValue(null)}
            aria-label={`Rate ${ratingValue} out of ${max}`}
          >
            <Icon
              name="star"
              variant={filled ? 'solid' : 'line'}
              size={24}
              color={filled ? '#FFD700' : '#E5E7EB'}
            />
          </button>
        );
      })}
    </div>
  );
}
```

## Next Steps

- Explore the [React Guide](./react-guide.md) for platform-specific patterns
- Check the [React Native Guide](./react-native-guide.md) for mobile examples
- Review the [TypeScript Guide](./typescript-guide.md) for type-safe examples
- Read the [Contributing Guide](./contributing.md) to add new examples