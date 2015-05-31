import {Selection} from "./selection";

// The filter may either be a selector string (e.g., ".foo")
// or a function that returns a boolean.
export default function(filter) {
  var depth = this._depth,
      stack = new Array(depth * 2);

  if (typeof filter !== "function") filter = filterOf(filter);

  function visit(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node,
        subnodes;

    if (--depth) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;
      subnodes = new Array(n);
      while (++i < n) {
        if (node = nodes[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          subnodes[i] = visit(node, depth);
        }
      }
    }

    // The filter operation does not preserve the original index,
    // so the resulting leaf groups are dense (not sparse).
    else {
      subnodes = [];
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          if (filter.apply(node, stack)) {
            subnodes.push(node);
          }
        }
      }
    }

    subnodes._parent = nodes._parent;
    return subnodes;
  }

  return new Selection(visit(this._root, depth), depth);
};

var filterOf = function(selector) {
  return function() {
    return this.matches(selector);
  };
};

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!element.matches) {
    var vendorMatches = element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;
    filterOf = function(selector) { return function() { return vendorMatches.call(this, selector); }; };
  }
}
