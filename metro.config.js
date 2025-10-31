const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@/')) {
    const relativePath = moduleName.replace('@/', '');
    const absolutePath = path.resolve(__dirname, relativePath);
    return context.resolveRequest(context, absolutePath, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
