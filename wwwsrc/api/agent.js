export const agent = {
    teleport(position) {
        minecraft.runCommand(`agent tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    },
    async getPosition() {
        return await minecraft.runCommandWithResponse('agent getposition');
    },
    move(direction, blocks) {
        for (let i = 0; i < blocks; i++) {
            minecraft.runCommand(`agent move ${ direction }`);
        }
    },
    turn(direction) {
        minecraft.runCommand(`agent turn ${ direction }`);
    },
    attack(direction) {
        minecraft.runCommand(`agent attack ${ direction }`);
    },
    destroy(direction) {
        minecraft.runCommand(`agent destroy ${ direction }`);
    },
    drop(slot, amount, direction) {
        minecraft.runCommand(`agent drop ${ slot } ${ amount } ${ direction }`);
    }
};