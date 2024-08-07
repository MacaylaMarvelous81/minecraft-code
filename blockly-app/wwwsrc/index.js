import * as Blockly from 'blockly';
import { agentBlocks } from './blocks/agent';
import { playerBlocks } from './blocks/player';
import { javascriptGenerator } from 'blockly/javascript';
import { javascriptBlocks } from './generators/javascript';
import { toolbox } from './toolbox';
import Interpreter from 'js-interpreter';
import { agent } from './api/agent';
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
    const interpreter = new Interpreter(code, (initInterpreter, globalObject) => {
        initInterpreter.setProperty(globalObject, 'agent', initInterpreter.nativeToPseudo(agent));
    });

    console.log(code);

    function step() {
        if (interpreter.step()) window.setTimeout(step, 0);
    }

    step();
});