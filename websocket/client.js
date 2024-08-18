import crypto from 'node:crypto';
import { buildCommandRequest, buildSubscription } from './requests.js';

const asn1Header = Buffer.from("3076301006072a8648ce3d020106052b81040022036200", "hex");

export class Client {
    static clients = [];

    #ws;
    #ecdh;
    #publicKey;
    #salt;
    #commandRequests = {};
    #gameEventHandlers = [];
    #cipher;
    #decipher;

    constructor(ws) {
        this.#ws = ws;
        this.#ecdh = crypto.createECDH('secp384r1');
        this.#publicKey = this.#ecdh.generateKeys();
        this.#salt = crypto.randomBytes(16);

        ws.on('message', this.#handleMessage.bind(this));

        this.constructor.clients.push(this);
    }

    onGameEvent(callback) {
        this.#gameEventHandlers.push(callback);
    }

    subscribeEvent(eventName) {
        this.#send(JSON.stringify(buildSubscription(eventName, crypto.randomUUID())));
    }

    async enableEncryption() {
        const encodedKey = Buffer.concat([ asn1Header, this.#ecdh.getPublicKey() ]).toString('base64');
        const encodedSalt = this.#salt.toString('base64');
        const body = await this.execute(`enableencryption "${ encodedKey }" "${ encodedSalt }"`);

        const playerKey = Buffer.from(body.publicKey, 'base64').subarray(asn1Header.length);

        const sharedSecret = this.#ecdh.computeSecret(playerKey);
        const secretKey = crypto.hash('sha256', Buffer.concat([ this.#salt, sharedSecret ]), 'buffer');

        this.#cipher = crypto.createCipheriv('aes-256-cfb8', secretKey, secretKey.subarray(0, 16));
        this.#decipher = crypto.createDecipheriv('aes-256-cfb8', secretKey, secretKey.subarray(0, 16));
        this.#cipher.setAutoPadding(false);
        this.#decipher.setAutoPadding(false);
    }

    execute(command) {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID();

            this.#commandRequests[id] = (result) => resolve(result);

            this.#send(JSON.stringify(buildCommandRequest(command, id)));
        });
    }

    #send(message) {
        if (this.#cipher) {
            this.#ws.send(this.#cipher.update(message, 'utf8'));
        } else {
            this.#ws.send(message);
        }
    }

    #handleMessage(message) {
        try {
            let decryptedMessage = message;

            if (this.#decipher) {
                decryptedMessage = this.#decipher.update(message).toString('utf8');
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