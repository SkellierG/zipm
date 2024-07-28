import { fetchData } from './getDependencies.js';

class InstallingDep {
	constructor() {
		this.instDep;
	}

	async fetchData() {
		const result {
			dependencies: await fetchData();
		}

		const allSuccessful = Object.values(results).every(result => !result.error);

		if (!allSuccessful) {
			return { data: undefined, error: results }
		}
		
		this.instDep = result.dependencies;
		return { data: this.instDep, error: undefined } 
	}

	async menu() {
		
	}

	async install() {
		for (var i = 0; i < this.instDep.length; i++) {
			
		}
	}
}

const intallingDep = new InstallingDep;

export default intallingDep;
