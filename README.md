# d3-selection

Selections allow powerful data-driven transformation of the document object model (DOM): set [attributes](#selection_attr), [styles](#selection_style), [properties](#selection_property), [HTML](#selection_html) or [text](#selection_text) content, and more. Using the [data join](#data)’s [enter](#selection_enter) and [exit](#selection_enter) selections, you can also [add](#selection_append) or [remove](#selection_remove) elements to correspond to data.

## Installing

If you use NPM, `npm install d3-selection`. Otherwise, download the [latest release](https://github.com/d3/d3-selection/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. Create a custom build using [Rollup](https://github.com/rollup/rollup) or your preferred bundler. You can also load directly from [d3js.org](https://d3js.org):

```html
<script src="https://d3js.org/d3-selection.v0.5.min.js"></script>
```

In a vanilla environment, a `d3_selection` global is exported. [Try d3-selection in your browser.](https://tonicdev.com/npm/d3-selection)

## API Reference

* [Selection](#selection)
* [Transformation](#transformation)
* [Data](#data)
* [Events](#events)
* [Control](#control)
* [Namespaces](#namespaces)

### Selection

Selection methods accept [W3C selector strings](http://www.w3.org/TR/selectors-api/) such as `.foo` to select elements with the class *foo*, or `div` to select DIV elements. Selection methods come in two forms: select and selectAll: the former selects only the first matching element, while the latter selects all matching elements in traversal order. The top-level selection methods, [d3.select](#select) and [d3.selectAll](#selectAll), query the entire document; the subselection methods, in contrast, [*selection*.select](#selection_select) and [*selection*.selectAll](#selection_selectAll), restrict selection to descendants of the selected elements.

<a name="selection" href="#selection">#</a> d3.<b>selection</b>()

[Selects](#select) the root element, `document.documentElement`. This function can also be used to check if an object is a selection (`instanceof selection`) or to extend the selection prototype. For example, to add a method to check or uncheck input checkboxes:

```js
d3.selection.prototype.checked = function(value) {
  return arguments.length < 1
      ? this.property("checked")
      : this.property("checked", !!value);
};
```

And then to check all checkboxes:

```js
d3.selectAll("input[type=checkbox]").checked(true);
```

<a name="select" href="#select">#</a> d3.<b>select</b>(<i>selector</i>)

Selects the first element that matches the specified *selector*. If no elements match the *selector*, returns an empty selection. If multiple elements match the *selector*, only the first matching element (in traversal order) will be selected. For example, to select the first anchor element:

```js
var anchor = d3.select("a");
```

If the *selector* is not a string, instead selects the specified node; this is useful if you already have a reference to a node, such as `this` within an event listener or a global such as `document.body`. For example, to make the text of any clicked paragraph red:

```js
d3.selectAll("p").on("click", function() {
  d3.select(this).style("color", "red");
});
```

<a name="selectAll" href="#selectAll">#</a> d3.<b>selectAll</b>(<i>selector</i>)

Selects all elements that match the specified *selector*. The elements will be selected in traversal order (top-to-bottom). If no elements in the document match the *selector*, returns an empty selection. For example, to select all paragraphs:

```js
var paragraph = d3.selectAll("p");
```

If the *selector* is not a string, instead selects the specified array of nodes; this is useful if you already have a reference to nodes, such as `this.childNodes` within an event listener or a global such as `document.links`. The nodes may instead be a pseudo-array such as a `NodeList` or `arguments`. For example, to color all links red:

```js
d3.selectAll(document.links).style("color", "red");
```

<a name="selection_select" href="#selection_select">#</a> <i>selection</i>.<b>select</b>(<i>selector</i>)

For each selected element, selects the first descendant element that matches the specified *selector*. If no element matches the specified selector for the current element, the element at the current index will be null in the returned selection, preserving the index of the existing selection. (Operators automatically skip null elements.) If the current element has associated data, this data is propagated to the newly selected elements. If multiple elements match the selector, only the first matching element (in traversal order) is selected. For example, to select the first bold element in every paragraph:

```js
var b = d3.selectAll("p").select("b");
```

If the *selector* is a function, it will be invoked in the same manner as other operator functions, being passed the current datum `d` and index `i`, with the `this` context as the current DOM element. It must then return an element, or null if there is no matching element. For example, to select the previous sibling of each paragraph:

```js
var previous = d3.selectAll("p").select(function() {
  return this.previousElementSibling;
});
```

Unlike [*selection*.selectAll](#selection_selectAll), *selection*.select does not affect grouping: it preserves the existing grouping and propagates parent data (if any) to selected children. Grouping plays an important role in the [data join](#data). See [Nested Selections](http://bost.ocks.org/mike/nest/) for more on this topic.

<a name="selection_selectAll" href="#selection_selectAll">#</a> <i>selection</i>.<b>selectAll</b>(<i>selector</i>)

For each selected element, selects all descendant elements that match the specified *selector*. The returned selection is grouped by its parent node in the current selection. If no element matches the specified selector for the current element, the group at the current index will be empty in the returned selection. The subselection does not inherit data from the current selection; use [*selection*.data](#selection_data) to propagate data to children. For example, to select the bold elements in every paragraph:

```js
var b = d3.selectAll("p").selectAll("b");
```

If the *selector* is a function, it will be invoked in the same manner as other operator functions, being passed the current datum `d` and index `i`, with the `this` context as the current DOM element. It must then return an array of elements (or a psuedo-array, such as a NodeList), or the empty array if there are no matching elements. For example, to select the previous and next siblings of each paragraph:

```js
var sibling = d3.selectAll("p").selectAll(function() {
  return [
    this.previousElementSibling,
    this.nextElementSibling
  ];
});
```

Unlike [*selection*.select](#selection_select), *selection*.selectAll does affect grouping: each selected descendant is grouped by the parent element in the originating selection. Grouping plays an important role in the [data join](#data). See [Nested Selections](http://bost.ocks.org/mike/nest/) for more on this topic.

<a name="selection_filter" href="#selection_filter">#</a> <i>selection</i>.<b>filter</b>(<i>filter</i>)

Filters the selection, returning a new selection that contains only the elements for which the specified *filter* is true. The *filter* may be specified either as a function or as a selector string, such as `.foo`. If a function, it is passed the current datum `d` and index `i`, with the `this` context as the current DOM element. For example, to select every element with an odd index (relative to the zero-based index):

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

The returned selection may not preserve the index of the original selection, as some elements may be removed; you can use [*selection*.select](#selection_select) to preserve the index, if needed.

### Transformation

Selections expose a variety of operators to affect document content. Selection operators return the current selection, allowing the concise application of multiple operators on a given selection via method chaining. For example, to see the name attribute and color style of an anchor element:

```js
d3.select("a")
    .attr("name", "fred")
    .style("color", "red");
```

This is equivalent to:

```js
var anchor = d3.select("a");
anchor.attr("name", "fred");
anchor.style("color", "red");
```

To learn selections experientially, go to [d3js.org](https://d3js.org) and try selecting elements in your browser’s developer console! (In Chrome, open the console with ⌥⌘J.) Inspect the returned selection to see which elements are selected and how they are grouped. Apply operators to the selection and see how the page content changes.

<a name="selection_attr" href="#selection_attr">#</a> <i>selection</i>.<b>attr</b>(<i>name</i>[, <i>value</i>])

If a *value* is specified, sets the attribute with the specified *name* to the specified value on the selected elements and returns this selection. If the *value* is a constant, then all elements are given the same attribute value; otherwise, if the *value* is a function, the function is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s attribute. A null value will remove the specified attribute.

If a *value* is not specified, returns the current value of the specified attribute for the first (non-null) element in the selection. This is generally useful only if you know that the selection contains exactly one element.

The specified *name* may have a namespace prefix, such as `xlink:href` to specify the `href` attribute in the XLink namespace. See [namespaces](#namespaces) for the map of supported namespaces; additional namespaces can be registered by adding to the map.

<a name="selection_classed" href="#selection_classed">#</a> <i>selection</i>.<b>classed</b>(<i>classes</i>[, <i>value</i>])

If a *value* is specified, assigns or unassigns the specified CSS *classes* on the selected elements by setting the `class` attribute or modifying the `classList` property and returns this selection. The specified *classes* is a string of space-separated class names. For example, to assign the classes `foo` and `bar` to the selected elements:

```js
selection.classed("foo bar", true);
```

If the *value* is truthy, then all elements are assigned the specified *classes*; otherwise, the classes are unassigned. If the *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. The function’s return value is then used to assign or unassign classes on each element. For example, to randomly associate the class *foo* with on average half the selected elements:

```js
selection.classed("foo", function() { return Math.random(); });
```

If a *value* is not specified, returns true if and only if the first (non-null) selected element has the specified *classes*. This is generally useful only if you know the selection contains exactly one element.

<a name="selection_style" href="#selection_style">#</a> <i>selection</i>.<b>style</b>(<i>name</i>[, <i>value</i>[, <i>priority</i>]])

If a *value* is specified, sets the style property with the specified *name* to the specified value on the selected elements and returns this selection. If the *value* is a constant, then all elements are given the same style property value; otherwise, if the *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s style property. A null value will remove the style property. An optional *priority* may also be specified, either as null or the string `important` (without the exclamation point).

If a *value* is not specified, returns the current computed value of the specified style property for the first (non-null) element in the selection. This is generally useful only if you know the selection contains exactly one element. The computed value **may be different than the previously-set value**, particularly if it was set using a shorthand property (such as the `font` style, which is shorthand for `font-size`, `font-face`, etc.).

Caution: unlike many SVG attributes, CSS styles typically have associated units. For example, `3px` is a valid stroke-width property value, while `3` is not. Some browsers implicitly assign the `px` (pixel) unit to numeric values, but not all browsers do: IE, for example, throws an “invalid arguments” error!

<a name="selection_property" href="#selection_property">#</a> <i>selection</i>.<b>property</b>(<i>name</i>[, <i>value</i>])

Some HTML elements have special properties that are not addressable using attributes or styles, such as a form field’s text `value` and a checkbox’s `checked` boolean. Use this operator to get or set these properties.

If a *value* is specified, sets the property with the specified *name* to the specified value on selected elements. If the *value* is a constant, then all elements are given the same property value; otherwise, if the *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s property. A null value will delete the specified property.

If a *value* is not specified, returns the value of the specified property for the first (non-null) element in the selection. This is generally useful only if you know the selection contains exactly one element.

<a name="selection_text" href="#selection_text">#</a> <i>selection</i>.<b>text</b>([<i>value</i>])

The text operator is based on the [textContent](http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-textContent) property; setting the text content will replace any existing child elements.

If a *value* is specified, sets the text content to the specified value on all selected elements. If the *value* is a constant, then all elements are given the same text content; otherwise, if the *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s text content. A null value will clear the content.

If a *value* is not specified, returns the text content for the first (non-null) element in the selection. This is generally useful only if you know the selection contains exactly one element.

<a name="selection_html" href="#selection_html">#</a> <i>selection</i>.<b>html</b>([<i>value</i>])

The html operator is based on the [innerHTML](http://dev.w3.org/html5/spec-LC/apis-in-html-documents.html#innerhtml) property; setting the inner HTML will replace any existing child elements. Also, you may prefer to use [*selection*.append](#selection_append) to create HTML content in a data-driven way; this operator is intended for when you want a little bit of HTML, say for rich formatting.

If a *value* is specified, sets the inner HTML to the specified value on all selected elements. If the *value* is a constant, then all elements are given the same inner HTML; otherwise, if the *value* is a function, then the function is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. The function’s return value is then used to set each element’s inner HTML. A null value will clear the content.

If a *value* is not specified, returns the inner HTML for the first (non-null) element in the selection. This is generally useful only if you know the selection contains exactly one element.

As the name suggests, *selection*.html is only supported on HTML elements. SVG elements and other non-HTML elements do not support the innerHTML property, and thus are incompatible with *selection*.html. Consider using [XMLSerializer](https://developer.mozilla.org/en-US/docs/XMLSerializer) to convert a DOM subtree to text. See also the [innersvg polyfill](https://code.google.com/p/innersvg/), which provides a shim to support the innerHTML property on SVG elements.

<a name="selection_append" href="#selection_append">#</a> <i>selection</i>.<b>append</b>(<i>type</i>[, <i>before</i>])

If the specified *type* is a string, appends a new element of this type (tag name) as the last child of each element in the current selection. Otherwise, the *type* may be a function which is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. This function should return an element to be appended. (Typically, the function creates a new element, but it may return an existing element instead.) For example, to append a DIV element to each paragraph:

```js
d3.selectAll("p").append("div");
```

This is equivalent to:

```js
d3.selectAll("p").append(function() {
  return document.createElement("DIV");
});
```

In both cases, this method returns a new selection containing the appended elements. Each new element inherits the data of the current elements, if any, in the same manner as [*selection*.select](#selection_select).

An optional *before* selector string or function may be specified. For instance, the selector `:first-child` will prepend nodes before the first child, rather than after the last child. If no *before* selector is specified on an [enter selection](#selection_enter), then entering elements are inserted immediately before the next following sibling in the update selection, if any. This allows you to insert elements into the DOM in an order consistent with bound data. Note, however, the slower [*selection*.order](#selection_order) may still be required if updating elements change order.

The specified *name* may have a namespace prefix, such as `svg:text` to specify a `text` attribute in the SVG namespace. See [namespaces](#namespaces) for the map of supported namespaces; additional namespaces can be registered by adding to the map. If no namespace is specified, the namespace will be inherited from the parent element; or, if the name is one of the known prefixes, the corresponding namespace will be used (for example, `svg` implies `svg:svg`).

<a name="selection_remove" href="#selection_remove">#</a> <i>selection</i>.<b>remove</b>()

Removes the selected elements from the document. Returns this selection (the removed elements) which are now detached from the DOM. Note that there is not currently a dedicated API to add removed elements back to the document; however, you can pass a function to [*selection*.append](#selection_append) to re-add elements.

<a name="selection_sort" href="#selection_sort">#</a> <i>selection</i>.<b>sort</b>(<i>comparator</i>)

Sorts the selected elements according to the *comparator* function, and then re-inserts the document elements to match the resulting order. Returns this selection.

The comparator function, which defaults to [ascending](https://github.com/d3/d3-array#ascending), is passed two elements’ data *a* and *b* to compare. It should return either a negative, positive, or zero value. If negative, then *a* should be before *b*; if positive, then *a* should be after *b*; otherwise, *a* and *b* are considered equal and the order is arbitrary.

Note that sorting is not guaranteed to be stable; however, it is guaranteed to have the same behavior as your browser’s built-in [sort](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort) method on arrays.

<a name="selection_order" href="#selection_order">#</a> <i>selection</i>.<b>order</b>()

Re-inserts elements into the document such that the document order matches the selection order. This is equivalent to calling [*selection*.sort](#selection_sort) if the data is already sorted, but much faster.

### Data

For an introduction to D3’s data joins, see [Thinking With Joins](http://bost.ocks.org/mike/join/). Also see the [General Update Pattern](http://bl.ocks.org/mbostock/3808218) example thread.

<a name="selection_data" href="#selection_data">#</a> <i>selection</i>.<b>data</b>([<i>data</i>[, <i>key</i>]])

Joins the specified array of *data* with the selected elements, modifying this selection so that it represents the *update* selection: the elements successfully bound to data. Also defines the [enter](#selection_enter) and [exit](#selection_exit) selections, which can be used to add or remove elements to correspond to the new data. The specified *data* is an array of arbitrary values (*e.g.*, numbers or objects), or a function that returns an array of values for each group. When data is assigned to an element, it is stored in the property `__data__`, thus making the data “sticky” and available on re-selection.

The *data* is specified **for each group** in the selection. If the selection has multiple groups (such as [d3.selectAll](#selectAll) followed by [*selection*.selectAll](#selection_selectAll)), then *data* should typically be specified as a function. This function will be invoked for each group, being passed the parent datum *d* (which may be undefined) and the group index *i*, with the parent element as the `this` context. For example, to create an HTML table from a matrix of numbers:

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

The *data* function here is the identity function: it is invoked for each table row, and returns the numbers for each table cell.

If a *key* is not specified, then the first datum in *data* is assigned to the first selected element, the second datum to the second selected element, and so on. A *key* function may be specified to control how data is assigned to elements, replacing the default join-by-index. This key function is evaluated for each selected element (in order), being passed the current datum *d* and the current index *i*, with the `this` context as the current DOM element. The key function is also evaluated for each new datum in *data*, being passed the datum `d`, the index `i`, with the `this` context as the parent DOM element. The datum for a given key is assigned to the element with the matching key. For example, given this document:

```html
<div id="Ford"></div>
<div id="Jarrah"></div>
<div id="Kwon"></div>
<div id="Locke"></div>
<div id="Reyes"></div>
<div id="Shephard"></div>
```

You could join data by key as follows:


```js
var data = [
  {name: "Locke", number: 4},
  {name: "Reyes", number: 8},
  {name: "Ford", number: 15},
  {name: "Jarrah", number: 16},
  {name: "Shephard", number: 31},
  {name: "Kwon", number: 34}
];

d3.selectAll("div")
    .data(data, function(d) { return d ? d.name : this.id; })
    .text(function(d) { return d.number; });
```

This key function uses the bound datum *d* if present, and otherwise falls back to the element’s id property.

The *update* and *enter* selections are returned in data order, while the *exit* selection preserves the order prior to the data join. If a key function is specified, the order of elements in the selection may not match their order in the document; use [*selection*.order](#order) or [*selection*.sort](#sort) as needed. For more on how the key function affects the join, see [A Bar Chart, Part 2](http://bost.ocks.org/mike/bar/2/).

If *data* is not specified, this method returns the array of data for the selected elements.

This method cannot be used to clear bound data; use [*selection*.datum](#selection_datum) instead.

<a name="selection_enter" href="#selection_enter">#</a> <i>selection</i>.<b>enter</b>()

Returns the enter selection: placeholder nodes for each datum that had no corresponding DOM element in the selection. The enter selection is always empty until the selection is joined to data by [*selection*.data](#selection_data). The enter selection is typically used to create “missing” elements from new data. For example, to create DIV elements from an array of numbers:

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

Conceptually, the enter selection’s placeholders are pointers to the parent element (in this example, the document body). The enter selection is typically only used transiently to append elements.

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

Returns the exit selection: existing DOM elements in the selection for which no new datum was found. The exit selection is always empty until the selection is joined to data by [*selection*.data](#selection_data). The exit selection is typically used to remove “superfluous” elements from old data. For example, to update the DIV elements created previously with a new array of numbers:

```js
div.data([1, 2, 4, 8, 16, 32], function(d) { return d; });
```

Since a key function was specified (as the identity function), and the new data contains the numbers [4, 8, 16] which match existing elements in the document, the update selection contains three DIV elements. We’ll leave those elements as-is. We can append new elements for [1, 2, 32] using the enter selection:

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

Note that the order of the DOM elements matches the order of the data. This is because the old data’s order and the new data’s order were consistent. If the new data’s order is different, use [*selection*.order](#selection_order) to reorder the elements in the DOM. See the [General Update Pattern](http://bl.ocks.org/mbostock/3808218) example thread for more on data joins.

<a name="selection_datum" href="#selection_datum">#</a> <i>selection</i>.<b>datum</b>([<i>value</i>])

Gets or sets the bound data for each selected element. Unlike [*selection*.data](#selection_data), this method does not compute a join and thus does not affect indexes or the enter and exit selections.

If a *value* is specified, sets the element’s bound data to the specified value on all selected elements. If the *value* is a constant, all elements are given the same datum; otherwise, if the *value* is a function, then the function is evaluated for each selected element, being passed the previous datum `d` and the current index `i`, with the `this` context as the current DOM element. The function is then used to set each element’s data. A null value will delete the bound data.

If a *value* is not specified, returns the bound datum for the first (non-null) element in the selection. This is generally useful only if you know the selection contains exactly one element.

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

### Events

For interaction, selections allow listening for and dispatching of events.

<a name="selection_on" href="#selection_on">#</a> <i>selection</i>.<b>on</b>(<i>type</i>[, <i>listener</i>[, <i>capture</i>]])

Adds or removes a *listener* to each selected element for the specified event *type*. The *type* is a string event type name, such as `click`, `mouseover`, or `submit`. (Any [DOM event type](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events) supported by your browser may be used.) The *listener* is invoked in the same manner as other operator functions, being passed the current datum *d* and index *i*, with the `this` context as the current DOM element. Listeners always see the latest datum for their element, but the index is a property of the selection and is fixed when the listener is assigned; to update the index, re-assign the listener. To access the current event within a listener, use [d3.event](#event).

If an event listener was already registered for the same *type* on a selected element, the existing listener is removed before the new listener is added. To register multiple listeners for a given type, the type may be followed by an optional namespace, such as `click.foo` and `click.bar`. To remove a listener, pass null as the *listener*. To remove all listeners for a particular namespace, pass null as the *listener* and `.foo` as the *type*, where *foo* is the namespace.

An optional *capture* flag may be specified, which corresponds to the W3C [useCapture flag](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration): “After initiating capture, all events of the specified type will be dispatched to the registered EventListener before being dispatched to any EventTargets beneath them in the tree. Events which are bubbling upward through the tree will not trigger an EventListener designated to use capture.”

If a *listener* is not specified, returns the currently-assigned listener for the specified event *type* on the first (non-null) selected element, if any.

<a name="selection_dispatch" href="#selection_dispatch">#</a> <i>selection</i>.<b>dispatch</b>(<i>type</i>[, <i>parameters</i>])

Dispatches a [custom event](http://www.w3.org/TR/dom/#interface-customevent) of the specified *type* to each selected element. An optional *parameters* map may be specified to set additional properties of the event: bubbles, cancelable, and detail. If *parameters* is a function, it will be invoked in the same manner as other operator functions, being passed the current datum `d` and index `i`, with the `this` context as the current DOM element. It must then return the parameters map for the current element.

<a name="event" href="#event">#</a> d3.<b>event</b>

The current [event](https://developer.mozilla.org/en-US/docs/DOM/event), if any. This is set during the invocation of an event listener, and is reset after the listener terminates. Use this to access standard event fields such as event.timeStamp, and methods such as event.preventDefault.

While you can use the native [event.pageX](https://developer.mozilla.org/en/DOM/event.pageX) and [event.pageY](https://developer.mozilla.org/en/DOM/event.pageY), it is often more convenient to transform the event position to the local coordinate system of the container that received the event using [d3.mouse](#mouse), [d3.touch](#touch) or [d3.touches](#touches).

<a name="mouse" href="#mouse">#</a> d3.<b>mouse</b>(<i>container</i>)

Returns the *x* and *y* coordinates of the [current event](#event) relative to the specified *container*. The container may be an HTML or SVG container element, such as a [G element](http://www.w3.org/TR/SVG/struct.html#Groups) or an [SVG element](http://www.w3.org/TR/SVG/struct.html#SVGElement). The coordinates are returned as a two-element array of numbers [*x*, *y*].

<a name="touch" href="#touch">#</a> d3.<b>touch</b>(<i>container</i>[, <i>touches</i>], <i>identifier</i>)

Returns the *x* and *y* coordinates of the touch with the specified *identifier* associated with the [current event](#event) relative to the specified *container*. The container may be an HTML or SVG container element, such as a [G element](http://www.w3.org/TR/SVG/struct.html#Groups) or an [SVG element](http://www.w3.org/TR/SVG/struct.html#SVGElement). The coordinates are returned as an array of two-element arrays of numbers \[\[*x1*, *y1*], [*x2*, *y2*], …\]. If there is no touch with the specified identifier in *touches*, returns null; this can be useful for ignoring touchmove events where the only some touches have moved. If *touches* is not specified, it defaults to the current event’s [changedTouches](http://developer.apple.com/library/safari/documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/javascript/instp/TouchEvent/changedTouches) property.

<a name="touches" href="#touches">#</a> d3.<b>touches</b>(<i>container</i>[, <i>touches</i>])

Returns the *x* and *y* coordinates of the touches associated with the [current event](#event) relative to the specified *container*. The container may be an HTML or SVG container element, such as a [G element](http://www.w3.org/TR/SVG/struct.html#Groups) or an [SVG element](http://www.w3.org/TR/SVG/struct.html#SVGElement). The coordinates are returned as an array of two-element arrays of numbers \[\[*x1*, *y1*], [*x2*, *y2*], …\]. If *touches* is not specified, it defaults to the current event’s [touches](http://developer.apple.com/library/safari/documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/javascript/instp/TouchEvent/touches) property.

### Control

For advanced usage, selections provide operators for custom control flow.

<a name="selection_each" href="#selection_each">#</a> <i>selection</i>.<b>each</b>(<i>function</i>)

Invokes the specified *function* for each selected element, passing in the current datum `d` and index `i`, with the `this` context of the current DOM element. This operator is used internally by most other operators, and can be used to invoke arbitrary code for each selected element.

<a name="selection_call" href="#selection_call">#</a> <i>selection</i>.<b>call</b>(<i>selection</i>[, <i>arguments…</i>])

Invokes the specified *function* (once), passing in the current selection along with any optional *arguments*, and returns the current selection. The call operator is identical to invoking a function by hand, but it facilitates method chaining. For example, to set several attributes in a reusable function:

```javascript
function name(selection, first, last) {
  selection
      .attr("first-name", first)
      .attr("last-name", last);
}
```

Now, we can say this:

```javascript
name(d3.selectAll("div"), "John", "Snow");
```

Or equivalently:

```javascript
d3.selectAll("div").call(name, "John", "Snow");
```

The `this` context of the called function is also the current selection. This is slightly redundant with the first argument, which we might fix in the future.

<a name="selection_empty" href="#selection_empty">#</a> <i>selection</i>.<b>empty</b>()

Returns true if this selection is empty. A selection is empty if it contains no elements, or all elements are null.

<a name="selection_nodes" href="#selection_nodes">#</a> <i>selection</i>.<b>nodes</b>()

Returns an array of all (non-null) elements in this selection.

<a name="selection_node" href="#selection_node">#</a> <i>selection</i>.<b>node</b>()

Returns the first (non-null) element in this selection. If the selection is empty, returns null.

<a name="selection_size" href="#selection_size">#</a> <i>selection</i>.<b>size</b>()

Returns the total number of elements in this selection.

### Namespaces

XML namespaces are fun! Right? Fortunately you can mostly ignore them.

<a name="namespace" href="#namespace">#</a> d3.<b>namespace</b>(<i>name</i>)

Qualifies the specified *name*, which may or may not have a namespace prefix. If the name contains a colon (`:`), the substring before the colon is interpreted as the namespace prefix, which must be registered in [d3.namespaces](#namespaces). Returns an object `space` and `local` attributes describing the full namespace URL and the local name. For example:

```js
d3.namespace("svg:text"); // {space: "http://www.w3.org/2000/svg", local: "text"}
```

If the name does not contain a colon, this function merely returns the input name.

<a name="namespaces" href="#namespaces">#</a> d3.<b>namespaces</b>

The map of registered namespace prefixes. The default value is:

```js
{
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
}
```

Additional prefixes may be assigned as needed to create elements or attributes in other namespaces.

<a name="requote" href="#requote">#</a> d3.<b>requote</b>(<i>string</i>)

Returns a quoted (escaped) version of the specified *string* that may be safely embedded within a regular expression as a string literal. For example:

```js
d3.requote("[]"); // "\[\]"
```
