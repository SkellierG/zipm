import { homedir } from 'os'
import { dirname, join as pathJoin } from 'path'
import { fileURLToPath } from 'url'

export default class PathUtilites {
  private static readonly configFilePath: string = pathJoin(homedir(), 'zipm.conf');
  private static readonly appsFilePath: string = pathJoin(homedir(), 'apps.conf');
  private static readonly logsDir: string = pathJoin(homedir(), '/logs');

  public static getHomeDir(): string {
    return homedir();
  }
  public static getFilename(importMetaUrl: string): string {
    return fileURLToPath(importMetaUrl);
  }
  public static getDirname(importMetaUrl: string): string {
    return dirname(fileURLToPath(importMetaUrl));
  }
  public static getRoot(importMetaUrl: string): string {
    return dirname(fileURLToPath(importMetaUrl)).split('/').slice(0, -1).join('/');
  }

  public static getConfigFilePath(): string {
    return this.configFilePath;
  }
  public static getAppsFilePath(): string {
    return this.appsFilePath;
  }
  public static getLogsDir(): string {
    return this.logsDir;
  }
}
