export const agent = {
    teleport(x, y, z) {
        minecraft.runCommand(`agent tp ${ x || '~' } ${ y || '~' } ${ z || '~' }`);
    },
    get position() {
        return { x: 0, y: 0, z: 0 };
    },
    move(direction, blocks) {
        for (let i = 0; i < blocks; i++) {
            minecraft.runCommand(`agent move ${ direction }`);
        }
    }
};