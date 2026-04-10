const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('mjs');
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['browser', 'require', 'import'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main', 'module'];

module.exports = withNativeWind(config, { input: "./global.css" });
