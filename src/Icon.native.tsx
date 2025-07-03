import * as React from 'react';
import * as Icons from './icons-native';

export type IconName = keyof typeof Icons;

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

const sizeMap: Record<Exclude<IconSize, number>, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
  variant?: 'line' | 'solid' | 'auto';
  style?: any;
  onPress?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  strokeWidth = 1.5,
  variant = 'auto',
  style,
  ...props
}) => {
  const iconSize = typeof size === 'number' ? size : sizeMap[size];
  
  // Get the appropriate icon component
  let IconComponent: any = null;
  
  if (variant === 'solid') {
    // Try to get solid variant
    const solidName = `${name}Solid` as IconName;
    IconComponent = Icons[solidName] || Icons[name];
  } else if (variant === 'line') {
    // Try to get line variant (with 1_5 suffix)
    const lineName = `${name}1_5` as IconName;
    IconComponent = Icons[lineName] || Icons[name];
  } else {
    // Auto: prefer line variant
    const lineName = `${name}1_5` as IconName;
    IconComponent = Icons[lineName] || Icons[name];
  }
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent 
      size={iconSize} 
      color={color} 
      strokeWidth={strokeWidth}
      style={style}
      {...props} 
    />
  );
};

// Export all icon names for TypeScript autocomplete
export const iconNames = Object.keys(Icons).filter(key => key !== 'iconMetadata') as IconName[];