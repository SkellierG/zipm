export default class SettingsCacheObserverSingleton {
    // private static instance: SettingsCacheObserverSingleton;
    //
    // getInstance(): SettingsCacheObserverSingleton {
    //   if (!SettingsCacheObserverSingleton.instance) {
    //     SettingsCacheObserverSingleton.instance = new SettingsCacheObserverSingleton
    //   } return SettingsCacheObserverSingleton.instance;
    // }
    update(content) {
        this.cachedData = content;
    }
    getCached(key) {
        const keyParts = key.split('.');
        let result = this.cachedData;
        for (let part of keyParts) {
            if (result && Object.prototype.hasOwnProperty.call(result, part)) {
                result = result[part];
            }
            else {
                return undefined;
            }
        }
        return (typeof result === 'object' && result !== null) ? JSON.parse(JSON.stringify(result)) : result;
    }
    getAll() {
        return this.cachedData;
    }
}
//# sourceMappingURL=settings.cache.observer.singleton.base.js.map