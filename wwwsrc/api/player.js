export const player = {
    itemAmountUsed: 0,
    itemId: '',
    message: '',

    teleport(position) {
        return minecraft.runCommand(`tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    },
    async getPosition() {
        const body = await minecraft.runCommand('querytarget @s');
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
                    this.itemAmountUsed = body?.count || 0;
                    this.itemId = `${ body?.item?.namespace }:${ body?.item?.id }`;

                    callback();
                });
                break;
            case 'chat':
                minecraft.onPlayerMessage((body) => {
                    this.message = body.message;

                    callback();
                });
                break;
        }
    }
};