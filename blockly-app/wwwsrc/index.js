import * as Blockly from 'blockly';
import { toolbox } from './toolbox';
import './index.css';

const blocklyContainer = document.getElementById('blockly');
const ws = Blockly.inject(blocklyContainer, { toolbox });