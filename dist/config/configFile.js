System.register(["fs", "path", "os", "./configParser.js"], function (exports_1, context_1) {
    "use strict";
    var fs_1, path_1, os_1, configParser_js_1, ConfigFile, configFile, read, write;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (fs_1_1) {
                fs_1 = fs_1_1;
            },
            function (path_1_1) {
                path_1 = path_1_1;
            },
            function (os_1_1) {
                os_1 = os_1_1;
            },
            function (configParser_js_1_1) {
                configParser_js_1 = configParser_js_1_1;
            }
        ],
        execute: function () {
            ConfigFile = class ConfigFile {
                constructor() {
                    this.parser = configParser_js_1.default;
                    this.dir = path_1.default.join(os_1.default.homedir(), '.zipm');
                    this.name = 'config.txt';
                    this.fullpath = path_1.default.join(this.dir, this.name);
                }
                static getInstance() {
                    if (!ConfigFile.instance) {
                        ConfigFile.instance = new ConfigFile();
                    }
                    return ConfigFile.instance;
                }
                async read() {
                    try {
                        const readData = await fs_1.default.promises.readFile(this.fullpath, 'utf8');
                        const parsedData = this.parser.stringToParse(readData);
                        return { data: this.parser.getEntries(parsedData), error: undefined };
                    }
                    catch (err) {
                        return { data: undefined, error: err };
                    }
                }
                async write(data) {
                    try {
                        const configFileExists = fs_1.default.existsSync();
                        if (!configFileExists) {
                            await fs_1.default.promises.appendFile(this.fullpath, '');
                        }
                        const originalData = await fs_1.default.promises.readFile(this.fullpath, 'utf8');
                        const original = this.parser.stringToParse(originalData);
                        const update = this.parser.mergeChanges(original, data);
                        const result = this.parser.parseToString(update);
                        return this._hardWrite(result);
                    }
                    catch (err) {
                        return { data: undefined, error: err };
                    }
                }
                async _hardWrite(data) {
                    try {
                        const FILE_EXISTS = fs_1.default.existsSync(this.dir);
                        if (!FILE_EXISTS) {
                            await fs_1.default.promises.mkdir(this.dir);
                        }
                        await fs_1.default.promises.writeFile(this.fullpath, data, 'utf8');
                        return { data: data, error: undefined };
                    }
                    catch (err) {
                        console.log('Cannot write config file', err);
                        return { data: undefined, error: err };
                    }
                }
            };
            // Create a singleton instance of ConfigFile
            configFile = ConfigFile.getInstance();
            exports_1("default", configFile);
            exports_1("read", read = () => configFile.read());
            exports_1("write", write = (data) => configFile.write(data));
        }
    };
});
//# sourceMappingURL=configFile.js.map