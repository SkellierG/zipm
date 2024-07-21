// import { promises as fs } from 'node:fs';
import fs from 'fs'
import path from 'path'
import Config from './config.js'
// import { resolve } from 'node:path'
// import chalk from 'chalk';
// import Enquirer from 'enquirer';
// import { program } from 'commander';
// import Conf from 'conf';
// import { $, ExecaError } from 'execa';
// import figlet from 'figlet'
// import logSymbols from 'log-symbols';
// import ora from 'ora';
// import Platform from './platform.js'

class Dependencies {
    constructor() {

    }
}

export default new Dependencies;

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