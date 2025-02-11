module.exports = { 
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-class-properties', {loose: true}]
  ]
}