const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const OUTPUT_DIR = path.join(__dirname, '../dist/icons');

async function buildIndividualIcons() {
  console.log('Building individual icon modules for tree-shaking...');

  // Clean output directory
  await fs.emptyDir(OUTPUT_DIR);

  // Find all component files
  const componentFiles = await glob('**/*.tsx', { cwd: COMPONENTS_DIR });
  console.log(`Found ${componentFiles.length} component files`);

  // Create individual entry files for each icon
  const entries = {};
  const exports = {
    ".": {
      "types": "./dist/index.d.ts",
      "react-native": "./src/index.native.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./line": {
      "types": "./dist/line-1_5px.d.ts",
      "import": "./dist/line-1_5px.mjs",
      "require": "./dist/line-1_5px.js"
    },
    "./solid": {
      "types": "./dist/solid.d.ts",
      "import": "./dist/solid.mjs",
      "require": "./dist/solid.js"
    }
  };

  for (const file of componentFiles) {
    // Skip index files
    if (file.includes('index.ts') || file.includes('.ts') && !file.includes('.tsx')) {
      continue;
    }

    const filePath = path.join(COMPONENTS_DIR, file);
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Extract component name from file
    const componentMatch = fileContent.match(/export interface (\w+)Props/);
    if (!componentMatch) continue;
    
    const componentName = componentMatch[1];
    const iconName = path.basename(file, '.tsx');
    
    // Determine the variant and path
    const parts = file.split('/');
    let exportPath;
    
    if (parts[0] === 'line' && parts[1]) {
      // Line icon with stroke width
      exportPath = `./icons/${parts[0]}/${parts[1]}/${iconName}`;
    } else {
      // Solid icon or default line
      exportPath = `./icons/${parts[0]}/${iconName}`;
    }

    // Add to exports
    exports[exportPath] = {
      "types": `./dist${exportPath}.d.ts`,
      "import": `./dist${exportPath}.mjs`,
      "require": `./dist${exportPath}.js`,
      "react-native": `./src/components/${file}`
    };
  }

  // Write updated exports to a file for manual integration
  const exportsPath = path.join(__dirname, '../exports.json');
  await fs.writeJSON(exportsPath, exports, { spaces: 2 });
  
  console.log('Individual icon exports generated!');
  console.log('Update package.json exports field with the contents of exports.json');
}

buildIndividualIcons().catch(console.error);