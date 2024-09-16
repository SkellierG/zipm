import ISettingsCacheObserver from './interfaces/settings.cache.observer.interface.ts'

export default abstract class SettingsCacheObserverSingleton implements ISettingsCacheObserver {
  private cachedData: any;
  private static instace: SettingsCacheObserverSingleton;

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
    const keyParts = key.split('.');
    let result = this.cachedData;

    for (let part of keyParts) {
      if (result && Object.prototype.hasOwnProperty.call(result, part)) {
        result = result[part];
      } else {
        return undefined;
      }
    }

    return (typeof result === 'object' && result !== null) ? JSON.parse(JSON.stringify(result)) : result;
  }

  public getAll(): object {
    return this.cachedData;
  }
}
