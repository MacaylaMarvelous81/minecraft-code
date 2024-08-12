import * as Blockly from 'blockly';

const directionOptions = [
    [ 'forward', 'FORWARD' ],
    [ 'back', 'BACK' ],
    [ 'left', 'LEFT' ],
    [ 'right', 'RIGHT' ],
    [ 'up', 'UP' ],
    [ 'down', 'DOWN' ]
];

export const agentBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'agent_teleport',
        message0: 'teleport agent to %1',
        args0: [
            {
                type: 'input_value',
                name: 'POSITION',
                check: 'Coordinate'
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Teleport your Agent to a location in the world.'
    },
    {
        type: 'agent_position',
        message0: 'position of agent',
        colour: 351,
        output: 'Coordinate',
        tooltip: 'The position of your Agent in the world.'
    },
    {
        type: 'agent_move',
        message0: 'move agent %1 %2 blocks',
        args0: [
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: directionOptions
            },
            {
                type: 'input_value',
                name: 'BLOCKS',
                check: 'Number'
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Move your Agent in a direction for a number of blocks.'
    },
    {
        type: 'agent_turn',
        message0: 'turn agent %1',
        args0: [
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: [
                    [ 'left', 'LEFT' ],
                    [ 'right', 'RIGHT']
                ]
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Turn your Agent from the direction it is facing left or right.'
    },
    {
        type: 'agent_attack',
        message0: 'make agent attack %1',
        args0: [
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: directionOptions
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Make your Agent attack in a direction.'
    },
    {
        type: 'agent_destroy',
        message0: 'make agent destroy block %1',
        args0: [
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: directionOptions
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Make your Agent destroy a block in a direction.'
    },
    {
        type: 'agent_drop',
        message0: 'drop %1 items from slot %2 from agent inventory %3',
        args0: [
            {
                type: 'input_value',
                name: 'AMOUNT',
                check: 'Number'
            },
            {
                type: 'input_value',
                name: 'SLOT',
                check: 'Number'
            },
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: directionOptions
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Drop items from the inventory of your Agent in a direction.'
    },
    {
        type: 'agent_build',
        message0: 'place block from slot %1 %2',
        args0: [
            {
                type: 'input_value',
                name: 'SLOT',
                check: 'Number'
            },
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: directionOptions
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Place a block from the inventory of your Agent in a direction.'
    },
    {
        type: 'agent_till',
        message0: 'make agent till grass %1',
        args0: [
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: directionOptions
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Make your Agent till grass in a direction.'
    },
    {
        type: 'agent_collect',
        message0: 'make agent collect items',
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Make your Agent collect all items in its immediate vicinity.'
    },
    {
        type: 'agent_collect_specify',
        message0: 'make agent collect %1',
        args0: [
            {
                type: 'input_value',
                name: 'ITEM',
                check: 'String'
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Make your Agent collect all items with the specified id in its immediate vicinity.'
    }
]);