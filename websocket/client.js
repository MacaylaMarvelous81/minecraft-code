import crypto from 'node:crypto';
import {buildCommandRequest, buildSubscription} from './requests.js';

export class Client {
    #ws;
    #commandRequests = {};
    #gameEventHandlers = [];
    #playerKey;

    constructor(ws) {
        this.#ws = ws;

        ws.on('message', this.#handleMessage.bind(this));
    }

    onGameEvent(callback) {
        this.#gameEventHandlers.push(callback);
    }

    subscribeEvent(eventName) {
        this.#ws.send(JSON.stringify(buildSubscription(eventName, crypto.randomUUID())));
    }

    enableEncryption(pubkey, salt) {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID();

            this.#commandRequests[id] = (result) => resolve(result);

            const encodedKey = Buffer.from(pubkey).toString('base64');
            const encodedSalt = salt.toString('base64');

            this.#ws.send(JSON.stringify(buildCommandRequest(`enableencryption "${ encodedKey }" "${ encodedSalt }"`, id)));
        });
    }

    #handleMessage(message) {
        try {
            const data = JSON.parse(message);

            if (data?.header?.messagePurpose === 'commandResponse' && data?.header?.requestId in this.#commandRequests) {
                this.#commandRequests[data?.header?.requestId](data?.body);

                delete this.#commandRequests[data?.header?.requestId];
            } else if (data?.header?.messagePurpose === 'event') {
                this.#gameEventHandlers.forEach((handler) => handler(data?.header?.eventName), data?.body);
            } else if (data?.header?.messagePurpose === 'ws:encrypt') {
                this.#playerKey = crypto.createPublicKey({
                    key: Buffer.from(data?.body?.publicKey, 'base64'),
                    format: 'der',
                    type: 'spki'
                });
            }
        } catch (err) {
            if (err instanceof SyntaxError) console.warn('Ignoring message with invalid syntax.', message);

            console.error('Unknown error occurred handling a message.', err);
        }
    }
}