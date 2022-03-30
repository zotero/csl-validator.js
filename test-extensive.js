let validate = require('./csl-validator.js');
let fs = require('fs/promises');

(async () => {
	let files = await fs.readdir('../styles');
	let i = 21;
	for (let file of files) {
		if (i > 20) {
			let mp = require.resolve('./csl-validator.js');
			if (require.cache[mp]) {
				delete require.cache[mp]	
			}
			validate = null;
			validate = require('./csl-validator.js');
			i = 0;
		}
		if (!file.endsWith('.csl')) continue;
		let content;
		try {
			content = await fs.readFile(`../styles/${file}`, {encoding: "utf-8"});
		} catch (e) {
			continue;
		}
		// console.log(file);
		var errors = await validate(content);
		i++;
		if (errors) {
			console.error(`Test failed for file ${file}`);
			console.error(errors);
		}
		else {
			// console.log(`Test successful for ${file}`);
		}
	}
	console.log("Tests passed");
	process.exit(0);
})();
