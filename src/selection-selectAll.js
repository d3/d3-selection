import {Selection} from "./selection";

// The selector may either be a selector string (e.g., ".foo")
// or a function that optionally returns an array of nodes to select.
// This is the only operation that increases the depth of a selection.
export default function(selector) {
  var depth = this._depth,
      stack = new Array(depth * 2);

  if (typeof selector !== "function") selector = selectorAllOf(selector);

  function visit(nodes, depth) {
    var i = -1,
        n = nodes.length,
        node,
        subnode,
        subnodes = new Array(n);

    if (--depth) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;
      while (++i < n) {
        if (node = nodes[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          subnodes[i] = visit(node, depth);
        }
      }
    }

    // Data is not propagated since there is a one-to-many mapping.
    // The parent of the new leaf group is the old node.
    else {
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          subnodes[i] = subnode = selector.apply(node, stack);
          subnode._parent = node;
        }
      }
    }

    subnodes._parent = nodes._parent;
    return subnodes;
  }

  return new Selection(visit(this._root, depth), depth + 1);
};

function selectorAllOf(selector) {
  return function() {
    return this.querySelectorAll(selector);
  };
}
