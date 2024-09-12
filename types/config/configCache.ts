import { read as configReader } from './configFile.js';

class ConfigCache {
  #data: Record<string, any> = {};
  #configReader: () => Promise<{ data: Record<string, any> | undefined, error: string | undefined }>;

  constructor() {
    this.#data = {};
    this.#configReader = configReader;
  }

  static instance: ConfigCache;

  static getInstance(): ConfigCache {
    if (!ConfigCache.instance) {
      ConfigCache.instance = new ConfigCache();
    }
    return ConfigCache.instance;
  }

  async update(): Promise<{ data?: { configCache: Record<string, any>, configFile: Record<string, any> }, error?: string }> {
    const readConfig = await this.#configReader();
    if (readConfig.error) {
      return { error: readConfig.error };
    }

    this.#data = { ...readConfig.data };
    return { data: { configCache: this.#data, configFile: readConfig.data! } };
  }

  getAll(): { data?: Record<string, any>, error?: string } {
    return this.#data !== undefined
      ? { data: this.#data }
      : { error: 'Data not available' };
  }

  getVersion(): { data?: string, error?: string } {
    return this.#getCachedData('version', 'Version not available');
  }

  getOS(): { data?: string, error?: string } {
    return this.#getCachedData('os', 'OS not available');
  }

  getDisOS(): { data?: string, error?: string } {
    return this.#getCachedData('dis_os', 'Distribution OS not available');
  }

  getCmd(): { data?: string, error?: string } {
    return this.#getCachedData('cmd', 'Command not available');
  }

  getRoot(): { data?: string, error?: string } {
    return this.#getCachedData('root', 'Root not available');
  }

  getDepFile(): { data?: string, error?: string } {
    return this.#getCachedData('dep_file', 'Dependency file not available');
  }

  getDepDir(): { data?: string, error?: string } {
    return this.#getCachedData('dep_dir', 'Dependency directory not available');
  }

  #getCachedData(key: string, errorMsg: string): { data?: string, error?: string } {
    return this.#data[key] !== undefined
      ? { data: this.#data[key] }
      : { error: errorMsg };
  }
}

const configCache = ConfigCache.getInstance();

export default configCache;

export const update = (): Promise<{ data?: { configCache: Record<string, any>, configFile: Record<string, any> }, error?: string }> => configCache.update();

export const getAll = (): { data?: Record<string, any>, error?: string } => configCache.getAll();

export const getVersion = (): { data?: string, error?: string } => configCache.getVersion();

export const getOS = (): { data?: string, error?: string } => configCache.getOS();

export const getDisOS = (): { data?: string, error?: string } => configCache.getDisOS();

export const getCmd = (): { data?: string, error?: string } => configCache.getCmd();

export const getRoot = (): { data?: string, error?: string } => configCache.getRoot();

export const getDepFile = (): { data?: string, error?: string } => configCache.getDepFile();

export const getDepDir = (): { data?: string, error?: string } => configCache.getDepDir();
