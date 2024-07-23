import ConfigSetup from './commands/configSetup.js';
import ConfigCache from './commands/configCache.js';

async function run() {
  const result = await ConfigSetup.init();
  const cache = await ConfigCache.update();
  
  if (result.error) {
    console.error('Initialization error:', JSON.stringify(result.error));
  } else {
    console.log('Initialization successful:', JSON.stringify(result.data));
  }

  if (cache.error) {
    console.error('cache error:', JSON.stringify(cache.error));
  } else {
    console.log('cache successful:', JSON.stringify(cache.data));
  }
}

run();
