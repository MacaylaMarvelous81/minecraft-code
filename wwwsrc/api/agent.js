export const agent = {
    teleport(position) {
        return minecraft.runCommand(`agent tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    },
    async getPosition() {
        return await minecraft.runCommand('agent getposition');
    },
    move(direction, blocks) {
        let commands = [];

        for (let i = 0; i < blocks; i++) {
            commands.push(minecraft.runCommand(`agent move ${ direction }`));
        }

        return Promise.all(commands);
    },
    turn(direction) {
        return minecraft.runCommand(`agent turn ${ direction }`);
    },
    attack(direction) {
        return minecraft.runCommand(`agent attack ${ direction }`);
    },
    destroy(direction) {
        return minecraft.runCommand(`agent destroy ${ direction }`);
    },
    drop(slot, amount, direction) {
        if (slot === null) {
            return minecraft.runCommand(`agent dropall ${ direction }`);
        } else {
            return minecraft.runCommand(`agent drop ${ slot } ${ amount } ${ direction }`);
        }
    },
    build(slot, direction) {
        return minecraft.runCommand(`agent place ${ slot } ${ direction }`);
    },
    till(direction) {
        return minecraft.runCommand(`agent till ${ direction }`);
    },
    collect(id) {
        return minecraft.runCommand(`agent collect ${ id }`);
    },
    transfer(srcSlotNum, quantity, dstSlotNum) {
        return minecraft.runCommand(`agent transfer ${ srcSlotNum } ${ quantity } ${ dstSlotNum }`);
    }
};