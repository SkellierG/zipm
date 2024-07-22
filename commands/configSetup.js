import ConfigFile from './configFile.js';
import Init from './configInit.js';

class ConfigSetup {

  async init() {
    const { data: InitData, error: InitError } = await Init.init();
    if (InitError) {
      return { data: undefined, error: InitError };
    }

    const initContent = `# this is the default config file
# only change it if you know what
# you are doing

# current version of zipm
VERSION=${Init.version}

# operative system
OS=${Init.os}

# distro (only if it is linux)
DIS_OS=${Init.dis_os}

# package manager main command
CMD=${Init.cmd}

# root folder of the zipm package
ROOT=${Init.root}

# name of the dependencies file (.json)
DEP_FILE=${Init.dep_file}

# folder where dependencies file is stored
DEP_DIR=${Init.dep_dir}`;

    const { data: writeData, error: writeError } = await ConfigFile._writeConfig(initContent);
    if (writeError) {
      return { data: undefined, error: writeError };
    }
    
    return { data: { InitData, writeData }, error: undefined };
  }
}

export default new ConfigSetup;