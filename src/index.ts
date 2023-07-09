import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import {
  createToolbarFactory,
  ICommandPalette,
  IToolbarWidgetRegistry,
} from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

interface IOtterGraderNotebookTransformerOptions {
  tracker: INotebookTracker;
}

class OtterGraderNotebookTransformer {
  private _tracker: INotebookTracker;

  constructor(options: IOtterGraderNotebookTransformerOptions) {
    this._tracker = options.tracker;
  }

  get notebook() {
    return this._tracker.currentWidget?.model?.sharedModel;
  }

  addAssignmentConfigCell() {
    this.notebook?.insertCell(0, {
      cell_type: 'raw',
      source: '# ASSIGNMENT CONFIG\n',
    });
  }

  addQuestion(manual: boolean) {
    const cells = [
      {
        cell_type: 'raw',
        source: `# BEGIN QUESTION\nname: TODO${manual ? '\nmanual: true' : ''}`,
      },
      {
        cell_type: 'markdown',
        source: '**TODO: Your question here.**',
      },
      {
        cell_type: 'raw',
        source: '# BEGIN SOLUTION',
      },
      {
        cell_type: manual ? 'markdown' : 'code',
        source: manual ? '**TODO: Your solution here.**' : '# TODO: Your solution here.',
      },
      {
        cell_type: 'raw',
        source: '# END SOLUTION',
      },
    ];
    if (!manual) {
      cells.push(
        {
          cell_type: 'raw',
          source: '# BEGIN TESTS',
        },
        {
          cell_type: 'code',
          source: '# TODO: Your tests here.',
        },
        {
          cell_type: 'raw',
          source: '# END TESTS',
        },
      );
    }
    cells.push({
      cell_type: 'raw',
      source: '# END QUESTION',
    });
    this.notebook?.insertCells(this.notebook?.cells.length, cells);
  }
}

const Commands = {
  ADD_ASSIGNMENT_CONFIG: 'add-assignment-config-cell',
  ADD_CODE_QUESTION: 'add-code-question',
  ADD_MANUAL_QUESTION: 'add-manual-question',
};

const FACTORY = 'Otter-Grader';

/**
 * Initialization data for the otter-grader-labextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'otter-grader-labextension:plugin',
  description: 'A JupyterLab extension for Otter-Grader.',
  autoStart: true,
  requires: [IToolbarWidgetRegistry, ISettingRegistry, INotebookTracker, ICommandPalette],
  optional: [ITranslator],
  activate: async (
    app: JupyterFrontEnd,
    toolbarRegistry: IToolbarWidgetRegistry,
    settingRegistry: ISettingRegistry,
    tracker: INotebookTracker,
    palette: ICommandPalette,
    translator?: ITranslator,
  ) => {
    const transformer = new OtterGraderNotebookTransformer({ tracker });

    createToolbarFactory(
      toolbarRegistry,
      settingRegistry,
      FACTORY,
      plugin.id,
      translator ?? nullTranslator,
    );

    await settingRegistry.load(plugin.id, true);

    app.commands.addCommand(Commands.ADD_ASSIGNMENT_CONFIG, {
      label: 'Add Assignment Config Cell',
      execute: () => {
        transformer.addAssignmentConfigCell();
      },
    });
    palette.addItem({
      command: Commands.ADD_ASSIGNMENT_CONFIG,
      category: 'otter-grader',
    });

    app.commands.addCommand(Commands.ADD_CODE_QUESTION, {
      label: 'Add Code Question',
      execute: () => {
        transformer.addQuestion(false);
      },
    });
    palette.addItem({
      command: Commands.ADD_CODE_QUESTION,
      category: 'otter-grader',
    });

    app.commands.addCommand(Commands.ADD_MANUAL_QUESTION, {
      label: 'Add Manually-Graded Question',
      execute: () => {
        transformer.addQuestion(true);
      },
    });
    palette.addItem({
      command: Commands.ADD_MANUAL_QUESTION,
      category: 'otter-grader',
    });
  },
};

export default plugin;
