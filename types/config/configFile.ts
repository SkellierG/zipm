import fs from 'fs';
import path from 'path';
import os from 'os';
import configParser from './configParser.js';

/**
 * Singleton class for managing configuration file operations.
 */
class ConfigFile {
  constructor() {
    this.parser = configParser;
    this.dir = path.join(os.homedir(), '.zipm');
    this.name = 'config.txt';
    this.fullpath = path.join(this.dir, this.name);
  }

  /**
   * Retrieves the singleton instance of ConfigFile.
   * @returns {ConfigFile} The singleton instance.
   */
  static getInstance() {
    if (!ConfigFile.instance) {
      ConfigFile.instance = new ConfigFile();
    }
    return ConfigFile.instance;
  }

  /**
   * Reads and parses the configuration file.
   * @returns {Promise<{ data: { [key: string]: string } | undefined, error: Error | undefined }>}
   * - `data`: Key-value pairs from the configuration file.
   * - `error`: Error object if reading fails.
   */
  async read() {
    try {
      const readData = await fs.promises.readFile(this.fullpath, 'utf8');
      const parsedData = this.parser.stringToParse(readData);
      return { data: this.parser.getEntries(parsedData), error: undefined };
    } catch (err) {
      return { data: undefined, error: err };
    }
  }

  /**
   * Writes data to the configuration file.
   * @param {object} data - Key-value pairs to write.
   * @returns {Promise<{ data: string | undefined, error: Error | undefined }>}
   * - `data`: Updated configuration file as a string.
   * - `error`: Error object if writing fails.
   */
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

  /**
   * Writes data to the file.
   * @param {string} data - Data to write.
   * @returns {Promise<{ data: string | undefined, error: Error | undefined }>}
   * - `data`: Written data if successful.
   * - `error`: Error object if writing fails.
   * @private
   */
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

// Create a singleton instance of ConfigFile
const configFile = ConfigFile.getInstance();

export default configFile;

/**
 * Reads the configuration file.
 * @returns {Promise<{ data: { [key: string]: string } | undefined, error: Error | undefined }>}
 * - `data`: Key-value pairs from the configuration file.
 * - `error`: Error object if reading fails.
 */
export const read = () => configFile.read();

/**
 * Writes data to the configuration file.
 * @param {object} data - Key-value pairs to write.
 * @returns {Promise<{ data: string | undefined, error: Error | undefined }>}
 * - `data`: Updated configuration file as a string.
 * - `error`: Error object if writing fails.
 */
export const write = (data) => configFile.write(data);
