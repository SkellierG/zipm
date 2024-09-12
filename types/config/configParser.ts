class ConfigParser {

    static stringToParse(data) {
      const lines = data.toString().split('\n');
      let result = [];

      lines.forEach(line => {
        if (line.startsWith('#')) {
          result.push({ type: 'comment', value: line });
        } else if (line.trim() === '') {
          result.push({ type: 'space', value: '' });
        } else {
          const [key, value] = line.split('=');
          if (key && value) {
            result.push({ type: 'entry', key: key.toLowerCase().trim(), value: value.trim() });
          }
        }
      });

      return result;
    }

    static parseToString(updated) {
      return updated.map(entry => {
        if (entry.type === 'comment' || entry.type === 'space') {
          return entry.value;
        } else if (entry.type === 'entry') {
            return `${entry.key.toUpperCase()}=${entry.value}`;
        }
        return '';
      }).join('\n');
    }

    static getEntries(parsed) {
      return parsed.reduce((result, entry) => {
        if (entry.type === 'entry') {
          result[entry.key] = entry.value;
        }
        return result;
      }, {});
    }

    static mergeChanges(original, update) {
        const updateMap = new Map();

        update.forEach(entry => {
            if (entry.type === 'entry') {
                updateMap.set(entry.key, entry);
            }
        });

        const resultArray = [];

        original.forEach(entry => {
            if (entry.type === 'entry' && updateMap.has(entry.key)) {
                resultArray.push({ ...entry, value: updateMap.get(entry.key).value });
            } else if (entry.type === 'comment' || entry.type === 'space') {
                resultArray.push(entry);
            }
        });

        update.forEach(entry => {
            if (entry.type === 'entry' && !resultArray.some(e => e.key === entry.key)) {
                resultArray.push(entry);
            } else if ((entry.type === 'comment') && !resultArray.some(e => e.value === entry.value)) {
                resultArray.push(entry);
            } else if (entry.type === 'space') {
                resultArray.push(entry)
            }
        });

        //console.log(JSON.stringify(resultArray, null, 2));
        return resultArray;
    }


  }
  
export default ConfigParser;

export const stringToParse = (data) => ConfigParser.stringToParse(data);

export const parseToString = (updated) => ConfigParser.parseToString(updated);

export const getEntries = (parsed) => ConfigParser.getEntries(parsed);

export const mergeChanges = (original, update) => ConfigParser.mergeChanges(original, update)
