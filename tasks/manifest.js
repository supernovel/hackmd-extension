import { promises as fs } from 'fs';
import path from 'path';
import gulp from 'gulp';
import args from './lib/args';
import template from './lib/template';
import applyBrowserPrefixesFor from './lib/applyBrowserPrefixesFor';
import packageJson from '../package.json';
import manifestJson from '../src/manifest.json';

const BASE_PATH = process.cwd();

gulp.task('manifest',  async () => {
    let manifest = JSON.parse(
        template(JSON.stringify(manifestJson), packageJson)
    );

    if (!args.production) {
        manifest['content_security_policy'] =
            "script-src 'self' 'unsafe-eval'; object-src 'self'";
    }

    manifest = applyBrowserPrefixesFor(args.vendor)(manifest);

    return fs.writeFile(
        path.resolve(BASE_PATH, `dist/${args.vendor}/manifest.json`),
        JSON.stringify(manifest, null, args.production ? 0 : 4)
    )
});
