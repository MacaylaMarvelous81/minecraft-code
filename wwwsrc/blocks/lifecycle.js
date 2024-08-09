import * as Blockly from 'blockly';

export const lifecycleBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'lifecycle_run',
        message0: 'on run',
        message1: '%1',
        args1: [
            {
                type: 'input_statement',
                name: 'DO'
            }
        ],
        colour: 60,
        tooltip: 'Runs when when this workspace begins running.'
    }
]);