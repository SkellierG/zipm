/**
 * Class for parsing and formatting configuration file data.
 */
class ConfigParser {
    /**
     * Parses the configuration file contents into an array of entries.
     * @param {string} data - The raw configuration file data.
     * @returns {Array<object>} An array of parsed configuration entries.
     */
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
  
    /**
     * Converts the updated configuration entries into a string format.
     * @param {Array<object>} updated - An array of updated configuration entries.
     * @returns {string} The string representation of the configuration file.
     */
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
  
    /**
     * Converts parsed configuration entries into an object with key-value pairs.
     * @param {Array<object>} parsed - An array of parsed configuration entries.
     * @returns {object} An object with key-value pairs from the configuration entries.
     */
    static getEntries(parsed) {
      return parsed.reduce((result, entry) => {
        if (entry.type === 'entry') {
          result[entry.key] = entry.value;
        }
        return result;
      }, {});
    }

    /**
    * Updates configuration entries.
    * @param {Array<object>} original - Original entries.
    * @param {object} update - Key-value pairs to update.
    * @returns {Array<object>} Updated entries.
    */
    static mergeChanges(original, update) {
        return original.map(entry => {
        if (entry.type === 'entry' && update.hasOwnProperty(entry.key)) {
            return { ...entry, value: update[entry.key] };
        }
        return entry;
        });
    }
  }
  
export default ConfigParser;

/**
 * Parses the configuration file contents into an array of entries.
 * @param {string} data - The raw configuration file data.
 * @returns {Array<object>} An array of parsed configuration entries.
 */
export const stringToParse = (data) => ConfigParser.stringToParse(data);

/**
 * Converts the updated configuration entries into a string format.
 * @param {Array<object>} updated - An array of updated configuration entries.
 * @returns {string} The string representation of the configuration file.
 */
export const parseToString = (updated) => ConfigParser.parseToString(updated);

/**
 * Converts parsed configuration entries into an object with key-value pairs.
 * @param {Array<object>} parsed - An array of parsed configuration entries.
 * @returns {object} An object with key-value pairs from the configuration entries.
 */
export const getEntries = (parsed) => ConfigParser.getEntries(parsed);

/**
* Updates configuration entries.
* @param {Array<object>} original - Original entries.
* @param {object} update - Key-value pairs to update.
* @returns {Array<object>} Updated entries.
*/
export const mergeChanges = (original, update) => ConfigParser.mergeChanges(original, update)