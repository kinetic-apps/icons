const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const { transform } = require('@svgr/core');

const ICONS_DIR = path.join(__dirname, '../icons');
const OUTPUT_DIR = path.join(__dirname, '../src/native');

const svgrConfig = {
  typescript: true,
  prettier: true,
  native: true,
  svgo: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
      'removeXMLNS',
    ],
  },
  template: (variables, { tpl }) => {
    return tpl`
import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

export interface ${variables.componentName}Props extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const ${variables.componentName} = ({ 
  size = 24, 
  color = 'currentColor',
  strokeWidth = 1.5,
  ...props 
}: ${variables.componentName}Props) => (
  ${variables.jsx}
);

${variables.exports};
`;
  },
};

// Simple camelCase function
function toCamelCase(str, pascalCase = false) {
  const result = str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^([A-Z])/, (m) => (pascalCase ? m : m.toLowerCase()));
  return result;
}

async function buildNativeIcons() {
  console.log('Building React Native icons...');

  // Clean output directory
  await fs.emptyDir(OUTPUT_DIR);

  // Find all SVG files
  const svgFiles = await glob('**/*.svg', { cwd: ICONS_DIR });
  console.log(`Found ${svgFiles.length} SVG files`);

  const iconGroups = {};

  for (const file of svgFiles) {
    const filePath = path.join(ICONS_DIR, file);
    const svgContent = await fs.readFile(filePath, 'utf8');
    
    // Parse file path to get icon name and variant
    const parts = file.split('/');
    const variant = parts[0]; // Line or Solid
    const strokeWidth = parts[1]; // 1.5px (only for Line)
    const iconName = path.basename(file, '.svg');
    
    // Generate component name
    const baseName = toCamelCase(iconName, true);
    const componentName = `${baseName}Native`;

    // Transform SVG to React Native component
    const componentCode = await transform(svgContent, svgrConfig, { 
      componentName,
      filePath 
    });

    // Create component file
    const componentDir = variant === 'Line' && strokeWidth
      ? path.join(OUTPUT_DIR, variant.toLowerCase(), strokeWidth.replace('.', '_'))
      : path.join(OUTPUT_DIR, variant.toLowerCase());
    
    await fs.ensureDir(componentDir);
    const componentPath = path.join(componentDir, `${baseName}.tsx`);
    await fs.writeFile(componentPath, componentCode);

    // Track icons for index files
    if (!iconGroups[variant]) {
      iconGroups[variant] = {};
    }
    if (variant === 'Line' && strokeWidth) {
      if (!iconGroups[variant][strokeWidth]) {
        iconGroups[variant][strokeWidth] = [];
      }
      iconGroups[variant][strokeWidth].push({
        name: baseName,
        componentName,
        path: `./${variant.toLowerCase()}/${strokeWidth.replace('.', '_')}/${baseName}`,
      });
    } else {
      if (!iconGroups[variant].default) {
        iconGroups[variant].default = [];
      }
      iconGroups[variant].default.push({
        name: baseName,
        componentName,
        path: `./${variant.toLowerCase()}/${baseName}`,
      });
    }
  }

  // Create index files for React Native
  const nativeIndexContent = `
// Re-export web components for React Native Web compatibility
export * from '../components';

// Native-specific utilities
export { default as Icon } from './Icon';
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'index.ts'), nativeIndexContent.trim());

  // Create Icon wrapper component for React Native
  const iconWrapperContent = `
import * as React from 'react';
import { Platform } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  variant?: 'line' | 'solid';
}

const Icon: React.FC<IconProps> = ({ name, variant = 'line', ...props }) => {
  if (Platform.OS === 'web') {
    // Use web components on React Native Web
    const WebIcon = require(\`../components/\${variant}/\${name}\`).default;
    return <WebIcon {...props} />;
  }
  
  // Use native components on mobile
  const NativeIcon = require(\`./\${variant}/\${name}\`).default;
  return <NativeIcon {...props} />;
};

export default Icon;
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'Icon.tsx'), iconWrapperContent.trim());

  console.log('React Native icons built successfully!');
}

buildNativeIcons().catch(console.error);