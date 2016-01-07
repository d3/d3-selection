# d3-selection

Selections manipulate many elements at once. Get or set [attributes](#selection_attr), [styles](#selection_style), [properties](#selection_property), [HTML](#selection_html) and [text](#selection_text) content. Values are specified as either constants or functions; the latter are evaluated for each element, given the element’s data. Use method chaining for brevity when applying multiple operators.

Join selections to [data](#selection_data) to make data available to operators. Using the [enter](#selection_enter) and [exit](#selection_enter) subselections, you can also [add](#selection_append) or [remove](#selection_remove) elements to correspond to data.

## Installing

If you use NPM, `npm install d3-selection`. Otherwise, download the [latest release](https://github.com/d3/d3-selection/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. Create a custom build using [Rollup](https://github.com/rollup/rollup) or your preferred bundler. You can also load directly from [d3js.org](https://d3js.org):

```html
<script src="https://d3js.org/d3-selection.v0.5.min.js"></script>
```

In a vanilla environment, a `d3_selection` global is exported. [Try d3-selection in your browser.](https://tonicdev.com/npm/d3-selection)

## API Reference

* [Selection](#selection)
* [Manipulation](#manipulation)
* [Data](#data)
* [Events](#events)
* [Control](#control)
* [Namespaces](#namespaces)

### Selection

D3 provides two top-level methods for selecting elements: [select](#select) and [selectAll](#selectAll). These methods accept selector strings; the former selects only the first matching element, while the latter selects *all* matching elements in document traversal order. These methods can also accept nodes, which is useful for integration with third-party libraries such as jQuery or developer tools (`$0`).

Whereas the top-level select methods query the entire document, a selection’s [select](Selections#select) and [selectAll](Selections#selectAll) operators restrict queries to descendants of each selected element; we call this "subselection". For example, `d3.selectAll("p").select("b")` returns the first bold ("b") elements in every paragraph ("p") element. Subselecting via selectAll groups elements by ancestor. Thus, `d3.selectAll("p").selectAll("b")` groups by paragraph, while `d3.selectAll("p b")` returns a flat selection. Subselecting via select is similar, but preserves groups and propagates data. Grouping plays an important role in the data join, and functional operators may depend on the numeric index of the current element within its group.

<a name="selection" href="#selection">#</a> <b>selection</b>()

Selects the root document element. Equivalent to `select(document.documentElement)`. This function can also be used to check if an object is a selection: `o instanceof selection`. You can also add new methods to the selection prototype. For example, to add a convenience method for setting the “checked” property of checkboxes, you might say:

```js
selection.prototype.checked = function(value) {
  return arguments.length < 1
      ? this.property("checked")
      : this.property("checked", !!value);
};
```

<a name="select" href="#select">#</a> <b>select</b>(<i>selector</i>)
<br><a href="#select">#</a> <b>select</b>(<i>node</i>)

Selects the first element that matches the specified *selector*, returning a new, single-element selection. If no elements in the document match the specified selector, returns an empty selection. If multiple elements match the selector, only the first matching element (in document traversal order) will be selected.

If *selector* is not a string, instead selects the specified *node*. This is useful if you already have a reference to a node, such as `select(this)` within an event listener, or a global such as `document.body`.

<a name="selectAll" href="#selectAll">#</a> <b>selectAll</b>(<i>selector</i>)
<br><a href="#selectAll">#</a> <b>selectAll</b>(<i>nodes</i>)

Selects all elements that match the specified *selector*. The elements will be selected in document traversal order (top-to-bottom). If no elements in the document match the specified selector, returns an empty selection.

If *selector* is not a string, instead selects the specified array of *nodes*. This is useful if you already have a reference to nodes, such as `selectAll(this.childNodes)` within an event listener, or a global such as `document.links`. The *nodes* argument doesn’t have to be an array, exactly; a pseudo-array that can be coerced into an array (*e.g.*, a `NodeList` or `arguments`) will work.

<a name="selection_select" href="#selection_select">#</a> <i>selection</i>.<b>select</b>()

…

<a name="selection_selectAll" href="#selection_selectAll">#</a> <i>selection</i>.<b>selectAll</b>()

…

### Manipulation

D3 has a variety of operators which affect the document content. These are what you’ll use the most to display data! When used to set document content, the operators return the current selection, so you can chain multiple operators together in a concise statement.

If you want to learn how selections work, try selecting elements interactively using your browser’s developer console. You can inspect the returned array to see which elements were selected, and how they are grouped. You can also then apply operators to the selected elements and see how the page content changes.

<a name="selection_attr" href="#selection_attr">#</a> <i>selection</i>.<b>attr</b>(<i>name</i>[, <i>value</i>])

If *value* is specified, sets the attribute with the specified name to the specified value on the selected elements. If *value* is a constant, then all elements are given the same attribute value; otherwise, if *value* is a function, the function is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s attribute. A null value will remove the specified attribute.

If *value* is not specified, returns the value of the specified attribute for the first non-null element in the selection. This is generally useful only if you know that the selection contains exactly one element.

The specified *name* may have a namespace prefix, such as `xlink:href`, to specify an `href` attribute in the XLink namespace. See [namespaces](#namespaces) for the map of supported namespaces; additional namespaces can be registered by adding to the map.

<a name="selection_classed" href="#selection_classed">#</a> <i>selection</i>.<b>classed</b>(<i>classes</i>[, <i>value</i>])

A convenience operator for setting the `class` attribute (or `classList` property). The specified *classes* is a string of space-separated class names. For example, to add the classes `foo` and `bar` to the selected elements:

```js
selection.classed("foo bar", true);
```

If *value* is specified, sets whether or not the specified *classes* are associated with the selected elements. If *value* is a constant and truthy, then all elements are assigned the specified *classes*, if not already assigned; if falsey, then the *classes* are removed from all selected elements, if assigned. If *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. The function’s return value is then used to assign or unassign classes on each element.

If *value* is not specified, returns true if and only if the first non-null element in this selection has the specified class(es). This is generally useful only if you know the selection contains exactly one element.

<a name="selection_style" href="#selection_style">#</a> <i>selection</i>.<b>style</b>(<i>name</i>[, <i>value</i>[, <i>priority</i>]])

If *value* is specified, sets the style property with the specified *name* to the specified *value* on the selected elements. If *value* is a constant, then all elements are given the same style value; otherwise, if *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s style property. A null value will remove the style property. An optional *priority* may also be specified, either as null or the string `important` (without the exclamation point).

Note that CSS styles typically have associated units. For example, `3px` is a valid stroke-width property value, while `3` is not. Although some browsers implicitly assign the `px` (pixel) unit to numeric values, not all browsers do: IE, for example, throws an “invalid arguments” error and stops executing!

If *value* is not specified, returns the current *computed* value of the specified style property for the first non-null element in the selection. This is generally useful only if you know the selection contains exactly one element. Note that the computed value may be *different* than the value that was previously set, particularly if the style property was set using a shorthand property (such as the `font` style, which is shorthand for `font-size`, `font-face`, etc.).

<a name="selection_property" href="#selection_property">#</a> <i>selection</i>.<b>property</b>(<i>name</i>[, <i>value</i>])

Some HTML elements have special properties that are not addressable using attributes or styles. For example, form text fields have a `value` string property, checkboxes have a `checked` boolean property, all HTML elements have a `className` string property. Use the property operator to get or set these properties.

If *value* is specified, sets the property with the specified name to the specified value on selected elements. If *value* is a constant, then all elements are given the same property value; otherwise, if *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s property. A null value will delete the specified property.

If *value* is not specified, returns the value of the specified property for the first non-null element in the selection. This is generally useful only if you know the selection contains exactly one element.

<a name="selection_text" href="#selection_text">#</a> <i>selection</i>.<b>text</b>([<i>value</i>])

The text operator is based on the [textContent](http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-textContent "http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-textContent") property; setting the text content will replace any existing child elements.

If *value* is specified, sets the text content to the specified value on all selected elements. If *value* is a constant, then all elements are given the same text content; otherwise, if *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s text content. A null value will clear the content.

If *value* is not specified, returns the text content for the first non-null element in the selection. This is generally useful only if you know the selection contains exactly one element.

<a name="selection_html" href="#selection_html">#</a> <i>selection</i>.<b>html</b>([<i>value</i>])

The html operator is based on the [innerHTML](http://dev.w3.org/html5/spec-LC/apis-in-html-documents.html#innerhtml "http://dev.w3.org/html5/spec-LC/apis-in-html-documents.html#innerhtml") property; setting the inner HTML will replace any existing child elements. Also, you may prefer to use [*selection*.append](#selection_append) to create HTML content in a data-driven way; this operator is intended for when you want a little bit of HTML, say for rich formatting.

If *value* is specified, sets the inner HTML to the specified value on all selected elements. If *value* is a constant, then all elements are given the same inner HTML; otherwise, if *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s inner HTML. A null value will clear the content.

If *value* is not specified, returns the inner HTML for the first non-null element in the selection. This is generally useful only if you know the selection contains exactly one element.

Note: as its name suggests, *selection*.html is only supported on HTML elements. SVG elements and other non-HTML elements do not support the innerHTML property, and thus are incompatible with *selection*.html. Consider using [XMLSerializer](https://developer.mozilla.org/en-US/docs/XMLSerializer) to convert a DOM subtree to text. See also the [innersvg polyfill](https://code.google.com/p/innersvg/), which provides a shim to support the innerHTML property on SVG elements.

<a name="selection_append" href="#selection_append">#</a> <i>selection</i>.<b>append</b>(<i>name</i>[, <i>before</i>])
<br><a href="#selection_append">#</a> <i>selection</i>.<b>append</b>(<i>node</i>[, <i>before</i>])

If *name* is specified as a string, appends a new element with the specified *name* as the last child of each element in the current selection. Otherwise, a *node* function may be specified, which is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. This function should return an element to be appended. (Typically, the function creates a new element, but it may return an existing element instead.) For example:

```js
selection.append(function() {
  return document.createElementNS("http://www.w3.org/2000/svg", "g");
});
```

In both cases, this method returns a new selection containing the appended elements. Each new element inherits the data of the current elements, if any, in the same manner as [*selection*.select](#selection_select).

An optional *before* selector string or function may be specified. For instance, the selector `:first-child` will prepend nodes before the first child, rather than after the last child. If no *before* selector is specified on an [enter selection](#selection_enter), then entering elements are inserted immediately before the next following sibling in the update selection, if any. This allows you to insert elements into the DOM in an order consistent with bound data. Note, however, the slower [*selection*.order](#selection_order) may still be required if updating elements change order.

The specified *name* may have a namespace prefix, such as `svg:text`, to specify a `text` attribute in the SVG namespace. See [namespaces](#namespaces) for the map of supported namespaces; additional namespaces can be registered by adding to the map. If no namespace is specified, the namespace will be inherited from the parent element; or, if the name is one of the known prefixes, the corresponding namespace will be used (for example, `svg` implies `svg:svg`).

<a name="selection_remove" href="#selection_remove">#</a> <i>selection</i>.<b>remove</b>()

Removes the selected elements from the document. Returns the current selection (the removed elements) which are now detached from the DOM. Note that there is not currently a dedicated API to add removed elements back to the document; however, you can pass a function to *selection*.append to re-add elements.

### Data

<a name="selection_data" href="#selection_data">#</a> <i>selection</i>.<b>data</b>([<i>data</i>[, <i>key</i>]])

Joins the specified array of *data* with the selected elements. The specified *data* is an array of arbitrary values (*e.g.*, numbers or objects), or a function that returns an array of values. If a *key* function is not specified, then the first datum in *values* is assigned to the first selected element, the second datum to the second selected element, and so on. When data is assigned to an element, it is stored in the property `__data__`, thus making the data “sticky” and available on re-selection.

This method modifies the current selection so that it represents the *update* selection: the elements that were successfully bound to data. It simultaneously defines the [enter](#selection_enter) and [exit](#selection_exit) selections for adding and removing elements to correspond to data. The *update* and *enter* selections are returned in data order, while the *exit* selection is in document order (at the time that the selection was queried). For more details, see the tutorial [Thinking With Joins](http://bost.ocks.org/mike/join/).

A *key* function may be specified to control how data is joined to elements, replacing the default join-by-index. The key function is evaluated for each selected element (in order), being passed the current datum `d` and the current index `i`, with the `this` context as the current DOM element. The key function is also evaluated for each new datum, being passed the datum `d`, the index `i`, with the `this` context as the parent DOM element. The returned string keys are used to construct a map to uniquely assign data to elements.

If a key function is specified, the order of elements in this selection may change. However, the elements are not automatically reordered in the DOM; use [*selection*.order](#order) or [*selection*.sort](#sort) as needed. For a more detailed example of how the key function affects the data join, see the tutorial [A Bar Chart, Part 2](http://bost.ocks.org/mike/bar/2/).

The *data* is specified **for each group** in the selection. Thus, if the selection has multiple groups (such as a [selectAll](#selectAll) followed by a [*selection*.selectAll](#selection_selectAll)), then *data* should typically be specified as a function that returns an array. The *data* function will be passed the parent element data (which may be undefined) and the index, with the parent element as the `this` context.

For example, you may bind a two-dimensional array to an initial selection, and then bind the inner arrays to each subselection. The *data* function in this case is the identity function: it is invoked for each group of child elements, being passed the data bound to the parent element, and returns this array of data.

```js
var matrix = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];

var tr = d3.select("body").append("table")
  .selectAll("tr")
    .data(matrix)
  .enter().append("tr");

var td = tr.selectAll("td")
    .data(function(d) { return d; })
  .enter().append("td")
    .text(function(d) { return d; });
```

If *data* is not specified, then this method returns the array of data the selected elements.

Note: this method cannot be used to clear previously-bound data; use [*selection*.datum](#selection_datum) instead.

<a name="selection_enter" href="#selection_enter">#</a> <i>selection</i>.<b>enter</b>()

Returns the enter selection: placeholder nodes for each datum for which there was no corresponding DOM element in the selection. The enter selection is always empty until the selection is joined to data by [*selection*.data](#selection_data). For example, to create new DIV elements corresponding to an array of numbers:

```js
var div = d3.select("body").selectAll("div");
div.data([4, 8, 15, 16, 23, 42]);
div.enter().append("div").text(function(d) { return d; });
```

If the body is initially empty, the above code will create six new DIV elements, append them to the body in-order, and assign their text content as the associated (string-coerced) number:

```html
<div>4</div>
<div>8</div>
<div>15</div>
<div>16</div>
<div>23</div>
<div>42</div>
```

The enter selection’s placeholders are conceptually pointers to the parent node (in this example, the document body), and the enter selection is typically only used transiently to append elements.

The enter selection **merges into the update selection** on [append](#selection_append). Rather than applying the same operators to the enter and update selections separately, apply them once to the update selection *after* entering nodes. For example:

```js
var circle = svg.selectAll("circle");
circle.data(data);
circle.attr(…); // applies to updating (old) elements only
circle.enter().append("circle").attr(…); // applies to entering (new) elements only
circle.attr(…); // applies to BOTH updating and entering elements
circle.exit().remove(); // removes exiting elements
```

<a name="selection_exit" href="#selection_exit">#</a> <i>selection</i>.<b>exit</b>()

Returns the exit selection: existing DOM elements for which no new datum was found. The exit selection is always empty until the selection is joined to data by [*selection*.data](#selection_data). For example, to update the DIV elements created above with a new array of numbers:

```js
div.data([1, 2, 4, 8, 16, 32], function(d) { return d; });
```

Since we specified a key function (the identity function), and the new data contains the numbers [4, 8, 16] which match existing elements, the update selection contains three DIV elements. We’ll leave those elements as-is. We can append new elements for [1, 2, 32] using the enter selection:

```js
div.enter().append("div").text(function(d) { return d; });
```

Likewise, to remove the exiting elements [15, 23, 42]:

```js
div.exit().remove();
```

Now the document body looks like this:

```html
<div>1</div>
<div>2</div>
<div>4</div>
<div>8</div>
<div>16</div>
<div>32</div>
```

Note that the order of the DOM elements matches the order of the data. This is true because the old data’s order and the new data’s order were consistent. If the new data’s order is different, use [*selection*.order](#selection_order) to reorder the elements in the DOM.

<a name="selection_datum" href="#selection_datum">#</a> <i>selection</i>.<b>datum</b>()

Gets or sets the bound data for each selected element. Unlike the [*selection*.data](#selection_data) method, this method does not compute a join (and thus does not affect the enter and exit selections).

If *value* is specified, sets the element’s bound data to the specified value on all selected elements. If *value* is a constant, all elements are given the same data; otherwise, if *value* is a function, then the function is evaluated for each selected element, being passed the previous datum `d` and the current index `i`, with the `this` context as the current DOM element. The function is then used to set each element’s data. A null value will delete the bound data. This operator has no effect on the index.

If *value* is not specified, returns the bound datum for the first non-null element in the selection. This is generally useful only if you know the selection contains exactly one element.

This method is useful for accessing HTML5 [custom data attributes](http://www.w3.org/TR/html5/dom.html#custom-data-attribute). For example, given the following elements:

```html
<ul id="list">
  <li data-username="shawnbot">Shawn Allen</li>
  <li data-username="mbostock">Mike Bostock</li>
</ul>
```

You can expose the custom data attributes by setting each element’s data as the built-in [dataset](http://www.w3.org/TR/html5/dom.html#dom-dataset) property:

```js
selection.datum(function() { return this.dataset; })
```

<a name="selection_filter" href="#selection_filter">#</a> <i>selection</i>.<b>filter</b>(*selector*)

Filters the selection, returning a new selection that contains only the elements for which the specified *selector* is true. The *selector* may be specified either as a function or as a selector string, such as `.foo`. If a function, it is passed the current datum `d` and index `i`, with the `this` context as the current DOM element. Note that the returned selection *may not* preserve the index of the original selection in the returned selection, as some elements may be removed; you can use [*selection*.select](#selection_select) to preserve the index, if needed.

For example, to select every element with an odd index (relative to the zero-based index):

```js
var odd = selection.select(function(d, i) { return i % 2 === 1 ? this : null; });
```

Equivalently, using a filter function:

```js
var odd = selection.filter(function(d, i) { return i % 2 === 1; });
```

Or a filter selector (note that the `:nth-child` pseudo-class is a one-based index rather than a zero-based index):

```js
var odd = selection.filter(":nth-child(even)");
```

<a name="selection_sort" href="#selection_sort">#</a> <i>selection</i>.<b>sort</b>()

Sorts the selected elements according to the *comparator* function, and then re-inserts the document elements to match the resulting order. Returns this selection.

The comparator function, which defaults to [ascending](https://github.com/d3/d3-array#ascending), is passed two elements’ data *a* and *b* to compare. It should return either a negative, positive, or zero value. If negative, then *a* should be before *b*; if positive, then *a* should be after *b*; otherwise, *a* and *b* are considered equal and the order is arbitrary.

Note that sorting is not guaranteed to be stable; however, it is guaranteed to have the same behavior as your browser’s built-in [sort](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort "https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort") method on arrays.

<a name="selection_order" href="#selection_order">#</a> <i>selection</i>.<b>order</b>()

Re-inserts elements into the document such that the document order matches the selection order. This is equivalent to calling [*selection*.sort](#selection_sort) if the data is already sorted, but much faster.

### Events

<a name="selection_on" href="#selection_on">#</a> <i>selection</i>.<b>on</b>()

…

<a name="selection_dispatch" href="#selection_dispatch">#</a> <i>selection</i>.<b>dispatch</b>()

…

<a name="event" href="#event">#</a> <b>event</b>()

…

<a name="mouse" href="#mouse">#</a> <b>mouse</b>()

…

<a name="touch" href="#touch">#</a> <b>touch</b>()

…

<a name="touches" href="#touches">#</a> <b>touches</b>()

…


### Control

For advanced usage, D3 has a few additional operators for custom control flow.

<a name="selection_each" href="#selection_each">#</a> <i>selection</i>.<b>each</b>()

…

<a name="selection_call" href="#selection_call">#</a> <i>selection</i>.<b>call</b>()

…

<a name="selection_empty" href="#selection_empty">#</a> <i>selection</i>.<b>empty</b>()

…

<a name="selection_nodes" href="#selection_nodes">#</a> <i>selection</i>.<b>nodes</b>()

…

<a name="selection_node" href="#selection_node">#</a> <i>selection</i>.<b>node</b>()

…

<a name="selection_size" href="#selection_size">#</a> <i>selection</i>.<b>size</b>()

…

### Namespaces

…

<a name="namespace" href="#namespace">#</a> <b>namespace</b>()

…

<a name="namespaces" href="#namespaces">#</a> <b>namespaces</b>()

…

<a name="requote" href="#requote">#</a> <b>requote</b>()

…
