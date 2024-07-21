import fs from 'fs'
import path from 'path';
import os from 'os';
import Init from './initConfigFile.js'

class ConfigFile {
  constructor() {
    this.dir = path.join(os.homedir(), '.zipm');
    this.name = 'config.txt'
    this.fullpath = path.join(this.dir, this.name);
    this.init = ``;
  }

  async read() {
      const { data: first, error: readError } = await this.readConfig();
      if (readError) {
        return { data: undefined, error: readError };
      }
      
      let result = {};
      first.forEach(entry => {
        if (entry.type === 'entry') {
          result[entry.key] = entry.value;
        }
      });
      return { data: result, error: undefined };
  }

  async write(data) {
      const { data: original, error: readError } = await this.readConfig();
      if (readError) {
        return { data: undefined, error: readError };
      }

      const update = this.updateConfig(original, data);
      const result = this.configToString(update);
      return this.writeConfig(result);
  }

  async _init() {
    const { data: Initdata, error: Initerror } = await Init._init();
    if (Initerror) {
      return { data: undefined, error: Initerror }
    }

    this.init = `# this is the default config file
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

    const written = await this.writeConfig(this.init);
    if (written.error) {
      return { data: undefined, error: written.error };
    }
    return { data: {init:Initdata, write:written.data}, error: undefined };
  }

  async readConfig() {
    try {
      const data = await fs.promises.readFile(this.fullpath, 'utf8');
      return { data: this.parseConfig(data), error: undefined };
    } catch (err) {
      return { data: undefined, error: err };
    }
  }

  parseConfig(data) {
    const lines = data.toString().split('\n');
    let result = [];

    lines.forEach(line => {
      if (line.startsWith('#')) {
        result.push({ type: 'comment', value: line });
      } else if (line.trim() === '') {
        result.push({ type: 'space', value: ''});
      } else {
        const [key, value] = line.split('=');
        if (key && value) {
          result.push({ type: 'entry', key: key.toLowerCase().trim(), value: value.trim() });
        }
      }
    });
    
    return result;
  }

  updateConfig(original, update) {
    return original.map(entry => {
      if (entry.type === 'entry' && update.hasOwnProperty(entry.key)) {
        return { ...entry, value: update[entry.key] };
      }
      return entry;
    })
  }

  configToString(updated) {
    return updated.map(entry => {
      if (entry.type === 'comment' || entry.type === 'other') {
        return entry.value;
      } else if (entry.type === 'entry') {
        return `${entry.key.toString().toUpperCase()}=${entry.value.toString()}`;
      }
      return '';
    }).join('\n');
  }

  writeConfig(data) {
    try {
      fs.promises.writeFile(this.fullpath, data,'utf8')
      return { data: data, error: undefined }
    } catch(err) {
      console.log('cannot write config file', err);
      return { data: undefined, error: err }
    }
  }
}

const persona = new ConfigFile;

//console.log(await persona._init());

await persona._init();

// console.log(await persona.read());
// console.log(await persona.write({ os: 'arch' }));
//console.log(persona);
//console.log(await persona.readConfig());
//console.log(persona.dir);

export default new ConfigFile;
