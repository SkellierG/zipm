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
     * Merges updates into the original configuration entries.
     * 
     * This function updates the `original` array with the values from the `update` array. 
     * If an entry of type `'entry'` in `update` has the same key as an entry in `original`, 
     * the value in `original` is updated. Entries of type `'comment'` and `'space'` from 
     * `update` are added if they are not already present in the `original` array. 
     * New entries from `update` that are not present in `original` are also added.
     *
     * @param {Array<object>} original - The original array of configuration entries. 
     * Each entry is an object with a `type` (e.g., `'entry'`, `'comment'`, or `'space'`) 
     * and associated `key` and `value` if applicable.
     * 
     * @param {Array<object>} update - The array of updates to be merged. 
     * Each entry is an object with a `type` (e.g., `'entry'`, `'comment'`, or `'space'`) 
     * and associated `key` and `value` if applicable. For `'entry'` types, `key` is used 
     * to match and update existing entries in `original`. For `'comment'` and `'space'` 
     * types, these entries are added if they are not present in `original`.
     *
     * @returns {Array<object>} - The updated array of configuration entries. 
     * The resulting array includes all entries from `original`, updated with values 
     * from `update`, and any new entries from `update` that were not present in `original`. 
     * Comments and spaces are preserved and added as needed.
     */
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
 * Merges updates into the original configuration entries.
 * 
 * This function updates the `original` array with the values from the `update` array. 
 * If an entry of type `'entry'` in `update` has the same key as an entry in `original`, 
 * the value in `original` is updated. Entries of type `'comment'` and `'space'` from 
 * `update` are added if they are not already present in the `original` array. 
 * New entries from `update` that are not present in `original` are also added.
 *
 * @param {Array<object>} original - The original array of configuration entries. 
 * Each entry is an object with a `type` (e.g., `'entry'`, `'comment'`, or `'space'`) 
 * and associated `key` and `value` if applicable.
 * 
 * @param {Array<object>} update - The array of updates to be merged. 
 * Each entry is an object with a `type` (e.g., `'entry'`, `'comment'`, or `'space'`) 
 * and associated `key` and `value` if applicable. For `'entry'` types, `key` is used 
 * to match and update existing entries in `original`. For `'comment'` and `'space'` 
 * types, these entries are added if they are not present in `original`.
 *
 * @returns {Array<object>} - The updated array of configuration entries. 
 * The resulting array includes all entries from `original`, updated with values 
 * from `update`, and any new entries from `update` that were not present in `original`. 
 * Comments and spaces are preserved and added as needed.
 */
export const mergeChanges = (original, update) => ConfigParser.mergeChanges(original, update)