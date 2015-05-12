# d3-selection

This module implements the core concept of D3: manipulating the DOM by selecting elements and joining to data.

API changes from D3 3.x:

* The Selection class no longer extends Array, obviating the need for [prototype injection](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection) (or worse, [direct property injection](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_direct_property_injection) on runtimes that did not support `__proto__`). To access the groups and nodes that comprise a selection, use the new selection.groups array. See [#2191](https://github.com/mbostock/d3/issues/2191).

* The selection.data method no longer returns a new selection, but instead modifies the current selection to be the update selection, and assigns the enter and exit selections as selection.enter and selection.exit. (Previously, selection.data returned a new selection, and enter and exit were methods.) See [#2402](https://github.com/mbostock/d3/issues/2402).

* The implementation is now structured using CommonJS modules, rather than the ad hoc [SMASH](https://github.com/mbostock/smash) concatenation process used previously. A standalone build is provided for your convenience using [Browserify](http://browserify.org/), but you are free to define your own build process (e.g., [Webpack](https://webpack.github.io/)). See [#2220](https://github.com/mbostock/d3/issues/2220).

* The selection.classed method has been renamed selection.class. (Even though “class” is a reserved word in ES6, since ES5 we’re allowed to use it as an identifier name.)

* The d3.ns.prefix namespace map is now exposed as d3.namespace.

* [Multi-value map](http://bl.ocks.org/mbostock/3305515) variants of selection.attr, selection.style, selection.property, selection.class and selection.on are now implemented as distinct methods in the [d3-selection-multi plugin](https://github.com/d3/d3-selection-multi), rather than overloading the arguments. See [#2109](https://github.com/mbostock/d3/issues/2109).

* Removed support for Sizzle. It’s time.
