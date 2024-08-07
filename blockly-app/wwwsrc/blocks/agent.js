import * as Blockly from 'blockly';

export const agentBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    {
        type: 'agent_create',
        message0: 'create agent',
        colour: 351,
        nextStatement: null,
        previousStatement: null,
        tooltip: 'Create a new Agent at your location in the world.'
    }
]);