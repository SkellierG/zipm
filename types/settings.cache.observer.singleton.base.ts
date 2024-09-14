import ISettingsCacheObserver from './interfaces/settings.cache.observer.interface.js'

export default abstract class SettingsCacheObserverSingleton implements ISettingsCacheObserver {
  private cachedData: any;
  private static instace: ISettingsCacheObserver;

  abstract getInstance(): ISettingsCacheObserver;

  // private static instance: SettingsCacheObserverSingleton;
  //
  // getInstance(): SettingsCacheObserverSingleton {
  //   if (!SettingsCacheObserverSingleton.instance) {
  //     SettingsCacheObserverSingleton.instance = new SettingsCacheObserverSingleton
  //   } return SettingsCacheObserverSingleton.instance;
  // }

  public update(content: object): void {
    this.cachedData = content;
  }

  public getCached(key: string): any {
    return this.cachedData[key];
  }

  public getAll(): object {
    return this.cachedData;
  }

}
