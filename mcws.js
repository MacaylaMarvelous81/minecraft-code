export function buildCommandRequest(command, id) {
    return {
        header: {
            version: 1,
            requestId: id,
            messagePurpose: 'commandRequest'
        },
        body: {
            version: 1,
            commandLine: command
        }
    };
}

export function buildSubscription(event, id) {
    return {
        header: {
            version: 1,
            requestId: id,
            messagePurpose: 'subscribe'
        },
        body: {
            eventName: event
        }
    }
}