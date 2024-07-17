import fs from 'fs'
import path from 'path';
import os from 'os';

class ConfigFile {
  constructor() {
    this.dir = path.join(os.homedir(), '.zipm');
    this.name = 'config.txt'
    this.fullpath = path.join(this.dir, this.name);
    this.init = `# this is the default config file
# only change it if you know what
# you are doing

VERSION=0.0.1
OS=LINUX
CMD=DNF
PATH=this/this/this`;

  }

  async read() {
    const first = await this.readConfig()
    let result = {};
    first.forEach(entry => {
       if (entry.type === 'entry') {
        result[entry.key] = entry.value;
      }
    })
    return result;
  }

  async write(data) {
    const original = await this.readConfig();
    const update = this.updateConfig(original, data);
    const result = this.configToString(update);
    return this.writeConfig(result);
  }

  _init() {
    return this.writeConfig(this.init);    
  }

  async readConfig() {
    try {
        const data = await fs.promises.readFile(this.fullpath, 'utf8');
        return this.parseConfig(data);
    } catch (err) {
        console.error('Cannot read config file:', err);
        return {}; // Return an empty object or handle the error as needed
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
      return { status: 'success' }
    } catch(err) {
      console.log('cannot write config file', err);
      return { status: 'failed' }
    }
  }
}

//const persona = new ConfigFile;

//console.log(persona._init());
//console.log(await persona.read());
//console.log(await persona.write({ os: 'arch' }));
//console.log(persona);
//console.log(await persona.readConfig());
//console.log(persona.dir);

export default new ConfigFile;
