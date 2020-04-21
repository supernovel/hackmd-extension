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
            switch (message) {
                case 'runContentScript':
                    browser.tabs.executeScript({
                        code: `
                            var script = document.createElement("script");
                            script.src = "${browser.extension.getURL(
                                'scripts/navigator.js'
                            )}";
                            document.body.appendChild(script);
                        `
                    });
                    break;
            }

            console.debug(`received message from ${title}: ${message} `);
        });
    });
})();
