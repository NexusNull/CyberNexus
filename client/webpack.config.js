const path = require('path');

module.exports = {
    mode: "development",
    entry: './client/client-src/game.ts',
    //devtool: 'inline-source-map',
    optimization: {
        minimize: false
    },
    watch: true,
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    externals: {
        "socket.io-client": 'io',
        "three": "THREE",
        "Perlin": "perlin",
    },
    resolve: {
        extensions: ['.ts', ".js"],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
};