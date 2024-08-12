import { fetchData } from '../src/getDependencies.js'
import Cache from '../src/config/configCache.js';

await Cache.update();

console.log(await fetchData());
console.log(JSON.stringify(await fetchData()));

console.log(Cache.getOS())
console.log(await Cache)
console.log(await Cache.update())
console.log(JSON.stringify(await Cache))