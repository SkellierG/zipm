import { setup } from './src/config/configSetup.js';
import { update } from './src/config/configCache.js';

async function run() {
  const result = await setup();
  const cache = await update();
  
  if (result.error) {
    console.error('Initialization error:', JSON.stringify(result.error));
  } else {
    console.log('Initialization successful:', JSON.stringify(result.data));
    console.log('Initialization successful:', result.data);
  }

  if (cache.error) {
    console.error('cache error:', JSON.stringify(cache.error));
  } else {
    console.log('cache successful:', JSON.stringify(cache.data));
    console.log('cache successful:', cache.data);
  }
}

run();
