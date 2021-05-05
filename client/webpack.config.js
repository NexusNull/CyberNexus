const path = require('path');

module.exports = {
    mode: "development",
    entry: './client/client-src/Game.ts',
    //devtool: 'inline-source-map',
    optimization: {
        minimize: true
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
        "codemirror": "CodeMirror",
        "Perlin": "perlin",
        "Browserfs": "browserfs",
    },
    resolve: {
        extensions: ['.ts', ".js"],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
};
