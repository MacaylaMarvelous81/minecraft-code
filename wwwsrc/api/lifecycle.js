export const lifecycle = {
    entrypoints: [],

    on(eventName, callback) {
        switch (eventName) {
            case 'run':
                this.entrypoints.push(callback);
        }
    }
};