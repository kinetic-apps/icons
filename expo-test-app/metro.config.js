const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for resolving modules from the parent directory
const parentDir = path.resolve(__dirname, '..');
config.watchFolders = [parentDir];

// Ensure Metro can resolve modules from both the app and parent directory
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(parentDir, 'node_modules'),
];

// Add support for .ts and .tsx extensions
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;