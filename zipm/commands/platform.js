import fs from 'fs';
import path from 'path';
import os from 'os';
import { $ } from 'execa';
//import { resolve } from 'node:path'
//import chalk from 'chalk';
//import Enquirer from 'enquirer';
//import { program } from 'commander';
//import Conf from 'conf';
//import figlet from 'figlet'
//import logSymbols from 'log-symbols';
//import ora from 'ora';
//import logg from './log.js';

class Platform {
    constructor() {
        this.os;
        this.dis_os;
        this.cmd;
    }

    async _init() {
        const results = {
            getOS: await this.getOS(),
            getDisOS: await this.getDisOS(),
            getCmd: await this.getCmd()
        }

        const allSuccessful = Object.values(results).every(result => !result.error);

        if (allSuccessful) {
            return {
                data: {
                os: this.os,
                dis_os: this.dis_os,
                cmd: this.cmd
                },
                error: undefined
            }
        }
        return { data: undefined, error: results }
    }

    getOS() {
        try {
            this.os = os.platform();
            return { data: this.os, error: undefined }
        } catch (err) {
            console.error();
            return { data: undefined, error: err }
        }
    }

    async getDisOS() {
        const distro = await this.getDistribution();
        if (distro.error) {
            return { data: undefined, error: distro.error }    
        }
        return distro;
    }

    getCmd() {
        if (!this.dis_os) {
            return { data: undefined, error: 'Distribution not determined' };
        }

        const command = this.getCommandByDistro(this.dis_os);
        if (command.error) {
            return { data: undefined, error: command.error }
        }
        return command;
    }

    async getDistribution(){
    if (this.os === undefined) {
        return { data: undefined, error: 'OS is undefined' };
    }

    switch (this.os) {
        case 'linux':
            let dis;
            try {
                const { stdout, stderr } = await $`cat /etc/os-release`;
                dis = stdout;
            } catch (stderr) {
                return { data: undefined, error: stderr }
            }

            const dist = dis.toString().toLowerCase();
            const distro = await this.parseLinuxDistro(dist);
            this.dis_os = this.dis_os = distro.id.toString().toLowerCase();

            return { data: this.dis_os, error: undefined }

        case 'win32':
        case 'darwin':
            this.dis_os = this.os;
            return { data: this.dis_os, error: undefined }
 
        default:
            return { data: undefined, error: 'not reconized platform' }
    }
    }

    parseLinuxDistro(data) {
        const lines = data.split('\n');
        const result = {};
        
        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value !== undefined) {
                result[key] = value.replace(/"/g, ''); // Elimina las comillas dobles
            }
        });
        return result;
    }

    getCommandByDistro(distro) {
        const commands = {
            'ubuntu': 'sudo apt-get',
            'debian': 'sudo apt-get',
            'fedora': 'sudo dnf',
            'centos': 'sudo yum',
            'arch': 'pacman',
            'suse': 'zypper',
            'win32': 'choco',
            'darwin': 'brew'
        };
        if (!commands[distro]) {
            return { data: undefined, error: 'not registered distro, change CMD in your config file and put the package manager bash command of your distro' };
        }
        this.cmd = commands[distro];
        return { data: this.cmd, error: undefined };
    }
}

// const info = new Platform;

// console.log(await info._init())
// console.log(await info.getOS())
// console.log(await info.getDistribution())
// console.log(await info.getCmd())

export default new Platform;

// let installationCmd = null;

// const platform = os.platform();

// function parseLinuxDis(data) {
//     const lines = data.split('\n');
//     const result = {};
    
//     lines.forEach(line => {
//         const [key, value] = line.split('=');
//         if (key && value !== undefined) {
//             result[key] = value.replace(/"/g, ''); // Elimina las comillas dobles
//         }
//     });
    
//     return result;
// }

// async function defineCmd(){
// switch (platform) {
//     case 'linux':
//         const { stdout: dis } = await $`cat /etc/os-release`;
//         const dist = dis.toString().toLowerCase();
//         const distro = parseLinuxDis(dist);
//         //console.log(distro);
//         logg.info(distro);

//         switch (distro.id) {
//             case 'fedora' || 'red hat':
//                 installationCmd = 'sudo dnf';
//                 break;

//             case 'debian' || 'ubuntu':
//                 installationCmd = "sudo apt-get";
//                 break;
        
//             default:
//                 console.error(chalk.red('not reconized distro, install manually'));
//                 break;
//         }
//         break;

//     case 'win32':
//         installationCmd = 'choco';
//         break;

//     case 'darwin':
//         installationCmd = 'brew';
//         break;

//     default:
//         console.error(logSymbols.error, chalk.red('not reconized platform'))
//         break;
// }
// return installationCmd.toString();
// }
