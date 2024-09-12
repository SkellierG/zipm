import { write } from './configFile.js';
import Init from './configInitInfo.js';


class ConfigSetup {

  static async setup() {
    const { data: InitData, error: InitError } = await Init.fetchData();
    if (InitError) {
      return { data: undefined, error: InitError };
    }

    const configEntries = [
      { type: 'comment', value: '# this is the default config file' },
      { type: 'comment', value: '# only change it if you know what' },
      { type: 'comment', value: '# you are doing' },
      { type: 'space', value: '' },
      { type: 'comment', value: '# current version of zipm' },
      { type: 'entry', key: 'version', value: InitData.version || 'null' },
      { type: 'space', value: '' },
      { type: 'comment', value: '# operative system' },
      { type: 'entry', key: 'os', value: InitData.os || 'null' },
      { type: 'space', value: '' },
      { type: 'comment', value: '# distro (only if it is linux)' },
      { type: 'entry', key: 'dis_os', value: InitData.dis_os || 'null' },
      { type: 'space', value: '' },
      { type: 'comment', value: '# package manager main command' },
      { type: 'entry', key: 'cmd', value: InitData.cmd || 'null' },
      { type: 'space', value: '' },
      { type: 'comment', value: '# root folder of the zipm package' },
      { type: 'entry', key: 'root', value: InitData.root || 'null' },
      { type: 'space', value: '' },
      { type: 'comment', value: '# name of the dependencies file (.json)' },
      { type: 'entry', key: 'dep_file', value: InitData.dep_file || 'null' },
      { type: 'space', value: '' },
      { type: 'comment', value: '# folder where dependencies file is stored' },
      { type: 'entry', key: 'dep_dir', value: InitData.dep_dir || 'null' }
    ];

    const { data: writtenData, error: writeError } = await write(configEntries);
    if (writeError) {
      return { data: undefined, error: writeError };
    }

    return { data: { InitData, writeData: writtenData }, error: undefined };
  }
}

export default ConfigSetup;

export const setup = () => ConfigSetup.setup();
