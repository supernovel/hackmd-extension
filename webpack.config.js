import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';

const config = {
    output: {
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vuex?$/,
                loader: 'vue-loader'
            },
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                oneOf: [
                    {
                        resourceQuery: /^\?vue/,
                        use: ['vue-style-loader', 'css-loader', 'sass-loader']
                    },
                    {
                        use: ['style-loader', 'css-loader', 'sass-loader']
                    }
                ]
            },
            {
                test: /\.pug$/,
                oneOf: [
                    // this applies to `<template lang="pug">` in Vue components
                    {
                        resourceQuery: /^\?vue/,
                        use: ['pug-plain-loader']
                    },
                    // this applies to pug imports inside JavaScript
                    {
                        use: ['raw-loader', 'pug-plain-loader']
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.vue', '.vuex'],
        plugins: [new TsconfigPathsPlugin()]
    },
    plugins: [new VueLoaderPlugin()],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: true,
                cache: true,
                parallel: true,
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    extractComments: 'all',
                    compress: {
                        drop_console: true
                    }
                }
            })
        ]
    }
};

export default config;
