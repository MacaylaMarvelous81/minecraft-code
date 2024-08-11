export const player = {
    teleport(position) {
        minecraft.runCommand(`tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    },
    async getPosition() {
        const body = await minecraft.runCommandWithResponse('querytarget @s');
        const playerDetails = JSON.parse(body.details)[0];

        return playerDetails.position;
    }
};