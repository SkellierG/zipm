import os from 'os';
import DistroHandler from './distroHandler.js';
import CommandHandler from './commandHandler.js';

class ConfigPlatform {

  static distroHandler = DistroHandler;
  static commandHandler = CommandHandler;

  static async getAll() {
    const results = {
      os: this.getOS(),
      dis_os: await this.getDisOS(),
      cmd: await this.getCmd()
    }

    const allSuccessful = Object.values(results).every(result => !result.error);

    return allSuccessful
      ? { data: results, error: undefined }
      : { data: undefined, error: results };
  }

  static getOS() {
    const platform = os.platform();
    return platform
      ? { data: platform, error: undefined }
      : { data: undefined, error: 'OS is undefined' };
  }

  static async getDisOS() {
    const { data: osData, error: osError } = this.getOS();

    if (osError) {
      return { data: undefined, error: osError };
    }
    if (osData == 'linux') {
      return await this.distroHandler.getLinuxDistro();
    }

    return { data: osData, error: undefined}
  }

  static async getCmd() {
    const { data: disData, error: disError } = await this.getDisOS();

    if (disError) {
      return { data: undefined, error: disError };
    }

    return this.commandHandler.getCommandByDistro(disData);

  }
}

export default ConfigPlatform;

export const getOS = () => ConfigPlatform.getOS();
export const getDisOS = () => ConfigPlatform.getDisOS();
export const getCmd = () => ConfigPlatform.getCmd();
export const getAll = () => ConfigPlatform.getAll();
