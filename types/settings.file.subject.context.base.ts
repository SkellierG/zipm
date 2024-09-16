import IParserStrategy, { ParsedEntry } from './interfaces/parser.strategy.interface.ts'
import ISettingsCacheObserver from './interfaces/settings.cache.observer.interface.ts'
import ISettingsFile from './interfaces/settings.file.interface.ts'
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

  public read(): Record<string, any> {
    let rawData: string = readFileSync(this.path, 'utf8');
    let parsedData: ParsedEntry[] = this.parser.rawToParsed(rawData);
    return this.parser.parsedToJSON(parsedData);
  }

  public write(newData: Record<string, any>): void {
    let originalRawData: string = readFileSync(this.path, 'utf8');
    let originalParsedData: ParsedEntry[] = this.parser.rawToParsed(originalRawData);
    let mergeData: ParsedEntry[] = this.parser.JSONToParsed(newData);
    let finalParsedData: ParsedEntry[] = this.parser.mergeParsed(originalParsedData, mergeData);
    let finalJSONData: Record<string, any> = this.parser.parsedToJSON(finalParsedData);
    let finalData: string = this.parser.parsedToRaw(finalParsedData);
    writeFileSync(this.path, finalData, 'utf8');
    this.update(finalJSONData);
  }

}
