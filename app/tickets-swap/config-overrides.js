const webpack = require("webpack");

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        url: require.resolve("url"),
        zlib: require.resolve("browserify-zlib"),
        vm: require.resolve("vm-browserify"),
        // A suppr : npm install buffer assert util os-browserify
        //buffer: require.resolve("buffer/"),
        //assert: require.resolve("assert/"),
        //util: require.resolve("util/"),
        //os: require.resolve("os-browserify/browser"),
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"],
        }),
    ]);
    config.devtool = false;
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
};
