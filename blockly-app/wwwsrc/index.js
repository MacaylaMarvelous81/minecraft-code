import * as Blockly from 'blockly';
import { agentBlocks } from './blocks/agent';
import { toolbox } from './toolbox';
import './index.css';

Blockly.common.defineBlocks(agentBlocks);

const blocklyContainer = document.getElementById('blockly');
const ws = Blockly.inject(blocklyContainer, { toolbox });