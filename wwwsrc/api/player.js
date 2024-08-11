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
        switch (eventName) {
            case 'die':
                minecraft.onPlayerDied(callback);
                break;
            case 'useItem':
                minecraft.onItemUsed((body) => {
                    // TODO: Store event data
                    callback();
                });
                break;
        }
        if (eventName === 'die') {
            minecraft.onPlayerDied(callback);
        }
    }
};