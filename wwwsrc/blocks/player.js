import * as Blockly from 'blockly';

export const playerBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'player_teleport',
        message0: 'teleport player to %1',
        args0: [
            {
                type: 'input_value',
                name: 'POSITION',
                check: 'Coordinate'
            },
        ],
        colour: 210,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Teleport your character to a location in the world.'
    },
    {
        type: 'player_position',
        message0: 'position of player',
        colour: 210,
        output: 'Coordinate',
        tooltip: 'Your position in the world.'
    }
]);