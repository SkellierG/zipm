import IParserStrategy from './interfaces/parser.strategy.interface.js'
import ISettingsCacheObserver from './interfaces/settings.cache.observer.interface.js'
import ISettingsFile from './interfaces/settings.file.interface.js'
import { readFileSync, writeFileSync } from 'fs'

export default class SettingsFileSubjectContext implements ISettingsFile {
  private cache: ISettingsCacheObserver;
  private parser: IParserStrategy;
  private path: string;

  public constructor(cache: ISettingsCacheObserver, parser: IParserStrategy, path: string) {
    this.cache = cache;
    this.parser = parser;
    this.path = path;
  }

  private update(content: object): void {
    this.cache.update(content);
  }

  public read(): object {
    let rawData: string = readFileSync(this.path, 'utf8');
    let parsedData = this.parser.rawToParsed(rawData);
    return this.parser.parsedToJSON(parsedData);
  }

  public write(newData: object): void {
    let originalData = this.read();
    let mergeData = this.parser.JSONtoParsed(newData);
    let finalParsedData = this.parser.mergeParsed(originalData, mergeData);
    let finalJSONData = this.parser.parsedToJSON(finalParsedData);
    let finalData = this.parser.parsedToRaw(finalParsedData);
    writeFileSync(this.path, finalData, 'utf8');
    this.update(finalJSONData);
  }

}
