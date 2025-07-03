import React from 'react';
import { Platform } from 'react-native';

// For React Native, we need to transform the web SVG components into React Native SVG components
export function wrapForNative<T extends React.ComponentType<any>>(WebComponent: T): T {
  if (Platform.OS === 'web') {
    return WebComponent;
  }

  // For native platforms, we need to use a different approach
  // Since our icons are built as web SVGs, we'll need to handle this differently
  const NativeWrapper = (props: any) => {
    console.warn('Icons are not yet compatible with React Native. Please use react-native-web or wait for native support.');
    return null;
  };

  return NativeWrapper as unknown as T;
}