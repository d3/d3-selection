# d3-selection

This module implements the core concept of D3: manipulating the DOM by selecting elements and joining to data. This code is currently EXPERIMENTAL and represents the in-development D3 4.0 API. The 4.0 API is largely backwards-compatible, but differs from 3.x in several ways:

* The implementation is now organized into ES6 modules, rather than the ad hoc concatentation used previously. A [UMD](https://github.com/umdjs/umd) build is provided using [Esperanto](http://esperantojs.org/), but feel free to roll your own.

* The Selection class now extends Object, rather than Array. This obviates the need for [prototype injection](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection) and [direct property injection](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_direct_property_injection).  Selections are now hierarchical, rather than having fixed two-level nesting. Accessor functions such as those accepted by selection.attr and selection.style can now refer to [parent data](http://bl.ocks.org/mbostock/7a8a2de2b99d391add4b) and indexes if desired.

* The selection.data method (when called with arguments) now modifies the current selection to be the update selection, rather than returning a new selection. The enter and exit selections are now empty prior to a data-join, rather than non-existant. The selection.data method (when called *without* arguments) now returns an array of data for *all* selected elements, not just the first group.

* Enter selections no longer have a special subclass, and thus support all selection methods.

* A new selection.nodes method returns an array of all selected elements.

* The selection.append method now takes an optional *before* selector and replaces selection.insert. The selection.insert method is now deprecated. The selection.append method now inserts entering elements in data order by default when joining by key. (This assumes that new data is in the same order as old data; if not, use selection.order.) The selection.append method now moves, rather than copies, entering elements to the update selection.

* The selection.classed method has been renamed selection.class. The old name is deprecated but preserved for backwards-compatibility.

* The selection.on method has been renamed selection.event. The old name is deprecated but preserved for backwards-compatibility.

* A new selection.dispatch method dispatches a [custom event](https://dom.spec.whatwg.org/#interface-customevent) of the specified type to all selected elements. Think of it like jQuery’s trigger.

* [Multi-value map](http://bl.ocks.org/mbostock/3305515) variants of selection.attr, selection.style, selection.property, selection.class and selection.on are now implemented as distinct methods in the [d3-selection-multi plugin](https://github.com/d3/d3-selection-multi), rather than overloading the arguments. See [#2109](https://github.com/mbostock/d3/issues/2109).

* The d3.ns.prefix namespace map has been renamed to d3.namespaces.

* The d3.ns.qualify method has been renamed to d3.namespace.

* Sizzle is no longer supported. It’s time.
