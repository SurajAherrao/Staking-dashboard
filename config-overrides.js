const { override } = require('customize-cra');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");

module.exports = override((config) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        querystring: require.resolve('querystring-es3')
    };
    config.plugins = [
        ...(config.plugins || []),
        new NodePolyfillPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),

    ];

    return config;
});