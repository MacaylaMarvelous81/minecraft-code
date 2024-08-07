import { WebSocketServer } from 'ws';
import getPort, { portNumbers } from 'get-port';
import crypto from 'node:crypto';

function generateKeyPromise() {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair('ec', {
            namedCurve: 'P-384'
        }, (err, publicKey, privateKey) => {
            if (err) {
                reject(err);
            } else {
                resolve({ publicKey, privateKey });
            }
        })
    });
}

export async function startServer() {
    const port = await getPort({
        port: portNumbers(49152, 65535)
    });
    const wss = new WebSocketServer({
        port
    });
    console.log(`Server started on port ${ port }`);

    const key = await generateKeyPromise();

    wss.on('connection', (ws) => {
        console.log('connection established');

        ws.on('message', (data) => {
            console.log(`recieved ${ data }`);
        });
    });
}