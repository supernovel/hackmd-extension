import { browser } from 'webextension-polyfill-ts';
import { name as packageName } from '../../package.json';

(() => {
    browser.runtime.onConnect.addListener(port => {
        if (port.name != packageName || port.sender == null) {
            return;
        }

        const title = (port.sender.tab || { title: port.sender.id }).title;

        console.debug(`connected ${title}.`);

        port.onMessage.addListener((message, port) => {
            console.debug(`received message from ${title}: ${message.text} `);
        });

        port.postMessage({
            text: 'hello content scripts.'
        });
    });
})();
