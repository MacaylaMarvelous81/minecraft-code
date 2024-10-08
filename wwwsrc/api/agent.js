export const agent = {
    teleport(position) {
        minecraft.runCommand(`agent tp ${ position.x || '~' } ${ position.y || '~' } ${ position.z || '~' }`);
    },
    getPosition() {
        return minecraft.runCommandWithResponse('agent getposition');
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
        if (slot === null) {
            minecraft.runCommand(`agent dropall ${ direction }`);
        } else {
            minecraft.runCommand(`agent drop ${ slot } ${ amount } ${ direction }`);
        }
    },
    build(slot, direction) {
        minecraft.runCommand(`agent place ${ slot } ${ direction }`);
    },
    till(direction) {
        minecraft.runCommand(`agent till ${ direction }`);
    },
    collect(id) {
        minecraft.runCommand(`agent collect ${ id }`);
    },
    transfer(srcSlotNum, quantity, dstSlotNum) {
        minecraft.runCommand(`agent transfer ${ srcSlotNum } ${ quantity } ${ dstSlotNum }`);
    }
};