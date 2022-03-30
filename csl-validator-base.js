/*
	***** BEGIN LICENSE BLOCK *****
	
	Copyright © 2022 Corporation for Digital Scholarship
                     Vienna, Virginia, USA
					http://zotero.org
	
	This file is part of Zotero.
	
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
	
	***** END LICENSE BLOCK *****
*/

(function() {

/**
 * Runs the Relax NG Compact Syntax Validator compiled from C++ to JS
 * with csl.rs and specified string CSL
 * 
 * @param string {String} A string containing a CSL style to be validated
 * @returns {string}
 */
var validate = async function(string) {
	const Module = {
		arguments: ["-q", "csl.rnc", "style.xml"],
		preRun: [async () => {
			const depName = 'initializing-rnc-fs';
			Module.addRunDependency(depName);
			for (var file in cslSchemaFiles) {
				await Module.FS.writeFile(file, cslSchemaFiles[file]);
			}
			await Module.FS.writeFile('style.xml', string);
			Module.removeRunDependency(depName);
		}],
		stdout: function(code) {
			cslValidatorOutput += String.fromCharCode(code);
		},
		stderr: function(code) {
			cslValidatorOutput += String.fromCharCode(code);
		}
	};
	
	let cslValidatorOutput = "";
	await JS_RNV(Module);
	return cslValidatorOutput;
};

if (typeof window === 'undefined') {
	onmessage = async function(event) {
		postMessage(await validate(event.data));
	}
}
if (typeof exports === 'object' && typeof module === 'object') {
	module.exports = validate;
}
else if (typeof window !== "undefined") {
	window.validate = validate;
}

})();