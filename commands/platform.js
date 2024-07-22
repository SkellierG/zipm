import fs from 'fs';
import path from 'path';
import os from 'os';
import { $ } from 'execa';

class Platform {
    constructor() {
        this.os;
        this.dis_os;
        this.cmd;
    }

    async init() {
        const results = {
            getOS: await this._getOS(),
            getDisOS: await this._getDisOS(),
            getCmd: await this._getCmd()
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

    _getOS() {
        try {
            this.os = os.platform();
            return { data: this.os, error: undefined }
        } catch (err) {
            console.error();
            return { data: undefined, error: err }
        }
    }

    async _getDisOS() {
        const distro = await this._getDistribution();
        if (distro.error) {
            return { data: undefined, error: distro.error }    
        }
        return distro;
    }

    _getCmd() {
        if (!this.dis_os) {
            return { data: undefined, error: 'Distribution not determined' };
        }

        const command = this._getCommandByDistro(this.dis_os);
        if (command.error) {
            return { data: undefined, error: command.error }
        }
        return command;
    }

    async _getDistribution(){
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
                const distro = await this._parseLinuxDistro(dist);
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

    _parseLinuxDistro(data) {
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

    _getCommandByDistro(distro) {
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

export default new Platform;