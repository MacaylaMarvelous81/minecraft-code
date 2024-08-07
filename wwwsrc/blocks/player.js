import * as Blockly from 'blockly';

export const playerBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'player_teleport',
        message0: 'teleport player to x %1 y %2 z %3',
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
        colour: 210,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Teleport your character to a location in the world.'
    },
    {
        type: 'player_position',
        message0: '%1 position of player',
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
        colour: 210,
        output: 'Number',
        tooltip: 'Get your position in the world on the specified axis.'
    }
]);