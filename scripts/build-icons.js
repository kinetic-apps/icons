const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const { transform } = require('@svgr/core');

const ICONS_DIR = path.join(__dirname, '../icons');
const OUTPUT_DIR = path.join(__dirname, '../src/components');

// Check if we're building for React Native
const isNative = process.env.BUILD_TARGET === 'native';

const svgrConfig = {
  typescript: true,
  prettier: true,
  native: isNative, // This tells SVGR to use react-native-svg imports
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
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
  replaceAttrValues: {
    '#141412': 'currentColor',
    '#000': 'currentColor',
    '#000000': 'currentColor',
    'black': 'currentColor',
  },
  dimensions: false,
};

// Simple camelCase function
function toCamelCase(str, pascalCase = false) {
  const result = str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^([A-Z])/, (m) => (pascalCase ? m : m.toLowerCase()));
  return result;
}

async function buildIcons() {
  console.log('Building icons...');

  // Clean output directory
  await fs.emptyDir(OUTPUT_DIR);

  // Find all SVG files
  const svgFiles = await glob('**/*.svg', { cwd: ICONS_DIR });
  console.log(`Found ${svgFiles.length} SVG files`);

  const iconGroups = {};
  const allIcons = [];

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
    const componentName = variant === 'Line' && strokeWidth 
      ? `${baseName}${strokeWidth.replace('.', '_').replace('px', '')}` 
      : `${baseName}${variant}`;

    // Transform SVG to React component
    let componentCode = await transform(svgContent, svgrConfig, { 
      componentName,
      filePath 
    });

    // Post-process to add custom props
    // Ensure imports are correct
    if (isNative) {
      // For React Native, ensure we have the right imports
      componentCode = componentCode.replace(
        /import \* as React from "react";(\nimport .* from "react-native-svg";)?/,
        `import * as React from "react";\nimport Svg, { Path, Circle, Rect, G, Line, Polyline, Polygon, Ellipse, Defs, Stop, LinearGradient, RadialGradient, ClipPath, Mask, Pattern, Use, Symbol, Text, TSpan, TextPath, type SvgProps } from "react-native-svg";`
      );
    } else {
      componentCode = componentCode.replace(
        /import \* as React from "react";(\nimport type { SVGProps } from "react";)?/,
        `import * as React from "react";\nimport type { SVGProps } from "react";`
      );
    }
    
    // Replace the function signature
    const propsType = isNative ? 'SvgProps' : 'SVGProps<SVGSVGElement>';
    const searchPattern = isNative 
      ? /const (\w+) = \(props: SvgProps\)/
      : /const (\w+) = \(props: SVGProps<SVGSVGElement>\)/;
    
    componentCode = componentCode.replace(
      searchPattern,
      (match, name) => `export interface ${name}Props extends ${propsType} {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}

const ${name} = ({ size = 24, color = 'currentColor', strokeWidth = 1.5, ...props }: ${name}Props)`
    );
    
    // Add size attributes to SVG/Svg element
    const svgTag = isNative ? 'Svg' : 'svg';
    const svgPattern = new RegExp(`<${svgTag}([^>]*)\\{\\.\\.\\.props\\}>`);
    componentCode = componentCode.replace(
      svgPattern,
      `<${svgTag}$1width={size} height={size} {...props}>`
    );
    
    // Replace color attributes with the color prop
    if (variant === 'Solid') {
      componentCode = componentCode.replace(/fill="currentColor"/g, 'fill={color}');
    } else if (variant === 'Line') {
      // For line icons, replace stroke color
      componentCode = componentCode.replace(/stroke="currentColor"/g, 'stroke={color}');
      componentCode = componentCode.replace(/stroke="#[0-9A-Fa-f]{6}"/g, 'stroke={color}');
      componentCode = componentCode.replace(/stroke="#[0-9A-Fa-f]{3}"/g, 'stroke={color}');
    }

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

    allIcons.push({
      name: baseName,
      componentName,
      variant,
      strokeWidth,
    });
  }

  // Create index files for each variant
  for (const [variant, groups] of Object.entries(iconGroups)) {
    for (const [group, icons] of Object.entries(groups)) {
      const indexPath = group === 'default' 
        ? path.join(OUTPUT_DIR, `${variant.toLowerCase()}.ts`)
        : path.join(OUTPUT_DIR, `${variant.toLowerCase()}-${group.replace('.', '_')}.ts`);
      
      const indexContent = icons
        .map(icon => `export { default as ${icon.componentName} } from '${icon.path}';`)
        .join('\n');
      
      await fs.writeFile(indexPath, indexContent);
    }
  }

  // Create main index file that re-exports line icons as default
  const lineIcons = iconGroups.Line && iconGroups.Line['1.5px'] ? iconGroups.Line['1.5px'] : [];
  const defaultExports = lineIcons.map(icon => 
    `export { ${icon.componentName} as ${icon.name} } from './line-1_5px';`
  ).join('\n');

  const mainIndexContent = `
// Default exports (Line 1.5px icons without suffix)
${defaultExports}

// Line icons with different stroke widths
export * from './line-1_5px';

// Solid icons
export * from './solid';

// Icon metadata
export const iconMetadata = ${JSON.stringify(allIcons, null, 2)};
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'index.ts'), mainIndexContent.trim());

  console.log('Icons built successfully!');
  console.log(`Total icons processed: ${allIcons.length}`);
}

buildIcons().catch(console.error);