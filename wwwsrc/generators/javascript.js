import { Order } from 'blockly/javascript';

export const javascriptBlocks = {
    math_coordinate(block, generator) {
        const x = generator.valueToCode(block, 'X', Order.NONE);
        const y = generator.valueToCode(block, 'Y', Order.NONE);
        const z = generator.valueToCode(block, 'Z', Order.NONE);

        // Is Order.NONE right here if I'm using object syntax?
        return [ `{ x: ${ x || 'null' }, y: ${ y || 'null' }, z: ${ z || 'null' } }`, Order.NONE ];
    },
    math_coordinate_value(block, generator) {
        const axis = block.getFieldValue('AXIS');
        const coordinate = generator.valueToCode(block, 'COORDINATE', Order.NONE);

        return [ `${ coordinate }.${ axis.toLowerCase() }`, Order.MEMBER ];
    },
    agent_teleport(block, generator) {
        const xValue = generator.valueToCode(block, 'X', Order.NONE);
        const yValue = generator.valueToCode(block, 'Y', Order.NONE);
        const zValue = generator.valueToCode(block, 'Z', Order.NONE);

        const outX = xValue === '' ? 'null' : xValue;
        const outY = yValue === '' ? 'null' : yValue;
        const outZ = zValue === '' ? 'null' : zValue;

        return `agent.teleport(${ outX }, ${ outY }, ${ outZ });\n`;
    },
    agent_position(block, generator) {
        const axis = block.getFieldValue('AXIS');

        return [ `agent.getPosition('${ axis }')`, Order.FUNCTION_CALL ];
    },
    agent_move(block, generator) {
        const direction = block.getFieldValue('DIRECTION');
        const blocks = generator.valueToCode(block, 'BLOCKS', Order.NONE);

        return `agent.move('${ direction }', ${ blocks });\n`;
    },
    player_teleport(block, generator) {
        const xValue = generator.valueToCode(block, 'X', Order.NONE);
        const yValue = generator.valueToCode(block, 'Y', Order.NONE);
        const zValue = generator.valueToCode(block, 'Z', Order.NONE);

        const outX = xValue === '' ? 'null' : xValue;
        const outY = yValue === '' ? 'null' : yValue;
        const outZ = zValue === '' ? 'null' : zValue;

        return `player.teleport(${ outX }, ${ outY }, ${ outZ });\n`;
    },
    player_position(block, generator) {
        const axis = block.getFieldValue('AXIS');

        return [ `player.getPosition('${ axis }')`, Order.FUNCTION_CALL ];
    }
};