const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'eval-source-map',
    output: {
        filename: 'bundle-[contenthash:6].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true 
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './assets/index.html',  
            filename: 'index.html',  
        }),
        // Chỉ sử dụng các plugin này khi môi trường là production
        ...(process.env.NODE_ENV === 'production' ? [
            new CopyPlugin({
                patterns: [
                    { from: 'assets/atlas', to: './atlas' },
                    { from: 'assets/sounds', to: './sounds' },
                    { from: 'assets/css', to: './css' },
                ],
            }),
            new WebpackObfuscator({
                optionsPreset: 'low-obfuscation',
                identifierNamesGenerator: 'mangled-shuffled',
                debugProtection: true,
                debugProtectionInterval: 0,
                ignoreImports: true,
                simplify: true,
                log: false,
            })
        ] : [])
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'assets'),  
        },   
    },
};
console.log('NODE_ENV:', process.env.NODE_ENV);