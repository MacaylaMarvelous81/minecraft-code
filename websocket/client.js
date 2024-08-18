import crypto from 'node:crypto';
import { buildCommandRequest, buildSubscription } from './requests.js';
import ecKeyUtils from 'eckey-utils';

export class Client {
    static clients = [];

    #ws;
    #ecdh;
    #commandRequests = {};
    #gameEventHandlers = [];
    #playerKey;
    #sharedSecret;
    #secretKey;
    #cipher;

    constructor(ws, ecdh) {
        this.#ws = ws;
        this.#ecdh = ecdh;

        ws.on('message', this.#handleMessage.bind(this));

        this.constructor.clients.push(this);
    }

    onGameEvent(callback) {
        this.#gameEventHandlers.push(callback);
    }

    subscribeEvent(eventName) {
        this.#ws.send(JSON.stringify(buildSubscription(eventName, crypto.randomUUID())));
    }

    async enableEncryption(salt) {
        const encodedKey = this.#ecdh.getPublicKey('base64');
        const encodedSalt = salt.toString('base64');
        const body = await this.execute(`enableencryption "${ encodedKey }" "${ encodedSalt }"`);

        const pemKey = crypto.createPublicKey({
            key: Buffer.from(body.publicKey, 'base64'),
            type: 'spki',
            format: 'der'
        }).export({
            type: 'spki',
            format: 'pem'
        });
        this.#playerKey = ecKeyUtils.parsePem(pemKey).publicKey;

        this.#sharedSecret = this.#ecdh.computeSecret(this.#playerKey);
        this.#secretKey = crypto.hash('sha256', Buffer.concat([ salt, this.#sharedSecret ]));
        this.#cipher = crypto.createCipheriv('aes-256-cbc', this.#secretKey, this.#secretKey.slice(0, 16));
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