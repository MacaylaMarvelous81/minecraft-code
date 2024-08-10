import * as Blockly from 'blockly';

export const playerBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'player_died',
        message0: 'when player dies',
        message1: '%1',
        args1: [
            {
                type: 'input_statement',
                name: 'DO'
            }
        ],
        colour: 210,
        tooltip: 'Runs when you die.'
    },
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
        tooltip: 'Teleport yourself to a location in the world.'
    },
    {
        type: 'player_position',
        message0: 'position of player',
        colour: 210,
        output: 'Coordinate',
        tooltip: 'Your position in the world.'
    }
]);