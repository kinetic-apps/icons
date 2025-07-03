const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');

const ICONS_DIR = path.join(__dirname, '../icons');
const SRC_DIR = path.join(__dirname, '../src');

// Create individual icon modules that can be imported separately
async function createIconExports() {
  console.log('Creating individual icon export files...');

  // Find all SVG files
  const svgFiles = await glob('**/*.svg', { cwd: ICONS_DIR });
  console.log(`Found ${svgFiles.length} SVG files`);

  const iconMap = {};

  for (const file of svgFiles) {
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

    // Determine import path
    let importPath;
    if (variant === 'Line' && strokeWidth) {
      importPath = `./components/${variant.toLowerCase()}/${strokeWidth.replace('.', '_')}/${baseName}`;
    } else {
      importPath = `./components/${variant.toLowerCase()}/${baseName}`;
    }

    // Store icon info
    if (!iconMap[baseName]) {
      iconMap[baseName] = {};
    }
    
    const key = variant === 'Line' ? `line${strokeWidth?.replace('.', '_') || ''}` : 'solid';
    iconMap[baseName][key] = {
      componentName,
      importPath
    };
  }

  // Create individual icon files
  for (const [iconName, variants] of Object.entries(iconMap)) {
    // Create a file for each icon that exports all its variants
    let content = `// Auto-generated icon export file\n\n`;
    
    // Import all variants
    for (const [key, info] of Object.entries(variants)) {
      content += `export { default as ${info.componentName} } from '${info.importPath}';\n`;
    }
    
    // If line 1.5px exists, export it as the default variant
    if (variants.line1_5px) {
      content += `\n// Default export (Line 1.5px variant)\n`;
      content += `export { default as ${iconName} } from '${variants.line1_5px.importPath}';\n`;
    }

    // Write the icon file
    const iconFilePath = path.join(SRC_DIR, 'icons', `${iconName}.ts`);
    await fs.ensureDir(path.dirname(iconFilePath));
    await fs.writeFile(iconFilePath, content);
  }

  // Create an index file that lists all available icons
  const indexContent = `// Auto-generated icon index\n\n` +
    Object.keys(iconMap).map(icon => 
      `export * from './icons/${icon}';`
    ).join('\n') + '\n';

  await fs.writeFile(path.join(SRC_DIR, 'icons-index.ts'), indexContent);

  console.log(`Created ${Object.keys(iconMap).length} individual icon export files`);
}

// Simple camelCase function
function toCamelCase(str, pascalCase = false) {
  const result = str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^([A-Z])/, (m) => (pascalCase ? m : m.toLowerCase()));
  return result;
}

createIconExports().catch(console.error);