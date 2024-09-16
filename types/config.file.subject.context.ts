import SettingsFileSubjectContext from './settings.file.subject.context.base.ts'
import ConfParserStrategy from './conf.parser.strategy.ts'
import ConfigCacheObserverSingleton from './config.cache.observer.singleton.ts'
import PathUtilities from './common/path.common.ts'

const ConfigFileSubjectContext: SettingsFileSubjectContext = new SettingsFileSubjectContext(
  ConfigCacheObserverSingleton.getInstance(),
  new ConfParserStrategy(),
  PathUtilities.getConfigFilePath()
);

export default ConfigFileSubjectContext;
