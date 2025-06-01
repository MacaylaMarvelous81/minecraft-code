export class LifecycleApi {
    entrypoints = [];

    on(eventName, callback) {
        switch (eventName) {
            case 'run':
                this.entrypoints.push(callback);
                break;
        }
    }

    fire(eventName) {
        console.log(eventName);
        switch (eventName) {
            case 'run':
                this.entrypoints.forEach(callback => callback());
                break;
        }
    }
}