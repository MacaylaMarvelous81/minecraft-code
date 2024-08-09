export function buildPlayer(interpreter) {
    const player = interpreter.nativeToPseudo({});

    interpreter.setProperty(player, 'teleport', interpreter.createNativeFunction((pseudoPosition) => {
        const position = interpreter.pseudoToNative(pseudoPosition);
        minecraft.runCommand(`tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    }));
    interpreter.setProperty(player, 'getPosition', interpreter.createAsyncFunction((callback) => {
        minecraft.runCommandWithResponse('querytarget @s').then((body) => {
            // @s selects a single target, the executor of the command. There should be exactly one entity with details
            // if the command succeeded.
            const playerDetails = JSON.parse(body.details)[0];

            callback(interpreter.nativeToPseudo(playerDetails.position));
        });
    }));

    return player;
}