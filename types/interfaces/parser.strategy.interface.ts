export default interface IParserStrategy {
  rawToParsed(rawContent: string): object

  parsedToRaw(parsedContent: object): string

  parsedToJSON(parsedContent: object): object

  JSONtoParsed(JSONContent: object): object

  mergeParsed(originalContent: object, mergeContent: object): object
}
