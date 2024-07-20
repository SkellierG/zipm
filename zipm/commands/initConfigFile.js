import os from 'os';
import path from 'path';
import fs from 'fs';
import url from 'url';
import { $ } from 'execa';
import Platform from './platform.js'

const __dirname = path.join(url.fileURLToPath(new URL('.', import.meta.url)), '..');

class InitConfigFile {
	constructor() {
		this.version;
		this.os;
		this.cdm;
		this.root = __dirname;
		this.depFileName = 'dep_list.json'
		this.dep;		
	}

	async _init() {
		try {
			const results = {
				getCLIversion: await this.getCLIversion(),
				getOS: await this.getOS(),
				getCmd: await this.getCmd(),
				getListofDependencies: await this.getListofDependencies()
			};
			
			const allSuccessful = Object.values(results).every(result => !result.error);
			
			if (allSuccessful) {
				return {
					data: {
						version: this.version,
						os: this.os,
						cmd: this.cmd,
						root: this.root,
						dep: this.dep
					},
					error: undefined
				}
			}
			return { data: undefined, error: results }
		} catch(err) {
			return { data: undefined, error: err }
		}
	}

	async getCLIversion () {
		console.log('getCLIversion');
		try {
			const { stdout: res, stderr: err } = await $`zipm -V`;
			this.version = res;
			return { status: true };
		} catch (err) {
			console.error('getCLIversion: bash command failed', err)
			return { status: false, error: err }
		}
	}

	getOS() {
		console.log('getOS');
		try {
			//Platform.getOs();
			this.os = Platform.os
			//throw new Error;
			return { status: true }
		} catch (err) {
			return { status: false, error: err }
		}
	}

	getCmd() {
		console.log('getCmd');
		try {
			//Platform.getCmd();
			this.cmd = Platform.cmd;
			//throw new Error;
			return { status: true }
		} catch (err) {
			return { status: false, error: err }
		}
	}

	async getListofDependencies() {
		console.log('getListofDependencies');
		try {
			const dep_list = await fs.promises.readFile(path.join(__dirname, this.depFileName), 'utf8')
			this.dep = JSON.parse(dep_list);
			return { status: true }
		} catch (err) {
			console.error(`getListofDependencies: filed attempt to read ${this.depFileName}`, err)
			return { status: false, error: err }
		}
	}
}

const conf = new InitConfigFile;
console.log(await conf._init())


export default new InitConfigFile;