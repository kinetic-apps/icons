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

// Configure react-native-svg-transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// Remove svg from asset extensions and add to source extensions
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg', 'ts', 'tsx'];

module.exports = config;