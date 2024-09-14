export default interface ISettingsCacheObserver {
  // cachedData: object
  // instance: ISettingsCacheObserverSingleton
  update(content: object): void

  getCached(key: string): any

  getAll(): object
}
