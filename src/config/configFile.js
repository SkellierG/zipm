import fs from 'fs'
import path from 'path';
import os from 'os';

class ConfigFile {
  constructor() {
    this.dir = path.join(os.homedir(), '.zipm');
    this.name = 'config.txt'
    this.fullpath = path.join(this.dir, this.name);
  }

  async read() {
      const { data: first, error: readError } = await this._readConfig();
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
      const { data: original, error: readError } = await this._readConfig();
      if (readError) {
        return { data: undefined, error: readError };
      }

      const update = this._updateConfig(original, data);
      const result = this._configToString(update);
      return this._writeConfig(result);
  }

  async _readConfig() {
    try {
      const data = await fs.promises.readFile(this.fullpath, 'utf8');
      return { data: this._parseConfig(data), error: undefined };
    } catch (err) {
      return { data: undefined, error: err };
    }
  }

  _parseConfig(data) {
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

  _updateConfig(original, update) {
    return original.map(entry => {
      if (entry.type === 'entry' && update.hasOwnProperty(entry.key)) {
        return { ...entry, value: update[entry.key] };
      }
      return entry;
    })
  }

  _configToString(updated) {
    return updated.map(entry => {
      if (entry.type === 'comment' || entry.type === 'other') {
        return entry.value;
      } else if (entry.type === 'entry') {
        return `${entry.key.toString().toUpperCase()}=${entry.value.toString()}`;
      }
      return '';
    }).join('\n');
  }

  _writeConfig(data) {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.promises.mkdir(this.dir)
      }
      fs.promises.writeFile(this.fullpath, data,'utf8')
      return { data: data, error: undefined }
    } catch(err) {
      console.log('cannot write config file', err);
      return { data: undefined, error: err }
    }
  }
}

const configFile = new ConfigFile;

export default configFile;

export const read = ()=>configFile.read();
export const write = (data)=>configFile.write(data);
export const _hardWrite = (data)=>configFile._writeConfig(data);
