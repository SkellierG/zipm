import { homedir } from 'os';
import { dirname, join as pathJoin } from 'path';
import { fileURLToPath } from 'url';
class PathUtilites {
    static getHomeDir() {
        return homedir();
    }
    static getFilename(importMetaUrl) {
        return fileURLToPath(importMetaUrl);
    }
    static getDirname(importMetaUrl) {
        return dirname(fileURLToPath(importMetaUrl));
    }
    static getRoot(importMetaUrl) {
        return dirname(fileURLToPath(importMetaUrl)).split('/').slice(0, -1).join('/');
    }
    static getConfigFilePath() {
        return this.configFilePath;
    }
    static getAppsFilePath() {
        return this.appsFilePath;
    }
    static getLogsDir() {
        return this.logsDir;
    }
}
PathUtilites.configFilePath = pathJoin(homedir(), 'zipm.conf');
PathUtilites.appsFilePath = pathJoin(homedir(), 'apps.conf');
PathUtilites.logsDir = pathJoin(homedir(), '/logs');
export default PathUtilites;
//# sourceMappingURL=path.common.js.map