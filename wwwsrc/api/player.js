export const player = {
    teleport(x, y, z) {
        minecraft.runCommand(`tp ${ x || '~' } ${ y || '~' } ${ z || '~' }`);
    },
    async getPosition(axis) {
        console.log(await minecraft.runCommandWithResponse('querytarget @s'));
        return 0;
    }
};