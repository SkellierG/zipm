import { hardWrite } from './configFile.js';
import Init from './configInitInfo.js';

class ConfigSetup {

  static async setup() {
    const { data: InitData, error: InitError } = await Init.fetchData();
    if (InitError) {
      return { data: undefined, error: InitError };
    }

    const initContent = `# this is the default config file
# only change it if you know what
# you are doing

# current version of zipm
VERSION=${InitData.version || 'null'}

# operative system
OS=${InitData.os || 'null'}

# distro (only if it is linux)
DIS_OS=${InitData.dis_os || 'null'}

# package manager main command
CMD=${InitData.cmd || 'null'}

# root folder of the zipm package
ROOT=${InitData.root || 'null'}

# name of the dependencies file (.json)
DEP_FILE=${InitData.dep_file || 'null'}

# folder where dependencies file is stored
DEP_DIR=${InitData.dep_dir || 'null'}`;

    const { data: writeData, error: writeError } = await hardWrite(initContent);
    if (writeError) {
      return { data: undefined, error: writeError };
    }
    
    return { data: { InitData, writeData }, error: undefined };
  }
}

export default ConfigSetup;

export const setup = () => ConfigSetup.setup();