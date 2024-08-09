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
        inputsInline: true,
        style: 'math_blocks',
        output: 'Coordinate',
        tooltip: 'A coordinate in 3D space.'
    },
    {
        type: 'math_coordinate_value',
        message0: 'value of %1 in %2',
        args0: [
            {
                type: 'field_dropdown',
                name: 'AXIS',
                options: [
                    [ 'x', 'X' ],
                    [ 'y', 'Y' ],
                    [ 'z', 'Z' ]
                ]
            },
            {
                type: 'input_value',
                name: 'COORDINATE',
                check: 'Coordinate'
            }
        ],
        style: 'math_blocks',
        output: 'Number',
        tooltip: 'The value of an axis in a coordinate.'
    }
]);