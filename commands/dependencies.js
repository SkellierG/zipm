// import { promises as fs } from 'node:fs';
// import { resolve } from 'node:path'
// import chalk from 'chalk';
// import Enquirer from 'enquirer';
// import { program } from 'commander';
// import Conf from 'conf';
import { $ } from 'execa';
// import figlet from 'figlet'
// import logSymbols from 'log-symbols';
// import ora from 'ora';
// import Platform from './platform.js';

import fs from 'fs';
import path from 'path';
import ConfigFile from './configFile.js';


function validateDependenciesAndFormats(dep) {
    const requiredKeys = ['name', 'name_install', 'description', 'extensions'];
    for (const key of requiredKeys) {
        if (!(key in dep)) {
            return { data: undefined, error: `Error: Missing required key "${key}" in dependency ${JSON.stringify(dep)}` };
        }
    }
        // Verificar formato
    if (!Array.isArray(dep.extensions)) {
        return { data: undefined, error: `Error: "extensions" should be an array in dependency ${JSON.stringify(dep)}` };
    }
    if (dep.extensions.some(ext => typeof ext !== 'string')) {
        return { data: undefined, error: `Error: All items in "extensions" should be strings in dependency ${JSON.stringify(dep)}` };
    }

    // Verificar que 'name', 'name_install', y 'description' sean strings
    if (typeof dep.name !== 'string') {
        return { data: undefined, error: `Error: "name" should be a string in dependency ${JSON.stringify(dep)}` };
    }
    if (typeof dep.name_install !== 'string') {
        return { data: undefined, error: `Error: "name_install" should be a string in dependency ${JSON.stringify(dep)}` };
    }
    if (typeof dep.description !== 'string') {
        return { data: undefined, error: `Error: "description" should be a string in dependency ${JSON.stringify(dep)}` };
    }

    return { data: `All dependencies have valid formats`, error: undefined };
}

async function* asyncGenerator(items) {
  for (const item of items) {
    try {
      yield await processItem(item);
    } catch (error) {
      throw error; // Lanzar el error para detener la iteración
    }
  }
}

async function processItem(item) {
    const { data: validationData, error: validationError } = await validateDependenciesAndFormats(item)
    if (validationError) {
        throw new Error(validationError.toString())
    }

    // console.log('\n')
    // console.log('name', item.name)
    // console.log('inst', item.name_install)
    // console.log('desc', item.description)
    // console.log('exts', item.extensions)
    // console.log('\n')

    //testeo
    const { data: testData, error: testError } = await testing(item);
    if (testError) {
        return { item, installed: false }
    }
    return { item, installed: true }
    //if uninstalled return { item, false }
    //if installed etrun { item, true }

    //return { data: item, error: undefined};
}

async function testing(item) {
    try {
        if (depo.config.os == 'win32') {
            await $`where ${item.name_install}`;
        } else {
            await $`which ${item.name_install}`;
        }
        return { data: 'success', error: undefined }
    } catch (err) {
        return { data: undefined, error: err }
    }
}

class Dependencies {
    constructor() {
        this.dep;
        this.config;
    }

    async readConfigFile() {
        const { data, error } = await ConfigFile.read();
        if (error) {
            return { data: undefined, error }
        }
        this.config = data;

        return { data, error: undefined }
    }

    async getListofDependencies() {
     //console.log('getListofDependencies');
     try {
         const dep_list = await fs.promises.readFile(path.join(this.config.dep_dir, this.config.dep_file), 'utf8')
         this.dep = JSON.parse(dep_list).dependencies;
         return { data: this.dep , error: undefined }
     } catch (err) {
         console.error(`getListofDependencies: filed attempt to read ${this.config.dep_dir}/${this.config.dep_file}`, err)
         return { data: undefined, error: err }
     }
    }

    async testInstalledDependencies() {
        let results = {
            installed: [],
            uninstalled: [],
        }

        if (this.dep) {
            try {
                for await (const result of asyncGenerator(this.dep)) {
                  if (result.installed === true) {
                    results.installed.push(result.item);
                  } else {
                    results.uninstalled.push(result.item);
                  }
                }
            } catch (err) {
                return { data: undefined, error: err }
            }
        } else {
            return { data: undefined, error: 'dependencies.js:Dependencies:testInstalledDependencies: this.dep is undefined' }
        }

        return { data: results, error: undefined }
    }
}

export default new Dependencies;








const depo = new Dependencies;

//console.log(await depo.readConfigFile());
await depo.readConfigFile()
//console.log(await depo.getListofDependencies());
await depo.getListofDependencies()

console.log(await depo.testInstalledDependencies());

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