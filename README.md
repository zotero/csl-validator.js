# csl-validator.js

A CSL validator for JavaScript based on RelaxNG and compiled to JS via emscripten. To use, include
csl-validator.js and call:

```javascript
var output = validate("string");
```

```output``` will be the output of the rnv command-line tool.

To compile an updated `csl-validator.js` with a new CSL schema:
1. ```git clone --recursive git://github.com/zotero/csl-validator.js.git```
2. Update `deps/schema`
3. Edit the Makefile to set the correct path for `csl.rnc`. Check the `csl.rnc`
file for updated includes and update the `schema.js` part of `Makefile` if necessary.
4. Run `make clean && make`

To compile RelaxNG:

1. Get emscripten and node.js
2. ```git clone --recursive git://github.com/zotero/csl-validator.js.git```
3. Edit the Makefile to set the path to emscripten
4. ```make clean-all && make relax-ng.js```
5. If this fails `cd deps/expat-2.1.0 && sudo make install`, then run `make` in the root
    directory again and `cd deps/expat-2.1.0 && sudo make uninstall`