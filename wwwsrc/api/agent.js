export function buildAgent(interpreter) {
    const agent = interpreter.nativeToPseudo({});

    interpreter.setProperty(agent, 'teleport', interpreter.createNativeFunction((position) => {
        console.log(position);
        minecraft.runCommand(`agent tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    }));
    interpreter.setProperty(agent, 'getPosition', interpreter.createAsyncFunction((callback) => {
        minecraft.runCommandWithResponse('agent getposition').then((body) => callback(body.position));
    }));
    interpreter.setProperty(agent, 'move', interpreter.createNativeFunction((direction, blocks) => {
        for (let i = 0; i < blocks; i++) {
            minecraft.runCommand(`agent move ${ direction }`);
        }
    }));

    return agent;
}