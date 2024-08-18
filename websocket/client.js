import crypto from 'node:crypto';
import { buildCommandRequest, buildSubscription } from './requests.js';
import aesjs from 'aes-js';

const asn1Header = Buffer.from("3076301006072a8648ce3d020106052b81040022036200", "hex");

export class Client {
    static clients = [];

    #ws;
    #ecdh;
    #publicKey;
    #salt;
    #commandRequests = {};
    #gameEventHandlers = [];
    #secretKey;
    #encryptIV;
    #decryptIV;

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
        this.#secretKey = crypto.hash('sha256', Buffer.concat([ this.#salt, sharedSecret ]), 'buffer');

        this.#encryptIV = Buffer.alloc(16);
        this.#decryptIV = Buffer.alloc(16);
        this.#secretKey.copy(this.#encryptIV);
        this.#secretKey.copy(this.#decryptIV);
    }

    execute(command) {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID();

            this.#commandRequests[id] = (result) => resolve(result);

            this.#send(JSON.stringify(buildCommandRequest(command, id)));
        });
    }

    #send(message) {
        if (this.#encryptIV) {
            let messageBytes = aesjs.utils.utf8.toBytes(message);
            if (messageBytes.length % 8 !== 0) {
                const padding = 8 - (messageBytes.length % 8);

                const paddedMessage = new Uint8Array(messageBytes.length + padding);
                paddedMessage.set(messageBytes);
                paddedMessage.fill(0, messageBytes.length, messageBytes.length + padding);

                messageBytes = paddedMessage;
            }

            const cipher = new aesjs.ModeOfOperation.cfb(this.#secretKey, this.#encryptIV, 8);
            const encryptedMessage = cipher.encrypt(messageBytes);

            console.log(aesjs.utils.hex.fromBytes(encryptedMessage));

            this.#ws.send(encryptedMessage);
        } else {
            this.#ws.send(message);
        }
    }

    #handleMessage(message) {
        try {
            let decryptedMessage = message;

            /*
            if (this.#decryptIV) {
                decryptedMessage = this.#decipher.update(message).toString('utf8');
            }
            */

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