# d3-selection

This EXPERIMENTAL module implements the core concept of D3: manipulating the DOM by selecting elements and joining to data.

API changes from D3 3.x:

* The implementation is now organized into CommonJS modules, rather than the ad hoc [SMASH](https://github.com/mbostock/smash) concatenation process used previously. A standalone build is provided for your convenience using [Browserify](http://browserify.org/), but you are free to define your own build process (e.g., [Webpack](https://webpack.github.io/)). See [#2220](https://github.com/mbostock/d3/issues/2220).

* The Selection class now extends Object, not Array, obviating the need for [prototype injection](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection) (and [direct property injection](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_direct_property_injection) on runtimes that do not support `__proto__`). See [#2191](https://github.com/mbostock/d3/issues/2191).

* Selections are now truly hierarchical! Rather than always being a nested array, selections have arbitrary depth. Accessor functions such as those accepted by selection.attr and selection.style can now refer to [parent data](http://bl.ocks.org/mbostock/7a8a2de2b99d391add4b) (and indices) if desired.

* The selection.data method, when called with arguments, now modifies the current selection to be the update selection, rather than returning a new selection. Likewise, the enter and exit selections are lazily constructed and modified in-place. The selection.enter and selection.exit methods now return empty selections if the selection has not yet been bound to data. (Previously, attempting to access these methods before binding to data would throw an error.) See [#2402](https://github.com/mbostock/d3/issues/2402).

* The selection.data method, when called *without* arguments, now returns an array of data for all elements in the selection, not just the first group.

* Similarly, a new selection selection.nodes method returns an array of all elements in the selection (flattening the underlying hierarchy).

* The selection.insert method has been renamed (and replaces) selection.append. Thus, the enter.append method now inserts elements in data order by default when joining by key! (This assumes that new data is in the same order as old data; if not, use selection.order after.)

* The enter.append method now moves (rather than copies) elements to the update selection. (In practice, you are unlikely to notice the difference, as enter selections are typically discarded upon append. But this makes more sense now that enter selections are persistent.)

* Enter selections no longer have a special subclass. Instead, enter nodes function as virtual placeholders, providing appendChild and insertBefore methods for use with selection.append.

* The selection.classed method has been renamed selection.class. (Note: `class` is a reserved word in ES6, but ES5 and later allow reserved words as identifier names.) The old name is deprecated but preserved for backwards-compatibility.

* The selection.on method has been renamed selection.event. The old name is deprecated but preserved for backwards-compatibility.

* A new selection.dispatch method dispatches a [custom event](https://dom.spec.whatwg.org/#interface-customevent) of the specified type to all selected elements. It’s like trigger in jQuery.

* The d3.ns.prefix namespace map is now exposed as d3.namespace. The old name is deprecated but preserved for backwards-compatibility.

* [Multi-value map](http://bl.ocks.org/mbostock/3305515) variants of selection.attr, selection.style, selection.property, selection.class and selection.on are now implemented as distinct methods in the [d3-selection-multi plugin](https://github.com/d3/d3-selection-multi), rather than overloading the arguments. See [#2109](https://github.com/mbostock/d3/issues/2109).

* Removed support for Sizzle. It’s time.
