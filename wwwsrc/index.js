import vex from 'vex-js';
import vexDialog from 'vex-dialog';
import * as Blockly from 'blockly';
import { mathBlocks } from './blocks/math.js';
import { lifecycleBlocks } from './blocks/lifecycle.js';
import { agentBlocks } from './blocks/agent.js';
import { playerBlocks } from './blocks/player.js';
import { javascriptGenerator } from 'blockly/javascript';
import { javascriptBlocks } from './generators/javascript.js';
import { toolbox } from './toolbox.js';
import Sval from 'sval';
import { agent } from './api/agent.js';
import { player } from './api/player.js';
import './index.css';
import 'vex-js/dist/css/vex.css';
import 'vex-js/dist/css/vex-theme-default.css';

vex.registerPlugin(vexDialog);
vex.defaultOptions.className = 'vex-theme-default';

Blockly.dialog.setAlert(vex.dialog.alert);
Blockly.dialog.setConfirm((message, callback) => {
    vex.dialog.confirm({
        message,
        callback: (result) => callback(result)
    });
});
Blockly.dialog.setPrompt((message, defaultValue, callback) => {
    vex.dialog.prompt({
        message,
        placeholder: defaultValue,
        callback: (result) => callback(result)
    });
});

Blockly.common.defineBlocks(mathBlocks);
Blockly.common.defineBlocks(lifecycleBlocks);
Blockly.common.defineBlocks(agentBlocks);
Blockly.common.defineBlocks(playerBlocks);
Object.assign(javascriptGenerator.forBlock, javascriptBlocks);

const blocklyContainer = document.getElementById('blockly');
const workspace = Blockly.inject(blocklyContainer, { toolbox });

workspace.addChangeListener(Blockly.Events.disableOrphans);

const runButton = document.getElementById('run-button');
runButton.addEventListener('click', () => {
    if (workspace.isDragging()) return;

    const genCode = javascriptGenerator.workspaceToCode(workspace);
    // Imports are required in 'module' type.
    // Maybe only import modules used by the user?
    const code = `\
import { agent } from 'agent';
import { player } from 'player';

${ genCode }\
`;
    console.log("Code to interpret:", code);

    // Top-level await works in the module type.
    const interpreter = new Sval({ sourceType: 'module' });

    interpreter.import('agent', { agent });
    interpreter.import('player', { player });

    interpreter.run(code);
});