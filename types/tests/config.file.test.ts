// settings.file.subject.context.base.test.ts
import SettingsFileSubjectContext from '../settings.file.subject.context.base.ts';
import ConfParserStrategy from '../conf.parser.strategy.ts';
import ConfigCacheObserverSingleton from '../config.cache.observer.singleton.ts';
import PathUtilities from '../common/path.common.ts';
import { ParsedEntry } from '../interfaces/parser.strategy.interface.ts'
import { readFileSync, writeFileSync } from 'fs';

// Mockeamos todas las dependencias
jest.mock('fs');
jest.mock('../conf.parser.strategy.ts');
jest.mock('../config.cache.observer.singleton.ts');
jest.mock('../common/path.common.ts');

describe('SettingsFileSubjectContext', () => {
  let configFileContext: SettingsFileSubjectContext;
  let mockParser: jest.Mocked<ConfParserStrategy>;
  let mockCache: jest.Mocked<ConfigCacheObserverSingleton>;

  beforeEach(() => {
    // Mock de las dependencias
    mockCache = {
      update: jest.fn(),
      getCached: jest.fn(),
      getAll: jest.fn(),
    } as any;

    mockParser = {
      rawToParsed: jest.fn(),
      parsedToRaw: jest.fn(),
      parsedToJSON: jest.fn(),
      JSONToParsed: jest.fn(),
      mergeParsed: jest.fn(),
    } as any;

    (ConfigCacheObserverSingleton.getInstance as jest.Mock).mockReturnValue(mockCache);
    (PathUtilities.getConfigFilePath as jest.Mock).mockReturnValue('/mock/path/config.conf');

    // Instancia de la clase con dependencias mockeadas
    configFileContext = new SettingsFileSubjectContext(mockCache, mockParser, '/mock/path/config.conf');
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
    jest.resetAllMocks()
  });

  test('debe leer y parsear correctamente el archivo de configuración', () => {
    const mockRawData = 'KEY1=value1';
    const mockParsedData: ParsedEntry[] = [{ type: 'entry', key: 'key1', value: 'value1' }];
    const mockJSONData = { key1: 'value1' };

    // Mock de fs y parser
    (readFileSync as jest.Mock).mockReturnValue(mockRawData);
    mockParser.rawToParsed.mockReturnValue(mockParsedData);
    mockParser.parsedToJSON.mockReturnValue(mockJSONData);
    mockCache.update(mockJSONData);
    mockCache.getAll.mockReturnValue({});

    // Ejecuta la función read
    const result = configFileContext.read();

    // Aserciones
    expect(readFileSync).toHaveBeenCalledWith('/mock/path/config.conf', 'utf8');
    expect(mockParser.rawToParsed).toHaveBeenCalledWith(mockRawData);
    expect(mockParser.parsedToJSON).toHaveBeenCalledWith(mockParsedData);
    expect(mockCache.update).toHaveBeenCalledWith(mockJSONData);
    expect(result).toEqual(mockJSONData);
  });

  test('debe escribir y actualizar correctamente el archivo de configuración', () => {
    const mockOriginalRawData = 'KEY1=value1';
    const mockOriginalParsedData: ParsedEntry[] = [{ type: 'entry', key: 'key1', value: 'value1' }];
    const mockNewData = { key2: 'value2' };
    const mockMergeParsedData: ParsedEntry[] = [
      { type: 'entry', key: 'key1', value: 'value1' },
      { type: 'entry', key: 'key2', value: 'value2' },
    ];
    const mockFinalRawData = 'KEY1=value1\nKEY2=value2';
    const mockFinalJSONData = { key1: 'value1', key2: 'value2' };

    // Mock de fs, parser y caché
    (readFileSync as jest.Mock).mockReturnValue(mockOriginalRawData);
    mockParser.rawToParsed.mockReturnValue(mockOriginalParsedData);
    mockParser.JSONToParsed.mockReturnValue(mockMergeParsedData);
    mockParser.mergeParsed.mockReturnValue(mockMergeParsedData);
    mockParser.parsedToRaw.mockReturnValue(mockFinalRawData);
    mockParser.parsedToJSON.mockReturnValue(mockFinalJSONData);

    // Ejecuta la función write
    configFileContext.write(mockNewData);

    // Aserciones
    expect(readFileSync).toHaveBeenCalledWith('/mock/path/config.conf', 'utf8');
    expect(mockParser.rawToParsed).toHaveBeenCalledWith(mockOriginalRawData);
    expect(mockParser.JSONToParsed).toHaveBeenCalledWith(mockNewData);
    expect(mockParser.mergeParsed).toHaveBeenCalledWith(mockOriginalParsedData, mockMergeParsedData);
    expect(mockParser.parsedToRaw).toHaveBeenCalledWith(mockMergeParsedData);
    expect(writeFileSync).toHaveBeenCalledWith('/mock/path/config.conf', mockFinalRawData, 'utf8');
    expect(mockCache.update).toHaveBeenCalledWith(mockFinalJSONData);
  });
});
