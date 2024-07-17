import { promises as fs } from 'node:fs';
import { resolve } from 'node:path'
import chalk from 'chalk';
import Enquirer from 'enquirer';
import { program } from 'commander';
import Conf from 'conf';
import { $, ExecaError } from 'execa';
import figlet from 'figlet'
import logSymbols from 'log-symbols';
import ora from 'ora';
import os from 'os';
import logg from './log.js';

let installationCmd = null;

const platform = os.platform();

function parseLinuxDis(data) {
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

async function defineCmd(){
switch (platform) {
    case 'linux':
        const { stdout: dis } = await $`cat /etc/os-release`;
        const dist = dis.toString().toLowerCase();
        const distro = parseLinuxDis(dist);
        //console.log(distro);
        logg.info(distro);

        switch (distro.id) {
            case 'fedora' || 'red hat':
                installationCmd = 'sudo dnf';
                break;

            case 'debian' || 'ubuntu':
                installationCmd = "sudo apt-get";
                break;
        
            default:
                console.error(chalk.red('not reconized distro, install manually'));
                break;
        }
        break;

    case 'win32':
        installationCmd = 'choco';
        break;

    case 'darwin':
        installationCmd = 'brew';
        break;

    default:
        console.error(logSymbols.error, chalk.red('not reconized platform'))
        break;
}
return installationCmd.toString();
}

export default defineCmd();