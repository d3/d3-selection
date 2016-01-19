import arrayify from "./arrayify";
import constant from "../constant";

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, update, enter, exit, data) {
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
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Note: we don’t need to delete update[i] here because this loop only
  // runs when the data length is greater than the node length.
  for (; i < dataLength; ++i) {
    enter[i] = new EnterNode(parent, data[i]);
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

function bindKey(parent, update, enter, exit, data, key) {
  var i,
      node,
      dataLength = data.length,
      nodeLength = update.length,
      nodeByKeyValue = {},
      keyValues = new Array(nodeLength),
      keyValue;

  // Clear the enter and exit arrays, and then initialize to the new length.
  enter.length = 0, enter.length = dataLength;
  exit.length = 0, exit.length = nodeLength;

  // Compute the keys for each node.
  for (i = 0; i < nodeLength; ++i) {
    if (node = update[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, update);

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
    keyValue = keyPrefix + key.call(parent, data[i], i, data);

    // Is there a node associated with this key?
    // If not, this datum is added to the enter selection.
    if (!(node = nodeByKeyValue[keyValue])) {
      enter[i] = new EnterNode(parent, data[i]);
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

export default function(value, key) {
  if (!value) {
    var data = new Array(this.size()), i = -1;
    this.each(function(d) { data[++i] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      update = arrayify(this),
      enter = (this._enter = this.enter())._nodes,
      exit = (this._exit = this.exit())._nodes;

  if (typeof value !== "function") value = constant(value);

  for (var m = update.length, j = 0; j < m; ++j) {
    var group = update[j],
        parent = parents[j];

    bind(parent, group, enter[j], exit[j], value.call(parent, parent && parent.__data__, j, group), key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var n = group.length, i0 = 0, i1 = 0, previous, next; i0 < n; ++i0) {
      if (previous = enter[j][i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = group[i1]) && ++i1 < n);
        previous._next = next || null;
      }
    }
  }

  return this;
}

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
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};
