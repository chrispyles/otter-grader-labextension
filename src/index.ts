import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the otter-grader-labextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'otter-grader-labextension:plugin',
  description: 'A JupyterLab extension for Otter-Grader.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension otter-grader-labextension is activated!');
  }
};

export default plugin;
