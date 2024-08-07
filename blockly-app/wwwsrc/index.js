import * as Blockly from 'blockly';
import { agentBlocks } from './blocks/agent';
import { javascriptGenerator } from 'blockly/javascript';
import { javascriptBlocks } from './generators/javascript';
import { toolbox } from './toolbox';
import Interpreter from 'js-interpreter';
import './index.css';

Blockly.common.defineBlocks(agentBlocks);
Object.assign(javascriptGenerator.forBlock, javascriptBlocks);

const blocklyContainer = document.getElementById('blockly');
const workspace = Blockly.inject(blocklyContainer, { toolbox });

const runButton = document.getElementById('run-button');
runButton.addEventListener('click', () => {
    if (workspace.isDragging()) return;

    const code = javascriptGenerator.workspaceToCode(workspace);
    const interpreter = new Interpreter(code);

    console.log(code);

    function step() {
        if (interpreter.step()) window.setTimeout(step, 0);
    }

    step();
});