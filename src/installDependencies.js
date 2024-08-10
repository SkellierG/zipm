import { fetchData } from './getDependencies.js';
import { update as cacheUpdate, getCmd } from './config/configCache.js';
import readline from 'readline';
import { $ } from 'execa';
import { exec } from 'child_process'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

await cacheUpdate();

class InstallDependencies {
	static depList;

	static async fetchData() {
		const results = {
			dependencies: await fetchData()
		}

		const allSuccessful = Object.values(results).every(result => !result.error);

		if (!allSuccessful) {
			return { data: undefined, error: results }
		}
		
		this.depList = results.dependencies.data;
		return { data: this.depList, error: undefined } 
	}

	static async menu() {
		
	}

	static async install() {
		const getDepList = await this.fetchData();
		if (getDepList.error) {
			return { data: undefined, error: getDepList.error }
		}
		const cacheCmd = getCmd();
		if (cacheCmd.error) {
			return { data: undefined, error: cacheCmd.error }
		}
		if (!this.depList) {
			return { data: undefined, error: 'depList is undefined' }
		}

		try {
			// const password = await await new Promise((resolve) => {
			//     rl.question('Enter your password: ', (pass) => {
			//       	rl.close();
			//       	resolve(pass);
			//     });
			// });
			const password = '';

			//const command = `${cacheCmd.data} install ${this.depList.uninstalled[i].name_install}`;
			const command = `${cacheCmd.data} install -y 7zip`;
			const { stdout } = await exec(command, {
				input: `${password}\n`,
				stdio: 'inherit'
			});

		} catch (err) {
			return { data: undefined, error: err }
		}
	}
}

export default InstallDependencies;

console.log(await InstallDependencies.install())
console.log(JSON.stringify(await InstallDependencies.install()))
