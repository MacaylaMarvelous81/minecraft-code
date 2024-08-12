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
    lifecycle_run(block, generator) {
        // Code inserted at top level
        return generator.statementToCode(block, 'DO');
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
    agent_turn(block, generator) {
        const direction = block.getFieldValue('DIRECTION');

        return `agent.turn('${ direction }');\n`;
    },
    agent_attack(block, generator) {
        const direction = block.getFieldValue('DIRECTION');

        return `agent.attack('${ direction }');\n`;
    },
    agent_destroy(block, generator) {
        const direction = block.getFieldValue('DIRECTION');

        return `agent.destroy('${ direction }');\n`;
    },
    agent_drop(block, generator) {
        const amount = generator.valueToCode(block, 'AMOUNT', Order.NONE);
        const slot = generator.valueToCode(block, 'SLOT', Order.NONE);
        const direction = block.getFieldValue('DIRECTION');

        return `agent.drop(${ slot }, ${ amount }, '${ direction }');\n`;
    },
    agent_build(block, generator) {
        const slot = generator.valueToCode(block, 'SLOT', Order.NONE);
        const direction = block.getFieldValue('DIRECTION');

        return `agent.build(${ slot }, '${ direction }');\n`;
    },
    agent_till(block, generator) {
        const direction = block.getFieldValue('DIRECTION');

        return `agent.till('${ direction }');\n`;
    },
    agent_collect(block, generator) {
        return 'agent.collect(\'all\');\n';
    },
    agent_collect_specify(block, generator) {
        const item = generator.valueToCode(block, 'ITEM', Order.NONE);

        return `agent.collect(${ item });\n`;
    },
    player_died(block, generator) {
        const code = generator.statementToCode(block, 'DO');

        return `player.on('die', () => {\n${ code }\n});\n`;
    },
    player_teleport(block, generator) {
        const position = generator.valueToCode(block, 'POSITION', Order.NONE);

        return `player.teleport(${ position });\n`;
    },
    player_position(block, generator) {
        return [ 'player.getPosition()', Order.FUNCTION_CALL ];
    },
    player_used_item(block, generator) {
        const code = generator.statementToCode(block, 'DO');

        return `player.on('useItem', () => {\n${ code }\n});\n`;
    },
    player_used_item_count(block, generator) {
        return [ 'player.itemAmountUsed', Order.MEMBER ];
    },
    player_used_item_id(block, generator) {
        return [ 'player.itemId', Order.MEMBER ];
    },
    player_chat(block, generator) {
        const code = generator.statementToCode(block, 'DO');

        return `player.on('chat', () => {\n${ code }\n});\n`;
    },
    player_chat_message(block, generator) {
        return [ 'player.message', Order.MEMBER ];
    }
};