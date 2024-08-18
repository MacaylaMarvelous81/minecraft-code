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
        this.#send(JSON.stringify(buildSubscription(eventName, crypto.randomUUID())));
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
    }

    execute(command) {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID();

            this.#commandRequests[id] = (result) => resolve(result);

            this.#send(JSON.stringify(buildCommandRequest(command, id)));
        });
    }

    #send(data) {
        if (this.#secretKey) {
            const cipher = crypto.createCipheriv('aes-256-cbc', this.#secretKey.slice(0, 32), this.#secretKey.slice(0, 16));
            let message = cipher.update(data, 'utf8', 'hex');
            message += cipher.final('hex');

            this.#ws.send(message, { binary: true });

            console.log('a', message);
        } else {
            this.#ws.send(data);

            console.log('b', data);
        }
    }

    #handleMessage(message) {
        try {
            let decryptedMessage = message;

            if (this.#secretKey) {
                const decipher = crypto.createDecipheriv('aes-256-cbc', this.#secretKey.slice(0, 32), this.#secretKey.slice(0, 16));
                decryptedMessage = decipher.update(message, 'hex', 'utf8');
                decryptedMessage += decipher.final('utf8');
                console.log("decrypted message", decryptedMessage);
            }

            const data = JSON.parse(decryptedMessage);

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