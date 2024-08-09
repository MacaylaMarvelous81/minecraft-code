export function buildAgent(interpreter) {
    const agent = interpreter.nativeToPseudo({});

    interpreter.setProperty(agent, 'teleport', interpreter.createNativeFunction((x, y, z) => {
        minecraft.runCommand(`agent tp ${ x || '~' } ${ y || '~' } ${ z || '~' }`);
    }));
    interpreter.setProperty(agent, 'getPosition', interpreter.createAsyncFunction((axis, callback) => {
        minecraft.runCommandWithResponse('agent getposition').then((body) => {
            callback(body.position[axis.toLowerCase()] || 0);
        });
    }));
    interpreter.setProperty(agent, 'move', interpreter.createNativeFunction((direction, blocks) => {
        for (let i = 0; i < blocks; i++) {
            minecraft.runCommand(`agent move ${ direction }`);
        }
    }));

    return agent;
}