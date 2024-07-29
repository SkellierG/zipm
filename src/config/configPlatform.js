import os from 'os';
import { $ } from 'execa';

class ConfigPlatform {

  static async getOS() {
    const platform = os.platform();
    return platform
      ? { data: platform, error: undefined }
      : { data: undefined, error: 'OS is undefined' };
  }

  static async getDisOS() {
    const distro = await this._getDistribution();
    return distro.error
      ? { data: undefined, error: distro.error }
      : { data: distro.data, error: undefined };
  }

  static async getCmd() {
    const dis_os = (await this.getDisOS()).data;

    if (!dis_os) {
      return { data: undefined, error: 'Distribution not determined' };
    }

    const command = this._getCommandByDistro(dis_os);
    return command.error
      ? { data: undefined, error: command.error }
      : { data: command.data, error: undefined };
  }

  static async _getDistribution() {
    const os = (await this.getOS()).data;

    if (!os) {
      return { data: undefined, error: 'OS is undefined' };
    }

    switch (os) {
      case 'linux':
        try {
          const { stdout } = await $`cat /etc/os-release`;
          const dist = stdout.toString().toLowerCase();
          const distro = await this._parseLinuxDistro(dist);
          return { data: distro.id.toString().toLowerCase(), error: undefined };
        } catch (err) {
          return { data: undefined, error: err };
        }

      case 'android':
      case 'win32':
      case 'darwin':
        return { data: os, error: undefined };

      default:
        return { data: undefined, error: 'Platform not recognized' };
    }
  }

  static _parseLinuxDistro(data) {
    const lines = data.split('\n');
    const result = {};

    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value !== undefined) {
        result[key] = value.replace(/"/g, ''); // Remove double quotes
      }
    });
    return result;
  }

  static _getCommandByDistro(distro) {
    const commands = {
      'ubuntu': 'sudo -S apt-get',
      'debian': 'sudo -S apt-get',
      'fedora': 'sudo -S dnf',
      'centos': 'sudo -S yum',
      'arch': 'sudo -S pacman',
      'suse': 'zypper',
      'win32': 'choco',
      'darwin': 'brew',
      'android': 'pkg'
    };

    if (!commands[distro]) {
      return { data: undefined, error: 'Distro not registered, change CMD in your config file' };
    }
    return { data: commands[distro], error: undefined };
  }
}

export default ConfigPlatform;

// Exporting individual methods
export const getOS = () => ConfigPlatform.getOS();
export const getDisOS = () => ConfigPlatform.getDisOS();
export const getCmd = () => ConfigPlatform.getCmd();