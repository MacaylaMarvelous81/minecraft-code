export const agent = {
    teleport(x, y, z) {
        minecraft.runCommand(`agent tp ${ x || '~' } ${ y || '~' } ${ z || '~' }`);
    },
    async getPosition(axis) {
        const pos = await minecraft.runCommandWithResponse('agent getposition');

        return pos[axis.toLowerCase()] || 0;
    },
    move(direction, blocks) {
        for (let i = 0; i < blocks; i++) {
            minecraft.runCommand(`agent move ${ direction }`);
        }
    }
};