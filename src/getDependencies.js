import fs from 'fs';
import path from 'path';
import configCache from './config/configCache.js';
import { $ } from 'execa';

// Ensure that the cache is updated before using this class

/**
 * A class for managing dependency retrieval and testing.
 */
class GetDependencies {
    static dep;
    static cache = configCache;
    static init = configCache.updateCache();

    /**
     * Retrieves and verifies the list of dependencies by first fetching the list and then checking their installation status.
     * @returns {Promise<{ data: Array | undefined, error: Object | undefined }>} 
     * - `data`: An array of installed dependencies if all operations are successful.
     * - `error`: An object containing errors for each operation if any occurred.
     */
    static async fetchData() {
        const results = {
            getListOfDependencies: await this._getListOfDependencies(),
            testInstalledDependencies: await this._testInstalledDependencies()
        };


        const allSuccessful = Object.values(results).every(result => !result.error);
        if (!allSuccessful) {
            return { data: undefined, error: results };
        }
        
        return { data: results.testInstalledDependencies.data, error: undefined };
    }

    /**
     * Reads and parses the dependencies file to obtain the list of dependencies.
     * @returns {Promise<{ data: Array | undefined, error: string | undefined }>}
     * - `data`: An array of dependency objects parsed from the file.
     * - `error`: An error message if there was an issue reading or parsing the file.
     */
    static async _getListOfDependencies() {
        try {
            const depDirResult = this.cache.getDepDir();
            if (depDirResult.error) {
                return { data: undefined, error: `Failed to get dependency directory: ${depDirResult.error}` };
            }
            const depFileResult = this.cache.getDepFile();
            if (depFileResult.error) {
                return { data: undefined, error: `Failed to get dependency file name: ${depFileResult.error}` };
            }

            const depListPath = path.join(depDirResult.data, depFileResult.data);
            const depListContent = await fs.promises.readFile(depListPath, 'utf8');
            this.dep = JSON.parse(depListContent).dependencies;

            return { data: this.dep, error: undefined };
        } catch (error) {
            return { data: undefined, error: `Failed to read dependencies file: ${error.message}` };
        }
    }

    /**
     * Tests whether each dependency from the list is installed on the system.
     * @returns {Promise<{ data: { installed: Array, uninstalled: Array } | undefined, error: string | undefined }>}
     * - `data`: An object with two arrays: `installed` and `uninstalled`, listing dependencies based on their installation status.
     * - `error`: An error message if there was an issue testing the dependencies.
     */
    static async _testInstalledDependencies() {
        const results = {
            installed: [],
            uninstalled: []
        };

        const depResult = await this._getListOfDependencies();
        if (depResult.error) {
            return { data: undefined, error: depResult.error };
        }

        if (!this.dep) {
            return { data: undefined, error: 'Dependencies are not loaded' };
        }

        try {
            for await (const result of this._asyncGenerator(this.dep)) {
                if (result.installed) {
                    results.installed.push(result.item);
                } else {
                    results.uninstalled.push(result.item);
                }
            }
        } catch (error) {
            return { data: undefined, error: `Testing dependencies failed: ${error.message}` };
        }

        return { data: results, error: undefined };
    }

    /**
     * Validates the format and required fields of a dependency object.
     * @param {Object} dep - A dependency object containing information about a dependency.
     * @returns {{ data: string | undefined, error: string | undefined }}
     * - `data`: Success message if the dependency format is valid.
     * - `error`: An error message if any required fields are missing or the format is incorrect.
     */
    static _validateDependenciesAndFormats(dep) {
        const requiredKeys = ['name', 'name_install', 'description', 'extensions'];
        for (const key of requiredKeys) {
            if (!(key in dep)) {
                return { data: undefined, error: `Missing required key "${key}" in dependency ${JSON.stringify(dep)}` };
            }
        }

        if (!Array.isArray(dep.extensions)) {
            return { data: undefined, error: `Extensions should be an array in dependency ${JSON.stringify(dep)}` };
        }

        if (dep.extensions.some(ext => typeof ext !== 'string')) {
            return { data: undefined, error: `All extensions should be strings in dependency ${JSON.stringify(dep)}` };
        }

        if (typeof dep.name !== 'string' || typeof dep.name_install !== 'string' || typeof dep.description !== 'string') {
            return { data: undefined, error: `Name, name_install, and description should be strings in dependency ${JSON.stringify(dep)}` };
        }

        return { data: 'All dependencies have valid formats', error: undefined };
    }

    /**
     * Processes a dependency object by validating its format and testing if it's installed.
     * @param {Object} item - A dependency object to be processed.
     * @returns {Promise<{ item: Object, installed: boolean }>}
     * - `item`: The processed dependency object.
     * - `installed`: `true` if the dependency is installed, `false` otherwise.
     */
    static async _processItem(item) {
        const { data: validationData, error: validationError } = this._validateDependenciesAndFormats(item);
        if (validationError) {
            throw new Error(validationError);
        }

        const { data: testData, error: testError } = await this._testing(item);
        if (testError) {
            return { item, installed: false };
        }
        return { item, installed: true };
    }

    /**
     * Tests whether a specific dependency is installed on the system.
     * @param {Object} item - A dependency object representing the dependency to be tested.
     * @returns {Promise<{ data: string | undefined, error: string | undefined }>}
     * - `data`: Success message if the dependency is found.
     * - `error`: An error message if the test fails.
     */
    static async _testing(item) {
        try {
            const osResult = this.cache.getOS();
            if (osResult.error) {
                return { data: undefined, error: `Failed to get OS: ${osResult.error}` };
            }

            if (osResult.data === 'win32') {
                await $`where ${item.name_install}`;
            } else {
                await $`which ${item.name_install}`;
            }

            return { data: 'success', error: undefined };
        } catch (err) {
            return { data: undefined, error: err.message };
        }
    }

    /**
     * Asynchronous generator that processes each dependency item.
     * @param {Array} items - An array of dependency objects to be processed.
     * @returns {AsyncGenerator<{ item: Object, installed: boolean }>} An asynchronous iterator yielding processed dependency objects.
     */
    static async *_asyncGenerator(items) {
        for (const item of items) {
            try {
                yield await this._processItem(item);
            } catch (err) {
                throw err; // Propagate the error to stop the iteration
            }
        }
    }
}

export default GetDependencies;

/**
 * Function to fetch the list of dependencies and their installation status.
 * @returns {Promise<{ data: Array | undefined, error: Object | undefined }>}
 * - `data`: An array of installed and uninstalled dependencies if successful.
 * - `error`: An object containing errors if any occurred.
 */
export const fetchData = () => GetDependencies.fetchData();
