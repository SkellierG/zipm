import fs from 'fs';
import path from 'path';
import os from 'os';
import configParser from './configParser.js';

class ConfigFile {
  constructor() {
    this.parser = configParser;
    this.dir = path.join(os.homedir(), '.zipm');
    this.name = 'config.txt';
    this.fullpath = path.join(this.dir, this.name);
  }

  static getInstance() {
    if (!ConfigFile.instance) {
      ConfigFile.instance = new ConfigFile();
    }
    return ConfigFile.instance;
  }

  async read() {
    try {
      const readData = await fs.promises.readFile(this.fullpath, 'utf8');
      const parsedData = this.parser.stringToParse(readData);
      return { data: this.parser.getEntries(parsedData), error: undefined };
    } catch (err) {
      return { data: undefined, error: err };
    }
  }

  async write(data) {
    try {
      const configFileExists = fs.existsSync();
      if (!configFileExists) {
        await fs.promises.appendFile(this.fullpath, '')
      }
      const originalData = await fs.promises.readFile(this.fullpath, 'utf8');
      const original = this.parser.stringToParse(originalData);
      const update = this.parser.mergeChanges(original, data);
      const result = this.parser.parseToString(update);
      return this._hardWrite(result);
    } catch (err) {
      return { data: undefined, error: err };
    }
  }

  async _hardWrite(data) {
    try {
      const FILE_EXISTS = fs.existsSync(this.dir);
      if (!FILE_EXISTS) {
        await fs.promises.mkdir(this.dir);
      }
      await fs.promises.writeFile(this.fullpath, data, 'utf8');
      return { data: data, error: undefined };
    } catch (err) {
      console.log('Cannot write config file', err);
      return { data: undefined, error: err };
    }
  }
}

const configFile = ConfigFile.getInstance();

export default configFile;

export const read = () => configFile.read();

export const write = (data) => configFile.write(data);
