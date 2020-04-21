import path from 'path';
import gulp from 'gulp';
import log from 'fancy-log';
import colors from 'ansi-colors';
import webpack from 'webpack';
import { merge } from 'lodash';

import args from './lib/args';
import webpackConfig from '../webpack.config';

const ENV = args.production ? 'production' : 'development';
const BASE_PATH = process.cwd();

gulp.task('scripts', async function scripts() {
    // Make webpack config
    const config = merge(webpackConfig, {
        devtool: args.sourcemaps ? 'inline-source-map' : false,
        mode: ENV,
        context: path.resolve(BASE_PATH, 'src/'),
        entry: {
            'background': [
                'src/background/background.ts',
                'lib/reload.ts'
            ],
            'content': 'src/content/content.ts',
            'navigator': 'src/navigator/index.ts'
        },
        output: {
            chunkFilename: '[name].js',
            path: path.resolve(BASE_PATH, `dist/${args.vendor}/scripts`)
        }
    });

    if (config.plugins == undefined) {
        config.plugins = [];
    }

    // Set enviroment
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV),
            'process.env.VENDOR': JSON.stringify(args.vendor)
        })
    );

    // Bundling
    return new Promise((resolve, reject) => {
        webpack(config, async (err, stats) => {
            if (err || stats.hasErrors()) {
                reject(err || stats);
            } else {
                log(
                    `Finished '${colors.cyan('scripts')}'`,
                    stats.toString({
                        chunks: false,
                        colors: true,
                        cached: false,
                        children: false
                    })
                );

                resolve(
                    stats.toJson({
                        chunks: true
                    }).entrypoints
                );
            }
        });
    });
});