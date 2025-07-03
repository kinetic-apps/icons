import * as React from 'react';
import * as NativeSvg from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

// Similar to Lucide's approach but adapted for our icons
export type IconNode = [elementName: string, attrs: Record<string, string>][];

export interface KineticIconProps extends SvgProps {
  size?: string | number;
  color?: string;
  strokeWidth?: string | number;
  'data-testid'?: string;
}

export type KineticIcon = React.ForwardRefExoticComponent<KineticIconProps>;

const defaultAttributes = {
  viewBox: '0 0 24 24',
  fill: 'none',
};

const createKineticIcon = (iconName: string, iconNode: IconNode, variant: 'line' | 'solid' = 'line'): KineticIcon => {
  const Component = React.forwardRef<NativeSvg.Svg, KineticIconProps>(
    (
      {
        color = 'currentColor',
        size = 24,
        strokeWidth = 1.5,
        children,
        'data-testid': dataTestId,
        ...rest
      },
      ref,
    ) => {
      // Apply color based on variant
      const customAttrs = variant === 'line' 
        ? {
            stroke: color,
            strokeWidth,
            ...rest,
          }
        : {
            fill: color,
            ...rest,
          };

      return React.createElement(
        NativeSvg.Svg,
        {
          ref,
          ...defaultAttributes,
          width: size,
          height: size,
          testID: dataTestId,
          ...customAttrs,
        } as any,
        [
          ...iconNode.map(([tag, attrs], index) => {
            // Convert tag to proper react-native-svg component name
            const upperCasedTag = (tag.charAt(0).toUpperCase() + tag.slice(1)) as keyof typeof NativeSvg;
            
            // Merge attributes, applying variant-specific color handling
            const elementAttrs = { ...attrs };
            
            if (variant === 'line') {
              // For line icons, ensure stroke color is applied
              if (elementAttrs.stroke && elementAttrs.stroke !== 'none') {
                elementAttrs.stroke = color;
              }
              if (!elementAttrs.strokeWidth && strokeWidth) {
                elementAttrs.strokeWidth = String(strokeWidth);
              }
            } else {
              // For solid icons, ensure fill color is applied
              if (elementAttrs.fill && elementAttrs.fill !== 'none') {
                elementAttrs.fill = color;
              }
            }
            
            return React.createElement(
              NativeSvg[upperCasedTag],
              { key: index, ...elementAttrs } as any,
            );
          }),
          ...((Array.isArray(children) ? children : [children]) || []),
        ],
      );
    },
  );

  Component.displayName = iconName;

  return Component;
};

export default createKineticIcon;