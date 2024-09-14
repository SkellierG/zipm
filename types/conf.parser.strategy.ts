import IParserStrategy, { ParsedEntry } from './interfaces/parser.strategy.interface.js'

export default class ConfParserStrategy implements IParserStrategy {

  public rawToParsed(rawContent: string): ParsedEntry[] {
    const lines = rawContent.toString().split('\n');
    let result: ParsedEntry[] = [];
    let currentSection: string | null = null;

    lines.forEach(line => {
      if (line.startsWith('#')) {
        result.push({ type: 'comment', value: line });
      } else if (line.trim() === '') {
        result.push({ type: 'space', value: '' });
      } else if (line.startsWith('[') && line.endsWith(']')) {
        currentSection = line.slice(1, -1).trim();
        result.push({ type: 'section', name: currentSection });
      } else {
        const [key, value] = line.split('=');
        if (key && value) {
          result.push({
            type: 'entry',
            key: key.toLowerCase().trim(),
            value: value.trim(),
            section: currentSection
          });
        } else {
          result.push({ type: 'invalid', value: line });
        }
      }
    });

    return result;
  }

  public parsedToRaw(parsedContent: ParsedEntry[]): string {
    return parsedContent.map(entry => {
      if (entry.type === 'comment') {
        return entry.value || '';
      } else if (entry.type === 'space') {
        return '';
      } else if (entry.type === 'section') {
        return `[${entry.name}]`;
      } else if (entry.type === 'entry') {
        return `${entry.key?.toUpperCase()}=${entry.value}`;
      }
      return '';
    }).join('\n');
  }

  public parsedToJSON(parsedContent: ParsedEntry[]): Record<string, any> {
    return parsedContent.reduce((result: Record<string, any>, entry: ParsedEntry) => {
      if (entry.type === 'entry') {
        let currentSection = result;
        if (entry.section) {
          const sectionParts = entry.section.split('.');
          sectionParts.forEach((part, index) => {
            if (!currentSection[part]) {
              currentSection[part] = {};
            }
            currentSection = currentSection[part];
          });
        }
        if (entry.key && entry.value) {
          currentSection[entry.key] = entry.value;
        }
      }
      return result;
    }, {});
  }

  public JSONToParsed(JSONContent: Record<string, any>): ParsedEntry[] {
    const result: ParsedEntry[] = [];

    const processSection = (section: Record<string, any>, sectionName: string | null) => {
      if (sectionName) {
        result.push({ type: 'section', name: sectionName });
      }

      Object.entries(section).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          processSection(value, sectionName ? `${sectionName}.${key}` : key);
        } else {
          result.push({
            type: 'entry',
            key: key.toLowerCase(),
            value: String(value),
            section: sectionName || null
          });
        }
      });
    };

    processSection(JSONContent, null);
    return result;
  }

  public mergeParsed(originalContent: ParsedEntry[], mergeContent: ParsedEntry[]): ParsedEntry[] {
    const updateMap = new Map<string, ParsedEntry>();

    mergeContent.forEach(entry => {
      if (entry.type === 'entry') {
        const key = entry.section ? `${entry.section}.${entry.key}` : entry.key;
        if (key) {
          updateMap.set(key, entry);
        }
      }
    });

    const result: ParsedEntry[] = [];

    originalContent.forEach(entry => {
      if (entry.type === 'entry') {
        const key = entry.section ? `${entry.section}.${entry.key}` : entry.key;
        if (key && updateMap.has(key)) {
          result.push({ ...entry, value: updateMap.get(key)?.value });
          updateMap.delete(key);
        } else {
          result.push(entry);
        }
      } else {
        result.push(entry);
      }
    });

    mergeContent.forEach(entry => {
      const key = entry.section ? `${entry.section}.${entry.key}` : entry.key;
      if (entry.type === 'entry' && key && !result.some(e => e.key === entry.key && e.section === entry.section)) {
        result.push(entry);
      }
    });

    return result;
  }
}
