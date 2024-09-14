import SettingsCacheObserverSingleton from './settings.cache.observer.singleton.base.js'

export default class ConfigCacheObserverSingleton extends SettingsCacheObserverSingleton {
  private static instance: ConfigCacheObserverSingleton;

  public static getInstance(): ConfigCacheObserverSingleton {
    if (!ConfigCacheObserverSingleton.instance) {
      ConfigCacheObserverSingleton.instance = new ConfigCacheObserverSingleton
    } return ConfigCacheObserverSingleton.instance;
  }
}