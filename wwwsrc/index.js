import * as Blockly from 'blockly';
import { agentBlocks } from './blocks/agent.js';
import { playerBlocks } from './blocks/player.js';
import { javascriptGenerator } from 'blockly/javascript';
import { javascriptBlocks } from './generators/javascript.js';
import { toolbox } from './toolbox.js';
import Interpreter from 'js-interpreter';
import { agent } from './api/agent.js';
import './index.css';

Blockly.common.defineBlocks(agentBlocks);
Blockly.common.defineBlocks(playerBlocks);
Object.assign(javascriptGenerator.forBlock, javascriptBlocks);

const blocklyContainer = document.getElementById('blockly');
const workspace = Blockly.inject(blocklyContainer, { toolbox });

const runButton = document.getElementById('run-button');
runButton.addEventListener('click', () => {
    if (workspace.isDragging()) return;

    const code = javascriptGenerator.workspaceToCode(workspace);
    console.log("Generated code", code);

    const interpreter = new Interpreter(code, (initInterpreter, globalObject) => {
        initInterpreter.setProperty(globalObject, 'agent', initInterpreter.nativeToPseudo(agent));
    });

    function step() {
        if (interpreter.step()) window.setTimeout(step, 0);
    }

    step();
});