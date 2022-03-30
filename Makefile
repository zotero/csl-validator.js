TOP := $(dir $(CURDIR)/$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST)))
EMSCRIPTEN := ${TOP}../emsdk/upstream/emscripten
EXPAT := deps/expat-2.1.0
RNV := deps/rnv-1.7.10
SCHEMA := deps/schema/schemas/styles

all: test

clean-all: clean-build clean
	rm -f relax-ng.js
	
clean-build:
	rm -f relax-ng.tmp.js
	cd $(EXPAT); make clean
	cd $(RNV); make clean
	rm $(EXPAT)/Makefile
	rm $(RNV)/Makefile

clean:
	rm -f schema.js csl-validator.js
	

$(EXPAT)/Makefile: $(EXPAT)/configure
	cd $(EXPAT); "$(EMSCRIPTEN)/emconfigure" ./configure

$(EXPAT)/libexpat.la: $(EXPAT)/Makefile
	cd $(EXPAT); "$(EMSCRIPTEN)/emmake" make

$(RNV)/Makefile: $(EXPAT)/libexpat.la
	export CPPFLAGS='-L$(TOP)$(EXPAT) -I$(TOP)$(EXPAT)/lib'; cd $(RNV); \
		"$(EMSCRIPTEN)/emconfigure" ./configure

relax-ng.tmp.js: $(RNV)/Makefile $(SCHEMA)/csl.rnc
	cd $(RNV); "$(EMSCRIPTEN)/emmake" make
	cd $(SCHEMA); "$(EMSCRIPTEN)/emcc" -Os \
		-o "$(TOP)relax-ng.tmp.js" \
		"$(TOP)$(RNV)/rnv-xcl.o" \
		"$(TOP)$(RNV)/librnv1.a" \
		"$(TOP)$(RNV)/librnv2.a" \
		"$(TOP)$(EXPAT)/.libs/libexpat.a" \
		--embed-file csl.rnc \
		--memory-init-file 0 \
		-s MODULARIZE=1 \
		-s WASM=0 \
		-s EXPORT_ALL=1 \
		-s EXPORT_NAME="JS_RNV" \
		-s FORCE_FILESYSTEM=1 

relax-ng.js: relax-ng.tmp.js
	printf '/*\n' > relax-ng.js
	cat $(RNV)/COPYING >> relax-ng.js
	printf '\n' >> relax-ng.js
	cat $(EXPAT)/COPYING >> relax-ng.js
	printf '*/\n' >> relax-ng.js
	cat relax-ng.tmp.js >> relax-ng.js
	
schema.js: $(SCHEMA)/csl.rnc
	printf 'var cslSchemaFiles = {' >> schema.js
	printf '\n"csl.rnc": `' >> schema.js
	cat $(SCHEMA)/csl.rnc | sed 's/\\/\\\\/g' >> schema.js
	printf '`,\n"csl-choose.rnc": `' >> schema.js
	cat $(SCHEMA)/csl-choose.rnc | sed 's/\\/\\\\/g' >> schema.js
	printf '`,\n"csl-terms.rnc": `' >> schema.js
	cat $(SCHEMA)/csl-terms.rnc | sed 's/\\/\\\\/g' >> schema.js
	printf '`,\n"csl-types.rnc": `' >> schema.js
	cat $(SCHEMA)/csl-types.rnc | sed 's/\\/\\\\/g' >> schema.js
	printf '`,\n"csl-variables.rnc": `' >> schema.js
	cat $(SCHEMA)/csl-variables.rnc | sed 's/\\/\\\\/g' >> schema.js
	printf '`,\n"csl-categories.rnc": `' >> schema.js
	cat $(SCHEMA)/csl-categories.rnc | sed 's/\\/\\\\/g' >> schema.js
	printf '`\n};' >> schema.js
	
csl-validator.js: relax-ng.js schema.js
	cat relax-ng.js >> csl-validator.js
	printf '\n\n' >> csl-validator.js
	cat schema.js >> csl-validator.js
	printf '\n\n' >> csl-validator.js
	cat csl-validator-base.js >> csl-validator.js

test: csl-validator.js
	node test.js
