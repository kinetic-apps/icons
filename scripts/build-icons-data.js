const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const { parse } = require('svgson');

const ICONS_DIR = path.join(__dirname, '../icons');
const OUTPUT_DIR = path.join(__dirname, '../src/icon-data');

// Simple camelCase function
function toCamelCase(str, pascalCase = false) {
  const result = str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^([A-Z])/, (m) => (pascalCase ? m : m.toLowerCase()));
  return result;
}

// Convert hyphenated attribute names to camelCase for React Native
function toCamelCaseAttr(key) {
  return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// Convert SVG AST to IconNode format
function convertToIconNode(element, parentAttrs = {}) {
  const nodes = [];
  
  if (element.name && element.name !== 'svg') {
    const attrs = { ...element.attributes };
    
    // Convert hyphenated attributes to camelCase for React Native
    const normalizedAttrs = {};
    Object.keys(attrs).forEach(key => {
      if (attrs[key] !== undefined && attrs[key] !== null) {
        const camelKey = toCamelCaseAttr(key);
        normalizedAttrs[camelKey] = attrs[key];
      }
    });
    
    nodes.push([element.name, normalizedAttrs]);
  }
  
  if (element.children) {
    element.children.forEach(child => {
      nodes.push(...convertToIconNode(child, element.attributes));
    });
  }
  
  return nodes;
}

async function buildIconData() {
  console.log('Building icon data for React Native...');

  // Clean output directory
  await fs.emptyDir(OUTPUT_DIR);

  // Find all SVG files
  const svgFiles = await glob('**/*.svg', { cwd: ICONS_DIR });
  console.log(`Found ${svgFiles.length} SVG files`);

  const iconGroups = {
    line: {},
    solid: {}
  };

  for (const file of svgFiles) {
    const filePath = path.join(ICONS_DIR, file);
    const svgContent = await fs.readFile(filePath, 'utf8');
    
    // Parse file path to get icon name and variant
    const parts = file.split('/');
    const variant = parts[0].toLowerCase(); // Line or Solid
    const iconName = path.basename(file, '.svg');
    
    // Generate component name
    const baseName = toCamelCase(iconName, true);
    
    try {
      // Parse SVG to AST
      const ast = await parse(svgContent);
      
      // Convert to IconNode format
      const iconNode = convertToIconNode(ast);
      
      // Store icon data
      if (!iconGroups[variant]) {
        iconGroups[variant] = {};
      }
      
      iconGroups[variant][baseName] = iconNode;
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  // Generate TypeScript files for each variant
  for (const [variant, icons] of Object.entries(iconGroups)) {
    const variantDir = path.join(OUTPUT_DIR, variant);
    await fs.ensureDir(variantDir);
    
    // Generate individual icon files
    for (const [iconName, iconData] of Object.entries(icons)) {
      const iconContent = `import type { IconNode } from '../../createKineticIcon';

export const ${iconName}: IconNode = ${JSON.stringify(iconData, null, 2)};
`;
      
      await fs.writeFile(
        path.join(variantDir, `${iconName}.ts`),
        iconContent
      );
    }
    
    // Generate index file for variant
    const indexContent = Object.keys(icons)
      .map(iconName => `export { ${iconName} } from './${iconName}';`)
      .join('\n');
    
    await fs.writeFile(
      path.join(variantDir, 'index.ts'),
      indexContent + '\n'
    );
  }

  // Generate main index file
  const mainIndexContent = `// Icon data exports
export * as lineIcons from './line';
export * as solidIcons from './solid';
`;

  await fs.writeFile(path.join(OUTPUT_DIR, 'index.ts'), mainIndexContent);

  // Generate React Native icon components
  const componentsDir = path.join(__dirname, '../src/icons-native');
  await fs.ensureDir(componentsDir);
  
  // Generate icon components
  for (const [variant, icons] of Object.entries(iconGroups)) {
    for (const [iconName, iconData] of Object.entries(icons)) {
      const componentContent = `import createKineticIcon from '../createKineticIcon';
import type { IconNode } from '../createKineticIcon';

const iconNode: IconNode = ${JSON.stringify(iconData, null, 2)};

export default createKineticIcon('${iconName}', iconNode, '${variant}');
`;
      
      const fileName = variant === 'line' ? `${iconName}.tsx` : `${iconName}Solid.tsx`;
      await fs.writeFile(
        path.join(componentsDir, fileName),
        componentContent
      );
    }
  }
  
  // Generate index for components
  const componentFiles = await fs.readdir(componentsDir);
  const componentExports = componentFiles
    .filter(f => f.endsWith('.tsx'))
    .map(f => {
      const name = path.basename(f, '.tsx');
      return `export { default as ${name} } from './${name}';`;
    })
    .join('\n');
    
  await fs.writeFile(
    path.join(componentsDir, 'index.ts'),
    componentExports + '\n'
  );

  console.log('Icon data generated successfully!');
}

buildIconData().catch(console.error);