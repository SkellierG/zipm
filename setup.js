import ConfigInitializer from './commands/configSetup.js';

async function run() {
  const result = await ConfigInitializer.init();
  
  if (result.error) {
    console.error('Initialization error:', result.error);
  } else {
    console.log('Initialization successful:', result.data);
  }
}

run();
