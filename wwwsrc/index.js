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

if (localStorage.getItem('workspace-default')) {
    try {
        Blockly.serialization.workspaces.load(JSON.parse(localStorage.getItem('workspace-default')), workspace);
    } catch(err) {
        localStorage.removeItem('workspace-default');
        vex.dialog.alert(`Failed to load the saved workspace. The saved data will be deleted. ${ err }`);
    }
}

let dirty = false;

workspace.addChangeListener(Blockly.Events.disableOrphans);
workspace.addChangeListener((event) => {
    if (event.isUiEvent) return;

    localStorage.setItem('workspace-default', JSON.stringify(Blockly.serialization.workspaces.save(workspace)));
    dirty = true;
});

const runButton = document.getElementById('run-button');
async function connectButtonListener() {
    vex.dialog.alert({ unsafeMessage: `To connect, run the \'connect\' command in Minecraft, in the format \'/connect\
    ip address:port\'. The IP address should be that of the machine this program is running on and should be accessible\
    by the machine running Minecraft. For instance, \'localhost\' if it is running on this machine, or its local IP\
    address if it is on the same network. You will need to connect to the server to run your code.<br><br>The server is\
    on the port <strong>${ await wsserver.getPort() }.</strong>` });
}
runButton.addEventListener('click', connectButtonListener);
wsserver.onConnection(() => {
    runButton.textContent = 'Run!';

    runButton.removeEventListener('click', connectButtonListener);
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

        minecraft.resetEventListeners();

        interpreter.run(code);
    });
});

const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', (event) => {
    system.saveFileUser(JSON.stringify(Blockly.serialization.workspaces.save(workspace)));
});