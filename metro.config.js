// Learn more https://docs.expo.io/guides/customizing-metro
// eslint-disable-next-line import/no-extraneous-dependencies,import/no-import-module-exports
import { getDefaultConfig } from '@expo/metro-config';

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;
