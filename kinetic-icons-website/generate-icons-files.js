#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function scanIconsDirectory() {
  const iconsDir = './icons';
  const iconData = new Map();

  // Helper function to convert filename to display name
  function toDisplayName(fileName) {
    return fileName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Helper function to convert kebab-case to camelCase for component names
  function toCamelCase(fileName) {
    return fileName
      .split('-')
      .map((word, index) => {
        if (index === 0) {
          return word.toLowerCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  }

  // Helper function to scan a directory for SVG files
  function scanDirectory(dir, variant) {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        if (path.extname(file) === '.svg') {
          const fileName = path.basename(file, '.svg');
          
          if (!iconData.has(fileName)) {
            iconData.set(fileName, {
              fileName: fileName,
              componentName: toCamelCase(fileName),
              displayName: toDisplayName(fileName),
              variants: {}
            });
          }
          
          iconData.get(fileName).variants[variant] = true;
        }
      });
    } catch (error) {
      console.log(`Directory ${dir} not found, skipping...`);
    }
  }

  // Scan all variant directories
  scanDirectory(path.join(iconsDir, 'Line', '1.5px'), 'line');
  scanDirectory(path.join(iconsDir, 'Line', '2px'), 'line2px');
  scanDirectory(path.join(iconsDir, 'Solid'), 'solid');

  // Convert Map to sorted array
  const sortedIcons = Array.from(iconData.values()).sort((a, b) => 
    a.fileName.localeCompare(b.fileName)
  );

  return sortedIcons;
}

function generateIconsFile() {
  console.log('Scanning icons directory...');
  const icons = scanIconsDirectory();
  
  console.log(`Found ${icons.length} unique icons`);
  
  // Count variants
  const lineCount = icons.filter(icon => icon.variants.line).length;
  const line2pxCount = icons.filter(icon => icon.variants.line2px).length;
  const solidCount = icons.filter(icon => icon.variants.solid).length;
  
  console.log(`- Line 1.5px: ${lineCount} icons`);
  console.log(`- Line 2px: ${line2pxCount} icons`);
  console.log(`- Solid: ${solidCount} icons`);

  // Generate the JavaScript file content
  const fileContent = `// Auto-generated from actual SVG files
// Do not edit manually - run generate-icons-files.js to regenerate

window.KINETIC_ICONS_FILES = [
${icons.map(icon => {
  return `  {
    "fileName": "${icon.fileName}",
    "componentName": "${icon.componentName}",
    "displayName": "${icon.displayName}",
    "variants": {
      "line": ${icon.variants.line || false},
      "line2px": ${icon.variants.line2px || false},
      "solid": ${icon.variants.solid || false}
    }
  }`;
}).join(',\n')}
];
`;

  // Write the file
  fs.writeFileSync('./icons-files.js', fileContent);
  console.log('✅ Successfully generated icons-files.js');
  console.log(`📁 File size: ${Math.round(fileContent.length / 1024)}KB`);
}

// Run the generator
generateIconsFile(); 