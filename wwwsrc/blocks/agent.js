import * as Blockly from 'blockly';

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