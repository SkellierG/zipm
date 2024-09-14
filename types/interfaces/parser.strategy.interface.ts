export interface ParsedEntry {
  type: 'comment' | 'space' | 'section' | 'entry' | 'invalid';
  value?: string;
  name?: string;
  key?: string;
  section?: string | null;
}

export default interface IParserStrategy {
  rawToParsed(rawContent: string): ParsedEntry[];

  parsedToRaw(parsedContent: ParsedEntry[]): string;

  parsedToJSON(parsedContent: ParsedEntry[]): Record<string, any>;

  JSONToParsed(JSONContent: Record<string, any>): ParsedEntry[];

  mergeParsed(originalContent: ParsedEntry[], mergeContent: ParsedEntry[]): ParsedEntry[];
}
