import { Order } from 'blockly/javascript';

export const javascriptBlocks = {
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
    }
};