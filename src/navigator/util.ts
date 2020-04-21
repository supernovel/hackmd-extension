interface FindElementOptions {
    selector: string;
    container?: Element;
    interval?: number;
    limit?: number;
}

export function findElement(options: FindElementOptions): Promise<Element> {
    return new Promise((resolve, reject) => {
        let count = 1;
        const limit = options.limit || 10;
        const interval = options.interval || 1000;
        const container = options.container || document;
        const findElementUsingTimer = () => {
            const finded = container.querySelector(options.selector);

            if (finded) {
                resolve(finded);
            } else if (count > limit) {
                reject(Error('Not found.'));
            } else {
                count++;
                setTimeout(findElementUsingTimer, interval);
            }
        };
        findElementUsingTimer();
    });
}

export function findElements(
    options: FindElementOptions
): Promise<Array<Element>> {
    return new Promise((resolve, reject) => {
        let count = 1;
        const limit = options.limit || 10;
        const interval = options.interval || 1000;
        const container = options.container || document;
        const findElementsUsingTimer = () => {
            const finded = container.querySelectorAll(options.selector);

            if (finded && finded.length) {
                resolve([...finded]);
            } else if (count > limit) {
                reject(Error('Not found.'));
            } else {
                count++;
                setTimeout(findElementsUsingTimer, interval);
            }
        };
        findElementsUsingTimer();
    });
}
