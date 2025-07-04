import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the website's icon data
const websiteDataPath = path.join(__dirname, '../../kinetic-icons-website/icons-files.js');
const websiteData = fs.readFileSync(websiteDataPath, 'utf8');

// Extract the icon data
const match = websiteData.match(/window\.KINETIC_ICONS_FILES = (\[[\s\S]*?\]);/);
if (!match) {
  throw new Error('Could not find icon data in website file');
}

const iconData = JSON.parse(match[1]);

// Extract unique component names
const componentNames = iconData.map(icon => icon.componentName);

// Generate the TypeScript file
const tsContent = `// Auto-generated from website icon data
// This list should match what the website displays
export const iconNames = [
${componentNames.map(name => `  "${name}"`).join(',\n')}
];
`;

// Write the new iconList.ts file
const outputPath = path.join(__dirname, 'iconList.ts');
fs.writeFileSync(outputPath, tsContent);

console.log(`Generated iconList.ts with ${componentNames.length} icons`);
console.log('Sample icons:', componentNames.slice(0, 10)); 