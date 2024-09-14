import { readFileSync, writeFileSync } from 'fs';
export default class SettingsFileSubjectContext {
    constructor(cache, parser, path) {
        this.cache = cache;
        this.parser = parser;
        this.path = path;
    }
    update(content) {
        this.cache.update(content);
    }
    read() {
        let rawData = readFileSync(this.path, 'utf8');
        let parsedData = this.parser.rawToParsed(rawData);
        return this.parser.parsedToJSON(parsedData);
    }
    write(newData) {
        let originalRawData = readFileSync(this.path, 'utf8');
        let originalParsedData = this.parser.rawToParsed(originalRawData);
        let mergeData = this.parser.JSONToParsed(newData);
        let finalParsedData = this.parser.mergeParsed(originalParsedData, mergeData);
        let finalJSONData = this.parser.parsedToJSON(finalParsedData);
        let finalData = this.parser.parsedToRaw(finalParsedData);
        writeFileSync(this.path, finalData, 'utf8');
        this.update(finalJSONData);
    }
}
//# sourceMappingURL=settings.file.subject.context.base.js.map