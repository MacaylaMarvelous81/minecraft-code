import * as Blockly from 'blockly';
import { mathBlocks } from './blocks/math.js';
import { agentBlocks } from './blocks/agent.js';
import { playerBlocks } from './blocks/player.js';
import { javascriptGenerator } from 'blockly/javascript';
import { javascriptBlocks } from './generators/javascript.js';
import { toolbox } from './toolbox.js';
import Interpreter from 'js-interpreter';
import { buildAgent } from './api/agent.js';
import { buildPlayer } from './api/player.js';
import './index.css';

Blockly.common.defineBlocks(mathBlocks);
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
        initInterpreter.setProperty(globalObject, 'agent', buildAgent(initInterpreter));
        initInterpreter.setProperty(globalObject, 'player', buildPlayer(initInterpreter));
    });

    function step() {
        if (interpreter.step()) window.setTimeout(step, 0);
    }

    step();
});