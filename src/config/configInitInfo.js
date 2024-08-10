import { $ } from 'execa';
import Platform from './configPlatform.js';
import path from 'path'
import url from 'url'

const __dirname = path.join(url.fileURLToPath(new URL('.', import.meta.url)), '../..');

class ConfigInitInfo {

  static platform = Platform;

  static async fetchData() {
    try {
      const results = {
        getCLIversion: await this._getCLIversion(),
        getOS: this.platform.getOS(),
        getDisOS: await this.platform.getDisOS(),
        getCmd: await this.platform.getCmd()
      };

      const allSuccessful = Object.values(results).every(result => !result.error);

      if (allSuccessful) {
        return {
          data: {
            version: results.getCLIversion.data,
            os: results.getOS.data,
            dis_os: results.getDisOS.data,
            cmd: results.getCmd.data,
            root: __dirname,
            dep_file: 'dep_list.json',
            dep_dir: __dirname
          },
          error: undefined
        };
      }
      return { data: undefined, error: results };
    } catch (err) {
      return { data: undefined, error: err };
    }
  }

  static async _getCLIversion() {
    try {
      const { stdout, stderr } = await $`zipm -V`;
      return { data: stdout.trim(), error: undefined };
    } catch (stderr) {
      return { data: undefined, error: stderr };
    }
  }
}

export default ConfigInitInfo;

export const fetchData = () => ConfigInitInfo.fetchData();
