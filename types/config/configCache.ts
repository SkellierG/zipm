import { read as configReader } from './configFile.js';

/**
 * Singleton class for managing configuration cache.
 * This class ensures that there's only one instance of the configuration cache 
 * throughout the application lifecycle.
 */
class ConfigCache {
    #data = {};
    #configReader;

    /**
     * Initializes the configuration cache with an empty data object.
     */
    constructor() {
        this.#data = {};
        this.#configReader = configReader;
    }

    static getInstance() {
        if (!ConfigCache.instance) {
            ConfigCache.instance = new ConfigCache();
        }
        return ConfigCache.instance;
    }

    /**
     * Updates the configuration cache with data read from the configuration file.
     * @returns {Promise<{ data: { configCache: object, configFile: object } | undefined, error: string | undefined }>}
     * - `data`: An object containing the updated cache and configuration file data if successful.
     * - `error`: An error message if the update fails.
     */
    async update() {
        const readConfig = await this.#configReader();
        if (readConfig.error) {
            return { data: undefined, error: readConfig.error };
        }

        this.#data = { ...readConfig.data };
        return { data: { configCache: this.#data, configFile: readConfig.data }, error: undefined };
    }

    /**
     * Retrieves all cached configuration data.
     * @returns {{ data: object | undefined, error: string | undefined }}
     * - `data`: The cached configuration data if available.
     * - `error`: An error message if the data is not available.
     */
    getAll() {
        return this.#data !== undefined 
            ? { data: this.#data, error: undefined } 
            : { data: undefined, error: 'Data not available' };
    }

    // Methods for accessing specific configuration data
    getVersion() { return this.#getCachedData('version', 'Version not available'); }
    
	getOS() { return this.#getCachedData('os', 'OS not available'); }
    
	getDisOS() { return this.#getCachedData('dis_os', 'Distribution OS not available'); }
    
	getCmd() { return this.#getCachedData('cmd', 'Command not available'); }
    
	getRoot() { return this.#getCachedData('root', 'Root not available'); }
    
	getDepFile() { return this.#getCachedData('dep_file', 'Dependency file not available'); }
    
	getDepDir() { return this.#getCachedData('dep_dir', 'Dependency directory not available'); }

    /**
     * Helper method to get cached data or return an error message.
     * @param {string} key - The key of the cached data.
     * @param {string} errorMsg - The error message if the data is not available.
     * @returns {{ data: string | undefined, error: string | undefined }}
     */
    #getCachedData(key, errorMsg) {
        return this.#data[key] !== undefined 
            ? { data: this.#data[key], error: undefined } 
            : { data: undefined, error: errorMsg };
    }
}

/**
 * Singleton class for managing configuration cache.
 * This class ensures that there's only one instance of the configuration cache 
 * throughout the application lifecycle.
 */
const configCache = ConfigCache.getInstance();

export default configCache;

/**
 * Updates the configuration cache using the singleton instance.
 * @returns {Promise<{ data: { configCache: object, configFile: object } | undefined, error: string | undefined }>}
 * - `data`: An object containing the updated cache and configuration file data if successful.
 * - `error`: An error message if the update fails.
 */
export const update = () => configCache.update();

/**
 * Retrieves all cached configuration data using the singleton instance.
 * @returns {{ data: object | undefined, error: string | undefined }}
 * - `data`: The cached configuration data if available.
 * - `error`: An error message if the data is not available.
 */
export const getAll = () => configCache.getAll();

/**
 * Retrieves the cached version from the configuration using the singleton instance.
 * @returns {{ data: string | undefined, error: string | undefined }}
 * - `data`: The cached version if available.
 * - `error`: An error message if the version is not available.
 */
export const getVersion = () => configCache.getVersion();

/**
 * Retrieves the cached operating system from the configuration using the singleton instance.
 * @returns {{ data: string | undefined, error: string | undefined }}
 * - `data`: The cached operating system if available.
 * - `error`: An error message if the OS is not available.
 */
export const getOS = () => configCache.getOS();

/**
 * Retrieves the cached distribution of the operating system from the configuration using the singleton instance.
 * @returns {{ data: string | undefined, error: string | undefined }}
 * - `data`: The cached distribution of the OS if available.
 * - `error`: An error message if the distribution OS is not available.
 */
export const getDisOS = () => configCache.getDisOS();

/**
 * Retrieves the cached command from the configuration using the singleton instance.
 * @returns {{ data: string | undefined, error: string | undefined }}
 * - `data`: The cached command if available.
 * - `error`: An error message if the command is not available.
 */
export const getCmd = () => configCache.getCmd();

/**
 * Retrieves the cached root directory from the configuration using the singleton instance.
 * @returns {{ data: string | undefined, error: string | undefined }}
 * - `data`: The cached root directory if available.
 * - `error`: An error message if the root is not available.
 */
export const getRoot = () => configCache.getRoot();

/**
 * Retrieves the cached dependency file name from the configuration using the singleton instance.
 * @returns {{ data: string | undefined, error: string | undefined }}
 * - `data`: The cached dependency file name if available.
 * - `error`: An error message if the dependency file is not available.
 */
export const getDepFile = () => configCache.getDepFile();

/**
 * Retrieves the cached dependency directory from the configuration using the singleton instance.
 * @returns {{ data: string | undefined, error: string | undefined }}
 * - `data`: The cached dependency directory if available.
 * - `error`: An error message if the dependency directory is not available.
 */
export const getDepDir = () => configCache.getDepDir();
