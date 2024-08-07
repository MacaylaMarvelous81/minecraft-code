import * as Blockly from 'blockly';

export const agentBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'agent_teleport',
        message0: 'teleport agent to x %1 y %2 z %3',
        args0: [
            {
                type: 'input_value',
                name: 'X',
                check: 'Number'
            },
            {
                type: 'input_value',
                name: 'Y',
                check: 'Number',
                align: 'RIGHT'
            },
            {
                type: 'input_value',
                name: 'Z',
                check: 'Number',
                align: 'RIGHT'
            }
        ],
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Teleport your Agent to a location in the world.'
    },
    {
        type: 'agent_position',
        message0: '%1 position of agent',
        args0: [
            {
                type: 'field_dropdown',
                name: 'AXIS',
                options: [
                    [ 'x', 'X' ],
                    [ 'y', 'Y' ],
                    [ 'z', 'Z' ]
                ]
            }
        ],
        colour: 351,
        output: 'Number',
        tooltip: 'Get the position of your Agent in the world on the specified axis.'
    },
    {
        type: 'agent_move',
        message0: 'move agent %1 %2 blocks',
        args0: [
            {
                type: 'field_dropdown',
                name: 'DIRECTION',
                options: [
                    [ 'forward', 'FORWARD' ],
                    [ 'back', 'BACK' ],
                    [ 'left', 'LEFT' ],
                    [ 'right', 'RIGHT' ],
                    [ 'up', 'UP' ],
                    [ 'down', 'DOWN' ]
                ]
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
    }
]);