import {Selection} from "./selection";
import selectorOf from "./selectorOf";

// The selector may either be a selector string (e.g., ".foo")
// or a function that optionally returns the node to select.
export default function(selector) {
  var depth = this._depth,
      stack = new Array(depth * 2);

  if (typeof selector !== "function") selector = selectorOf(selector);

  function visit(nodes, update, depth) {
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
          subnodes[i] = visit(node, update && update[i], depth);
        }
      }
    }

    // The leaf group may be sparse if the selector returns a falsey value;
    // this preserves the index of nodes (unlike selection.filter).
    // Propagate data to the new node only if it is defined on the old.
    // If this is an enter selection, materialized nodes are moved to update.
    else {
      while (++i < n) {
        if (node = nodes[i]) {
          stack[0] = node.__data__, stack[1] = i;
          if (subnode = selector.apply(node, stack)) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            if (update) update[i] = subnode, delete nodes[i];
            subnodes[i] = subnode;
          }
        }
      }
    }

    subnodes._parent = nodes._parent;
    return subnodes;
  }

  return new Selection(visit(this._root, this._update && this._update._root, depth), depth);
};
