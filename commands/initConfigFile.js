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
		this.dis_os;
		this.cmd;
		this.root = __dirname;
		this.dep_file = 'dep_list.json';
		this.dep_dir = path.join(__dirname);
		//this.dep;
	}

	async _init() {
		try {
			const results = {
				initPlatform: await Platform._init(),
				getCLIversion: await this.getCLIversion(),
				getOS: await this.getOS(),
				getDisOS: await this.getDisOS(),
				getCmd: await this.getCmd(),
				//getListofDependencies: await this.getListofDependencies()
			};
			
			const allSuccessful = Object.values(results).every(result => !result.error);
			
			if (allSuccessful) {
				return {
					data: {
						version: this.version,
						os: this.os,
						dis_os: this.dis_os,
						cmd: this.cmd,
						root: this.root,
						dep_file: this.dep_file,
						dep_dir: this.dep_dir,
						//dep: this.dep
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
		//console.log('getCLIversion');
		try {
			const { stdout, stderr} = await $`zipm -V`;
			this.version = stdout;
			return { data: this.version, error: undefined }
		} catch (stderr) {
			//console.error('getCLIversion: bash command failed', stderr)
			return { data: undefined, error: stderr }
		}
	}

	getOS() {
		//console.log('getOS');
		this.os = Platform.os;
		if (!this.os) {
			return { data: undefined, error: 'os is undefined' }
		}
		return { data: this.os, error: undefined }
	}

	getDisOS() {
		//console.log('getOS');
		//Platform.getOs();
		this.dis_os = Platform.dis_os;
		if (!this.dis_os) {
			return { data: undefined, error: 'dis_os is undefined' }
		}
		return { data: this.dis_os, error: undefined }
	}

	getCmd() {
		//console.log('getCmd');
		this.cmd = Platform.cmd;
		if (!this.cmd) {
			return { data: undefined, error: 'cmd is undefined' }
		}
		return { data: this.cmd, error: undefined }
	}

	//changed to dependencies.js
	// async getListofDependencies() {
	// 	//console.log('getListofDependencies');
	// 	try {
	// 		const dep_list = await fs.promises.readFile(path.join(this.dep_dir, this.dep_file), 'utf8')
	// 		this.dep = JSON.parse(dep_list);
	// 		return { data: this.dep, error: undefined }
	// 	} catch (err) {
	// 		console.error(`getListofDependencies: filed attempt to read ${this.dep_dir}/${this.dep_file}`, err)
	// 		return { data: undefined, error: err }
	// 	}
	// }
}

// const conf = new InitConfigFile;
// console.log(await conf._init())


export default new InitConfigFile;