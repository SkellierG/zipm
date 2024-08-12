import { fetchData } from './getDependencies.js';
import { update as cacheUpdate, getCmd, getOS } from './config/configCache.js';
import readline from 'readline';
import { exec as  execNonPromise } from 'child_process';

function exec(cmd, input) {
	console.log('runinggggggg');
	return new Promise((resolve, reject) => {
			execNonPromise(cmd, { input }, (error, stdout, stderr) => {
			if (error) return reject(error)
			if (stderr) return reject(stderr)
			resolve(stdout)
		})
	})
}

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.stdoutMuted = true;

rl._writeToOutput = function _writeToOutput(stringToWrite) {
	if (rl.stdoutMuted) {
		rl.output.write("\x1B[2K\x1B[200D"+rl.query+"["+((rl.line.length%2==1)?"=-":"-=")+"]");
	} else {
		rl.output.write(stringToWrite);
	}
};

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
			const isLinux = getOS().data === 'linux';
			console.log(isLinux)
			//const command = 'ls';
			//const command = `sudo dnf install -y unrar`;
			const command = `${cacheCmd.data} unrar`
			if (isLinux) {
				// rl.query = "Enter your SUDO password : ";
				// const password = await new Promise((resolve) => {
				// 	rl.question(rl.query, (pass) => {
				// 		console.log('\n')
				// 		rl.close();
				// 		resolve(pass);
				// 	});
				// });
				// console.log(password);
				// console.log(cacheCmd.data);
				const stdout = await exec(command)//, password)//, {
				console.log('stdout:', stdout)
				return stdout;
			} else {
				const stdout = await exec(command)
				console.log('stdout:', stdout)
				return stdout;
			}

		} catch (err) {
			return { data: undefined, error: err }
		}
	}
}

export default InstallDependencies;

console.log(await InstallDependencies.install())
//console.log(JSON.stringify(await InstallDependencies.install()))
