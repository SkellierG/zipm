import { getOS } from "./config/configCache.js";
import { $ } from 'execa';

/**
 * Class for testing dependencies.
 */
class TesterDep {

    /**
     * Tests whether each dependency from the list is installed on the system.
     * @param {Array} dependencies - List of dependencies to test.
     * @returns {Promise<{ data: { installed: Array, uninstalled: Array } | undefined, error: string | undefined }>}
     */
    static async testDependencies(dependencies) {
        try {
            const results = {
                installed: [],
                uninstalled: []
            };

            for await (const result of this._asyncGenerator(dependencies)) {
                if (result.installed) {
                    results.installed.push(result.item);
                } else {
                    results.uninstalled.push(result.item);
                }
            }
            return { data: results, error: undefined };
        } catch (err) {
            return { data: undefined, error: err.message };
        }
    }

    /**
     * Asynchronous generator that processes each dependency item.
     * @param {Array} items - An array of dependency objects to be processed.
     * @returns {AsyncGenerator<{ item: Object, installed: boolean }>} 
     */
    static async *_asyncGenerator(items) {
        for (const item of items) {
            try {
                yield await this._processItem(item);
            } catch (err) {
                // Handle error for this specific item and continue
                yield { item, installed: false };
            }
        }
    }

    /**
     * Processes a dependency object by validating its format and testing if it's installed.
     * @param {Object} item - A dependency object to be processed.
     * @returns {Promise<{ item: Object, installed: boolean }>}
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
     */
    static async _testing(item) {
        try {
            const osResult = await getOS();
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
            return { data: undefined, error: `Failed to find ${item.name_install}: ${err.message}` };
        }
    }

    /**
     * Validates the format and required fields of a dependency object.
     * @param {Object} dep - A dependency object containing information about a dependency.
     * @returns {{ data: string | undefined, error: string | undefined }}
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
}

export default TesterDep;
