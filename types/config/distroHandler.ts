import { $ } from 'execa';

class DistroHandler {

  static async getLinuxDistro() {
    try {
      const { stdout } = await $`cat /etc/os-release`; 
      if (!stdout) {
        throw new Error('cat /etc/os-release, stdout is undefined')
      }
      const dist = stdout.toString().toLowerCase();
      const distro = this.parseLinuxDistro(dist);
      return { data: distro.id.toString().toLowerCase(), error: undefined };
    } catch (err) {
      return { data: undefined, error: err }; 
    }
  }

  static parseLinuxDistro(data) {
    const lines = data.split('\n');
    const result = {};

    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value !== undefined) {
        result[key] = value.replace(/"/g, '');
      }
    });
    return result;
  }
}

export default DistroHandler;