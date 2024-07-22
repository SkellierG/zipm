import os from 'os';
import path from 'path';
import fs from 'fs';
import url from 'url';
import { $ } from 'execa';
import Platform from './platform.js';

const __dirname = path.join(url.fileURLToPath(new URL('.', import.meta.url)), '..');

class ConfigInit {
	constructor() {
		this.version;
		this.os;
		this.dis_os;
		this.cmd;
		this.root = __dirname;
		this.dep_file = 'dep_list.json';
		this.dep_dir = path.join(__dirname);
	}

	async init() {
		try {
			const results = {
				initPlatform: await Platform.init(),
				getCLIversion: await this._getCLIversion(),
				getOS: await this._getOS(),
				getDisOS: await this._getDisOS(),
				getCmd: await this._getCmd(),
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

	async _getCLIversion () {
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

	_getOS() {
		//console.log('getOS');
		this.os = Platform.os;
		if (!this.os) {
			return { data: undefined, error: 'os is undefined' }
		}
		return { data: this.os, error: undefined }
	}

	_getDisOS() {
		//console.log('getOS');
		//Platform.getOs();
		this.dis_os = Platform.dis_os;
		if (!this.dis_os) {
			return { data: undefined, error: 'dis_os is undefined' }
		}
		return { data: this.dis_os, error: undefined }
	}

	_getCmd() {
		//console.log('getCmd');
		this.cmd = Platform.cmd;
		if (!this.cmd) {
			return { data: undefined, error: 'cmd is undefined' }
		}
		return { data: this.cmd, error: undefined }
	}
}

export default new ConfigInit;