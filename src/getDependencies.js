import fs from 'fs';
import path from 'path';
import configCache from './config/configCache.js';
import TesterDep from './testerDependencies.js';

/**
 * A class for managing dependency retrieval and testing.
 */
class GetDependencies {
    static dep;
    static cache = configCache;
    static tester = TesterDep;

    /**
     * Retrieves and verifies the list of dependencies by first fetching the list
     * and then checking their installation status.
     * @returns {Promise<{ data: Array | undefined, error: Object | undefined }>}
     */
    static async fetchData() {
        try {
            const results = {
                getListOfDependencies: await this._getListOfDependencies(),
                testInstalledDependencies: await this._testInstalledDependencies()
            };

            const allSuccessful = Object.values(results).every(result => !result.error);
            return allSuccessful
                ? { data: results.testInstalledDependencies.data, error: undefined }
                : { data: undefined, error: results };
        } catch (error) {
            return { data: undefined, error: { general: error.message } };
        }
    }

    /**
     * Reads and parses the dependencies file to obtain the list of dependencies.
     * @returns {Promise<{ data: Array | undefined, error: string | undefined }>}
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
     */
    static async _testInstalledDependencies() {
        const depResult = await this._getListOfDependencies();
        if (depResult.error) {
            return { data: undefined, error: depResult.error };
        }

        if (!this.dep) {
            return { data: undefined, error: 'Dependencies are not loaded' };
        }

        const { data: testData, error: testError } = await this.tester.testDependencies(this.dep);
        if (testError) {
            return { data: undefined, error: testError };
        }

        return { data: testData, error: undefined };
    }
}

export default GetDependencies;

/**
 * Function to fetch the list of dependencies and their installation status.
 * @returns {Promise<{ data: Array | undefined, error: Object | undefined }>}
 */
export const fetchData = () => GetDependencies.fetchData();
