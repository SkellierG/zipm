import SettingsCacheObserverSingleton from './settings.cache.observer.singleton.base.js';
export default class ConfigCacheObserverSingleton extends SettingsCacheObserverSingleton {
    constructor() { super(); }
    static getInstance() {
        if (!ConfigCacheObserverSingleton.instance) {
            ConfigCacheObserverSingleton.instance = new ConfigCacheObserverSingleton;
        }
        return ConfigCacheObserverSingleton.instance;
    }
}
//# sourceMappingURL=config.cache.observer.singleton.js.map