import SettingsFileSubjectContext from './settings.file.subject.context.base.js'
import ConfParserStrategy from './conf.parser.strategy.js'
import ConfigCacheObserverSingleton from './config.cache.observer.singleton.js'
import PathUtilities from './common/path.common.js'

const ConfigFileSubjectContext: SettingsFileSubjectContext = new SettingsFileSubjectContext(
  ConfigCacheObserverSingleton.getInstance(),
  new ConfParserStrategy(),
  PathUtilities.getConfigFilePath()
);

export default ConfigFileSubjectContext;
