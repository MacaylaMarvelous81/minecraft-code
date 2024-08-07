import * as Blockly from 'blockly';
import { agentBlocks } from './blocks/agent';
import { javascriptGenerator } from 'blockly/javascript';
import { javascriptBlocks } from './generators/javascript';
import { toolbox } from './toolbox';
import './index.css';

Blockly.common.defineBlocks(agentBlocks);
Object.assign(javascriptGenerator.forBlock, javascriptBlocks);

const blocklyContainer = document.getElementById('blockly');
const workspace = Blockly.inject(blocklyContainer, { toolbox });