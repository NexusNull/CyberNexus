const path = require('path');

module.exports = {
    mode: "development",
    entry: './client-src/main.ts',
    //devtool: 'inline-source-map',
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
        "three": "THREE"
    },
    resolve: {
        extensions: ['.ts', ".js"],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
};