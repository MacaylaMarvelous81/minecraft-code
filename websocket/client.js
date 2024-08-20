import crypto from 'node:crypto';
import { buildCommandRequest, buildSubscription } from './requests.js';
import aesjs from 'aes-js';

// From mcpews (MIT license) (https://github.com/mcpews/mcpews) Thanks!!
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
    #cipher;
    #decipher;
    #exchangeLock = Promise.resolve();

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
        let closeLock = () => {};
        this.#exchangeLock = new Promise((resolve) => closeLock = resolve);

        const encodedKey = Buffer.concat([ asn1Header, this.#ecdh.getPublicKey() ]).toString('base64');
        const encodedSalt = this.#salt.toString('base64');
        const body = await this.execute(`enableencryption "${ encodedKey }" "${ encodedSalt }"`);

        const playerKey = Buffer.from(body.publicKey, 'base64').subarray(asn1Header.length);

        const sharedSecret = this.#ecdh.computeSecret(playerKey);
        this.#secretKey = crypto.hash('sha256', Buffer.concat([ this.#salt, sharedSecret ]), 'buffer');

        const encryptIV = Buffer.copyBytesFrom(this.#secretKey, 0, 16);
        const decryptIV = Buffer.copyBytesFrom(this.#secretKey, 0, 16);

        this.#cipher = new aesjs.ModeOfOperation.cfb(this.#secretKey, encryptIV, 1);
        this.#decipher = new aesjs.ModeOfOperation.cfb(this.#secretKey, decryptIV, 1);

        closeLock();
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
            const messageBytes = aesjs.utils.utf8.toBytes(message);

            const encryptedMessage = this.#cipher.encrypt(messageBytes);

            this.#ws.send(encryptedMessage);
        } else {
            this.#ws.send(message);
        }
    }

    async #handleMessage(message) {
        let data;

        try {
            data = JSON.parse(message);
        } catch (err) {
            if (err instanceof SyntaxError) {
                // This may be an encrypted message!
                if (!this.#decipher) await this.#exchangeLock;

                // This should just throw if it isn't able to be decrypted, since it won't be valid JSON.
                data = JSON.parse(aesjs.utils.utf8.fromBytes(this.#decipher.decrypt(message)));
            } else {
                // If it's not a SyntaxError then it's not from JSON.parse and IDK what it is.
                throw err;
            }
        }

        if (data?.header?.messagePurpose === 'commandResponse' && data?.header?.requestId in this.#commandRequests) {
            this.#commandRequests[data?.header?.requestId](data?.body);

            delete this.#commandRequests[data?.header?.requestId];
        } else if (data?.header?.messagePurpose === 'event') {
            this.#gameEventHandlers.forEach((handler) => handler(data?.header?.eventName), data?.body);
        }
    }
}