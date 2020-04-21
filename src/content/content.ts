import { browser } from 'webextension-polyfill-ts';
import { name as packageName } from '../../package.json';

(() => {
    const port = browser.runtime.connect(undefined, {
        name: packageName
    });

    port.postMessage('runContentScript');
})();
