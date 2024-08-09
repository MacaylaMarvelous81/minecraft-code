import { Order } from 'blockly/javascript';

export const javascriptBlocks = {
    math_coordinate(block, generator) {
        const x = generator.valueToCode(block, 'X', Order.NONE);
        const y = generator.valueToCode(block, 'Y', Order.NONE);
        const z = generator.valueToCode(block, 'Z', Order.NONE);

        // Is Order.NONE right here if I'm using object syntax?
        // Creating an object like this in interpreted space will make a pseudo object. Native functions that return
        // coordinates should turn them pseudo so that all coordinates are consistently pseudo.
        return [ `{ x: ${ x || 'null' }, y: ${ y || 'null' }, z: ${ z || 'null' } }`, Order.NONE ];
    },
    math_coordinate_value(block, generator) {
        const axis = block.getFieldValue('AXIS');
        const coordinate = generator.valueToCode(block, 'COORDINATE', Order.NONE);

        return [ `${ coordinate }.${ axis.toLowerCase() }`, Order.MEMBER ];
    },
    agent_teleport(block, generator) {
        const position = generator.valueToCode(block, 'POSITION', Order.NONE);

        return `agent.teleport(${ position });\n`;
    },
    agent_position(block, generator) {
        return [ 'agent.getPosition()', Order.FUNCTION_CALL ];
    },
    agent_move(block, generator) {
        const direction = block.getFieldValue('DIRECTION');
        const blocks = generator.valueToCode(block, 'BLOCKS', Order.NONE);

        return `agent.move('${ direction }', ${ blocks });\n`;
    },
    player_teleport(block, generator) {
        const position = generator.valueToCode(block, 'POSITION', Order.NONE);

        return `player.teleport(${ position });\n`;
    },
    player_position(block, generator) {
        return [ 'player.getPosition()', Order.FUNCTION_CALL ];
    }
};