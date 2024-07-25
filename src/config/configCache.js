import { read } from './configFile.js'

class ConfigCache {
	constructor () {
		this.version;
		this.os;
		this.dis_os;
		this.cmd;
		this.root;
		this.dep_file;
		this.dep_dir;
	}
	async update () {
		const readFile = await read();
		if (readFile.error) {
			return { data: undefined, error: readFile.error }
		}

		const res = {
			cache_version: this.version = readFile.data.version,
			cache_os: this.os = readFile.data.os,
			cache_dis_os: this.dis_os = readFile.data.dis_os,
			cache_cmd: this.cmd = readFile.data.cmd,
			cache_root: this.root = readFile.data.root,
			cache_dep_file: this.dep_file = readFile.data.dep_file,
			cache_dep_dir: this.dep_dir = readFile.data.dep_dir
		}

		return { data: { configCache: res, configFile: readFile.data }, error: undefined }
	}
}

const configCache = new ConfigCache;

export default configCache;

export const update = ()=>configCache.update();