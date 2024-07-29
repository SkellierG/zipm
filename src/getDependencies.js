import fs from 'fs';
import path from 'path';
import { update as updateCache, getOS, getDepDir, getDepFile } from './config/configCache.js';
import { $ } from 'execa';

// Asegúrate de que la caché se actualiza antes de usar esta clase
await updateCache();

class GetDependencies {
    static dep;

    static async fetchData() {
        const results = {
            getListOfDependencies: await this._getListOfDependencies(),
            testInstalledDependencies: await this._testInstalledDependencies()
        };

        const allSuccessful = Object.values(results).every(result => !result.error);

        if (!allSuccessful) {
            return { data: undefined, error: results };
        }

        return { data: results.testInstalledDependencies.data, error: undefined };
    }

    static async _getListOfDependencies() {
        try {
            const depDirResult = await getDepDir();
            if (depDirResult.error) {
                return { data: undefined, error: `Failed to get dependency directory: ${depDirResult.error}` };
            }
            const depFileResult = await getDepFile();
            if (depFileResult.error) {
                return { data: undefined, error: `Failed to get dependency file name: ${depFileResult.error}` };
            }

            const depListPath = path.join(depDirResult.data, depFileResult.data);
            const depListContent = await fs.promises.readFile(depListPath, 'utf8');
            this.dep = JSON.parse(depListContent).dependencies;
            return { data: this.dep, error: undefined };
        } catch (error) {
            console.error(`Failed to read dependencies file:`, error);
            return { data: undefined, error: `Failed to read dependencies: ${error.message}` };
        }
    }

    static async _testInstalledDependencies() {
        const results = {
            installed: [],
            uninstalled: []
        };

        const depResult = await this._getListOfDependencies();
        if (depResult.error) {
            return { data: undefined, error: depResult.error };
        }

        if (!this.dep) {
            return { data: undefined, error: 'Dependencies are not loaded' };
        }

        try {
            for await (const result of this._asyncGenerator(this.dep)) {
                if (result.installed) {
                    results.installed.push(result.item);
                } else {
                    results.uninstalled.push(result.item);
                }
            }
        } catch (error) {
            return { data: undefined, error: `Testing dependencies failed: ${error.message}` };
        }

        return { data: results, error: undefined };
    }

    static _validateDependenciesAndFormats(dep) {
        const requiredKeys = ['name', 'name_install', 'description', 'extensions'];
        for (const key of requiredKeys) {
            if (!(key in dep)) {
                return { data: undefined, error: `Missing required key "${key}" in dependency ${JSON.stringify(dep)}` };
            }
        }

        if (!Array.isArray(dep.extensions)) {
            return { data: undefined, error: `Extensions should be an array in dependency ${JSON.stringify(dep)}` };
        }

        if (dep.extensions.some(ext => typeof ext !== 'string')) {
            return { data: undefined, error: `All extensions should be strings in dependency ${JSON.stringify(dep)}` };
        }

        if (typeof dep.name !== 'string' || typeof dep.name_install !== 'string' || typeof dep.description !== 'string') {
            return { data: undefined, error: `Name, name_install, and description should be strings in dependency ${JSON.stringify(dep)}` };
        }

        return { data: 'All dependencies have valid formats', error: undefined };
    }

    static async _processItem(item) {
        const { data: validationData, error: validationError } = this._validateDependenciesAndFormats(item);
        if (validationError) {
            throw new Error(validationError);
        }

        const { data: testData, error: testError } = await this._testing(item);
        if (testError) {
            return { item, installed: false };
        }
        return { item, installed: true };
    }

    static async _testing(item) {
        try {
            const osResult = await getOS();
            if (osResult.error) {
                return { data: undefined, error: `Failed to get OS: ${osResult.error}` };
            }

            if (osResult.data === 'win32') {
                await $`where ${item.name_install}`;
            } else {
                await $`which ${item.name_install}`;
            }
            //TODO manejar correctamente los stderr
            return { data: 'success', error: undefined };
        } catch (err) {
            return { data: undefined, error: err };
        }
    }

    static async *_asyncGenerator(items) {
        for (const item of items) {
            try {
                yield await this._processItem(item);
            } catch (err) {
                throw err; // Lanza el error para detener la iteración
            }
        }
    }
}

export default GetDependencies;

export const fetchData = () => GetDependencies.fetchData();


// console.log(await depo.getList());
// await depo.getListofDependencies()

// console.log(JSON.stringify(await depo.getList()));
// console.log(await depo.testInstalledDependencies());

//console.log(depo)

























//OLD CODE


// const instcmd = await Platform;

// let LIST_OF_DEPENDENCIES = [];

// try {
//     const data = await fs.readFile( resolve('dep_list.json') , 'utf8');
//     LIST_OF_DEPENDENCIES = JSON.parse(data);
// } catch (err) {
//     console.error(logSymbols.error, chalk.red(err));
// }

// class Dependencies {
//     constructor() {
//         this.depend = [];
//         LIST_OF_DEPENDENCIES.forEach(({name, cmd, desc}) => {
//             this.depend.push({
//                 name: name,
//                 commands: cmd,
//                 desc: desc,
//             })
//         })
//     }

//     async test() {
//         let installedlist = [];
//         let uninstalledlist = [];
//         let ins = []
//         for (const lib of this.depend) {
//             //console.log(lib);
//             try {
//                 await $`which ${lib.commands[0]}`; //{ stdio: 'ignore' };
//                 //console.log($`which ${lib.commands[0]}`);
//                 installedlist.push(chalk.green(lib.name + ", cmd: " + lib.commands.join(" ")+", desc: "+lib.desc));
//             } catch (err) {
//                 if (err instanceof ExecaError) {
//                     uninstalledlist.push(chalk.red(lib.name + ", cmd: " + lib.commands.join(" ")+", desc: "+lib.desc));
//                     ins.push(lib.name)
//                 } else console.error(err);
//             }
//         }
//         return { installedlist, uninstalledlist, ins };
//     }

//     async all(){
//         const { installedlist, uninstalledlist, ins } = await this.test();
//         //console.log(installedlist, uninstalledlist);
//         console.log(`Installed:\n`+installedlist.join("\n")+`\nNot installed(required):\n`+uninstalledlist.join("\n"));
//         if ( uninstalledlist.length > 0 ) {
//             this.installDependencies( ins )
//         }
//     }

//     async installed(){
//         const { installedlist } = await this.test();
//         console.log(`Installed:\n`+installedlist.join("\n"));
//         //console.log(logSymbols.info, "hola");
//     }

//     async required(){
//         const { uninstalledlist, ins } = await this.test();
//         console.log(`Not installed(required):\n`+uninstalledlist.join("\n"));
//         if ( uninstalledlist.length > 0 ) {
//             this.installDependencies( ins )
//         }
//     }

//     async installDependencies(libs) {
//         const response = await Enquirer.prompt({
//             type: "confirm",
//             name: "install",
//             message: "Do you want to "+chalk.green("install")+" dependencies?"
//         })
//         //console.log(response);
//         if (response.install) {
//             try {
//                 const { installation: stdout } = await $(`${instcmd} install rar`, {shell: true});
//                 //console.log(installation);
//             } catch (error) {
//                 console.log(error);
//             }
//         } else {
//             console.log(logSymbols.warning, chalk.yellow("action cancelled, please install all the dependencies"));
//         };
//     };
// };

// export default new Dependencies();
