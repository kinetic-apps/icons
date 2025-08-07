import * as React from 'react';
import { iconMap, type IconName } from './icon-map';

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
  color = '#141412',
  strokeWidth = 1.5,
  variant = 'auto',
  style,
  ...props
}) => {
  const iconSize = typeof size === 'number' ? size : sizeMap[size];
  
  // Get the appropriate icon
  let iconName = name;
  if (variant === 'solid' && !name.endsWith('Solid')) {
    iconName = `${name}Solid` as IconName;
  }
  
  const IconComponent = iconMap[iconName]?.();
  
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }
  
  // For React Native, react-native-svg-transformer handles the conversion
  // and the SVG components accept these props directly
  return (
    <IconComponent 
      width={iconSize} 
      height={iconSize}
      fill={variant === 'solid' ? color : 'none'}
      stroke={variant === 'line' ? color : 'none'}
      strokeWidth={variant === 'line' ? strokeWidth : 0}
      style={style}
      {...props} 
    />
  );
};