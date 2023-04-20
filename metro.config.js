// Learn more https://docs.expo.io/guides/customizing-metro
// eslint-disable-next-line import/no-extraneous-dependencies
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;
