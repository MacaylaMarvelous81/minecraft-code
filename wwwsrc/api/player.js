export const player = {
    teleport(position) {
        minecraft.runCommand(`tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    },
    getPosition() {
        const body = minecraft.runCommandWithResponse('querytarget @s');
        const playerDetails = JSON.parse(body.details)[0];

        return playerDetails.position;
    },
    on(eventName, callback) {
        if (eventName === 'die') {
            minecraft.onPlayerDied(callback);
        }
    }
};