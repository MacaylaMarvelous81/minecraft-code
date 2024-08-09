import * as Blockly from 'blockly';

export const mathBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'math_coordinate',
        message0: 'x: %1 y %2 z %3',
        args0: [
            {
                type: 'input_value',
                name: 'X',
                check: 'Number'
            },
            {
                type: 'input_value',
                name: 'Y',
                check: 'Number'
            },
            {
                type: 'input_value',
                name: 'Z',
                check: 'Number'
            }
        ],
        style: 'math_blocks',
        output: 'Coordinate',
        tooltip: 'A coordinate in 3D space.'
    }
]);