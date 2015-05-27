GENERATED_FILES = \
	d3-selection.js \
	d3-selection.min.js

all: $(GENERATED_FILES)

.PHONY: clean all test

test: all
	node_modules/.bin/faucet `find test -name '*-test.js'`

d3-selection.js: $(wildcard src/*.js) index.js
	rm -f $@
	node_modules/.bin/d3-bundler --polyfill-map -- index.js > $@
	chmod a-w $@

d3-selection.min.js: d3-selection.js
	rm -f $@
	node_modules/.bin/uglifyjs $^ -c -m -o $@
	chmod a-w $@

clean:
	rm -f -- $(GENERATED_FILES)
