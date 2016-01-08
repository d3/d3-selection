import constant from "./constant";

var keyPrefix = "$";

// The value may either be an array or a function that returns an array.
// An optional key function may be specified to control how data is bound;
// if no key function is specified, data is bound to nodes by index.
// Or, if no arguments are specified, this method returns all bound data.
export default function(value, key) {
  if (!value) {
    var data = new Array(this.size()), i = -1;
    this.each(function(d) { data[++i] = d; });
    return data;
  }

  var depth = this._depth - 1,
      stack = new Array(depth * 2),
      bind = key ? bindKey : bindIndex,
      enter = this.enter(), // Note: arrayify’s!
      exit = this.exit();

  if (typeof value !== "function") value = constant(value);

  visit(this._root, enter._root, exit._root, depth);

  function visit(update, enter, exit, depth) {
    var i = -1,
        n,
        node;

    if (depth--) {
      var stack0 = depth * 2,
          stack1 = stack0 + 1;

      n = update.length;

      while (++i < n) {
        if (node = update[i]) {
          stack[stack0] = node._parent.__data__, stack[stack1] = i;
          visit(node, enter[i], exit[i], depth);
        }
      }
    }

    else {
      var j = 0,
          before;

      bind(update, enter, exit, value.apply(update._parent, stack));
      n = update.length;

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      while (++i < n) {
        if (before = enter[i]) {
          if (i >= j) j = i + 1;
          while (!(node = update[j]) && ++j < n);
          before._next = node || null;
        }
      }
    }
  }

  function bindIndex(update, enter, exit, data) {
    var i = 0,
        node,
        nodeLength = update.length,
        dataLength = data.length,
        minLength = Math.min(nodeLength, dataLength);

    // Clear the enter and exit arrays, and then initialize to the new length.
    enter.length = 0, enter.length = dataLength;
    exit.length = 0, exit.length = nodeLength;

    for (; i < minLength; ++i) {
      if (node = update[i]) {
        node.__data__ = data[i];
      } else {
        enter[i] = new EnterNode(update._parent, data[i]);
      }
    }

    // Note: we don’t need to delete update[i] here because this loop only
    // runs when the data length is greater than the node length.
    for (; i < dataLength; ++i) {
      enter[i] = new EnterNode(update._parent, data[i]);
    }

    // Note: and, we don’t need to delete update[i] here because immediately
    // following this loop we set the update length to data length.
    for (; i < nodeLength; ++i) {
      if (node = update[i]) {
        exit[i] = update[i];
      }
    }

    update.length = dataLength;
  }

  function bindKey(update, enter, exit, data) {
    var i,
        node,
        dataLength = data.length,
        nodeLength = update.length,
        nodeByKeyValue = {},
        keyStack = new Array(2).concat(stack),
        keyValues = new Array(nodeLength),
        keyValue;

    // Clear the enter and exit arrays, and then initialize to the new length.
    enter.length = 0, enter.length = dataLength;
    exit.length = 0, exit.length = nodeLength;

    // Compute the keys for each node.
    for (i = 0; i < nodeLength; ++i) {
      if (node = update[i]) {
        keyStack[0] = node.__data__, keyStack[1] = i;
        keyValues[i] = keyValue = keyPrefix + key.apply(node, keyStack);

        // Is this a duplicate of a key we’ve previously seen?
        // If so, this node is moved to the exit selection.
        if (nodeByKeyValue[keyValue]) {
          exit[i] = node;
        }

        // Otherwise, record the mapping from key to node.
        else {
          nodeByKeyValue[keyValue] = node;
        }
      }
    }

    // Now clear the update array and initialize to the new length.
    update.length = 0, update.length = dataLength;

    // Compute the keys for each datum.
    for (i = 0; i < dataLength; ++i) {
      keyStack[0] = data[i], keyStack[1] = i;
      keyValue = keyPrefix + key.apply(update._parent, keyStack);

      // Is there a node associated with this key?
      // If not, this datum is added to the enter selection.
      if (!(node = nodeByKeyValue[keyValue])) {
        enter[i] = new EnterNode(update._parent, data[i]);
      }

      // Did we already bind a node using this key? (Or is a duplicate?)
      // If unique, the node and datum are joined in the update selection.
      // Otherwise, the datum is ignored, neither entering nor exiting.
      else if (node !== true) {
        update[i] = node;
        node.__data__ = data[i];
      }

      // Record that we consumed this key, either to enter or update.
      nodeByKeyValue[keyValue] = true;
    }

    // Take any remaining nodes that were not bound to data,
    // and place them in the exit selection.
    for (i = 0; i < nodeLength; ++i) {
      if ((node = nodeByKeyValue[keyValues[i]]) !== true) {
        exit[i] = node;
      }
    }
  }

  return this;
};

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next || this._next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); }
};
