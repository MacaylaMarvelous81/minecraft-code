export function buildAgent(interpreter) {
    const agent = interpreter.nativeToPseudo({});

    interpreter.setProperty(agent, 'teleport', interpreter.createNativeFunction((pseudoPosition) => {
        const position = interpreter.pseudoToNative(pseudoPosition);
        minecraft.runCommand(`agent tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    }));
    interpreter.setProperty(agent, 'getPosition', interpreter.createAsyncFunction((callback) => {
        minecraft.runCommandWithResponse('agent getposition').then((body) => callback(interpreter.nativeToPseudo(body.position)));
    }));
    interpreter.setProperty(agent, 'move', interpreter.createNativeFunction((direction, blocks) => {
        for (let i = 0; i < blocks; i++) {
            minecraft.runCommand(`agent move ${ direction }`);
        }
    }));
    interpreter.setProperty(agent, 'turn', interpreter.createNativeFunction((direction) => {
        minecraft.runCommand(`agent turn ${ direction }`);
    }));
    interpreter.setProperty(agent, 'attack', interpreter.createNativeFunction((direction) => {
        minecraft.runCommand(`agent attack ${ direction }`);
    }));
    interpreter.setProperty(agent, 'destroy', interpreter.createNativeFunction((direction) => {
        minecraft.runCommand(`agent destroy ${ direction }`);
    }));
    interpreter.setProperty(agent, 'drop', interpreter.createNativeFunction((slot, amount, direction) => {
        minecraft.runCommand(`agent drop ${ slot } ${ amount } ${ direction }`);
    }));

    return agent;
}