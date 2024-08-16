import crypto from 'node:crypto';
import { buildCommandRequest, buildSubscription } from './requests.js';

export class Client {
    static clients = [];

    #ws;
    #serverPrivateKey;
    #commandRequests = {};
    #gameEventHandlers = [];
    #playerKey;
    #sharedSecret;

    constructor(ws, privateKey) {
        this.#ws = ws;
        this.#serverPrivateKey = privateKey;

        ws.on('message', this.#handleMessage.bind(this));

        this.constructor.clients.push(this);
    }

    onGameEvent(callback) {
        this.#gameEventHandlers.push(callback);
    }

    subscribeEvent(eventName) {
        this.#ws.send(JSON.stringify(buildSubscription(eventName, crypto.randomUUID())));
    }

    async enableEncryption(pubkey, salt) {
        const body = await this.execute(`enableencryption "${ encodedKey }" "${ encodedSalt }"`);

        this.#playerKey = crypto.createPublicKey({
            key: Buffer.from(body.publicKey, 'base64'),
            format: 'der',
            type: 'spki'
        });

        const ecdh = crypto.createECDH('P-384');
        ecdh.setPrivateKey(this.#serverPrivateKey);

        this.#sharedSecret = ecdh.computeSecret(this.#playerKey);
    }

    execute(command) {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID();

            this.#commandRequests[id] = (result) => resolve(result);

            this.#ws.send(JSON.stringify(buildCommandRequest(command, id)));
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
            }
        } catch (err) {
            if (err instanceof SyntaxError) console.warn('Ignoring message with invalid syntax.', message);

            console.error('Unknown error occurred handling a message.', err);
        }
    }
}