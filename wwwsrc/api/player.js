export function buildPlayer(interpreter) {
    const player = interpreter.nativeToPseudo({});

    interpreter.setProperty(player, 'teleport', interpreter.createNativeFunction((x, y, z) => {
        minecraft.runCommand(`tp ${ x || '~' } ${ y || '~' } ${ z || '~' }`);
    }));
    interpreter.setProperty(player, 'getPosition', interpreter.createAsyncFunction((axis, callback) => {
        minecraft.runCommandWithResponse('querytarget @s').then((body) => {
            // @s selects a single target, the executor of the command. There should be exactly one entity with details
            // if the command succeeded.
            const playerDetails = JSON.parse(body.details)[0];

            callback(playerDetails.position[axis.toLowerCase()]);
        });
    }));

    return player;
}