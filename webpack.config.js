const path = require('path');

module.exports = {
    // Set the mode to 'development' or 'production'
    mode: 'development',

    // Entry point of the application
    entry: './js/scripts.js',

    // Output configuration where bundled files are written
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    // Configuration for the loaders
    module: {
        rules: [
            {
                test: /\.js$/, // Regular expression for JavaScript files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Transpile ES6 to ES5 with babel
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
