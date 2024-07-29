import { read } from './configFile.js'

class ConfigCache {

	#data = {};

	constructor () {
		this.#data = {};
	}

	static getInstance() {
		if (!ConfigCache.instance) {
			ConfigCache.instance = new ConfigCache();
		}
		return ConfigCache.instance;
	}

	async update () {
		const readConfig = await read();
		if (readConfig.error) {
			return { data: undefined, error: readConfig.error }
		}

		const res = {
			cache_version: this.#data.version = readConfig.data.version,
			cache_os: this.#data.os = readConfig.data.os,
			cache_dis_os: this.#data.dis_os = readConfig.data.dis_os,
			cache_cmd: this.#data.cmd = readConfig.data.cmd,
			cache_root: this.#data.root = readConfig.data.root,
			cache_dep_file: this.#data.dep_file = readConfig.data.dep_file,
			cache_dep_dir: this.#data.dep_dir = readConfig.data.dep_dir
		}

		return { data: { configCache: res, configFile: readConfig.data }, error: undefined }
	}
	getAll() {
		return this.#data !== undefined 
			? { data: this.#data, error: undefined } 
			: { data: undefined, error: 'Data not available' };
	}

	getVersion() {
		return this.#data.version !== undefined 
			? { data: this.#data.version, error: undefined } 
			: { data: undefined, error: 'Version not available' };
	}

	getOS() {
		return this.#data.os !== undefined 
			? { data: this.#data.os, error: undefined } 
			: { data: undefined, error: 'OS not available' };
	}

	getDisOS() {
		return this.#data.dis_os !== undefined 
			? { data: this.#data.dis_os, error: undefined } 
			: { data: undefined, error: 'Distribution OS not available' };
	}

	getCmd() {
		return this.#data.cmd !== undefined 
			? { data: this.#data.cmd, error: undefined } 
			: { data: undefined, error: 'Command not available' };
	}

	getRoot() {
		return this.#data.root !== undefined 
			? { data: this.#data.root, error: undefined } 
			: { data: undefined, error: 'Root not available' };
	}

	getDepFile() {
		return this.#data.dep_file !== undefined 
			? { data: this.#data.dep_file, error: undefined } 
			: { data: undefined, error: 'Dependency file not available' };
	}

	getDepDir() {
		return this.#data.dep_dir !== undefined 
			? { data: this.#data.dep_dir, error: undefined } 
			: { data: undefined, error: 'Dependency directory not available' };
	}
}

const configCache = ConfigCache.getInstance();

export default configCache;

export const update = () => configCache.update();
export const getAll = () => configCache.getAll();
export const getVersion = () => configCache.getVersion();
export const getOS = () => configCache.getOS();
export const getDisOS = () => configCache.getDisOS();
export const getCmd = () => configCache.getCmd();
export const getRoot = () => configCache.getRoot();
export const getDepFile = () => configCache.getDepFile();
export const getDepDir = () => configCache.getDepDir();