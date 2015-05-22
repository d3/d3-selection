var namespace = require("./namespace");

var document = global.document,
    CustomEvent = global.CustomEvent,
    Map = global.Map,
    slice = [].slice,
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"},
    requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

// Initialize polyfills.
if (document) {
  for (var type in filterEvents) {
    if ("on" + type in document) {
      delete filterEvents[type];
    }
  }

  if (!CustomEvent) {
    CustomEvent = function(type, params) {
      var event = document.createEvent("CustomEvent");
      if (params) event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
      else event.initCustomEvent(type, false, false, undefined);
      return event;
    };
    CustomEvent.prototype = global.Event.prototype;
  }

  if (!Map) {
    Map = function() {};
    Map.prototype = {
      set: function(key, value) { this["$" + key] = value; return this; },
      get: function(key) { return this["$" + key]; },
      has: function(key) { return "$" + key in this; }
    };
  }
}

// When depth = 1, root = [Node, …].
// When depth = 2, root = [[Node, …], …].
// When depth = 3, root = [[[Node, …], …], …]. etc.
// Note that [Node, …] and NodeList are used interchangeably; see arrayify.
function Selection(root, depth) {
  root._parent = null;
  this._root = root;
  this._depth = depth;
}

Selection.prototype = {

  // The selector may either be a selector string (e.g., ".foo")
  // or a function that optionally returns the node to select.
  select: function(selector) {
    var depth = this._depth,
        stack = new Array(depth * 2);

    selector = selectorOf(selector);

    function visit(nodes, depth) {
      var i = -1,
          n = nodes.length,
          update,
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

      // The leaf group may be sparse if the selector returns a falsey value;
      // this preserves the index of nodes (unlike selection.filter).
      // Data is propagated to the new node only if it is defined on the old.
      // If this is an enter selection, materialized nodes are moved to update.
      else {
        update = nodes._update;
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

    return new Selection(visit(this._root, depth), depth);
  },

  // The selector may either be a selector string (e.g., ".foo")
  // or a function that optionally returns an array of nodes to select.
  // This is the only operation that increases the depth of a selection.
  selectAll: function(selector) {
    var depth = this._depth,
        stack = new Array(depth * 2);

    selector = selectorAllOf(selector);

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
  },

  // The filter may either be a selector string (e.g., ".foo")
  // or a function that returns a boolean.
  filter: function(filter) {
    var depth = this._depth,
        stack = new Array(depth * 2);

    filter = filterOf(filter);

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
  },

  // The value may either be an array or a function that returns an array.
  // An optional key function may be specified to control how data is bound;
  // if no key function is specified, data is bound to nodes by index.
  // Or, if no arguments are specified, this method returns all bound data.
  data: function(value, key) {
    if (!value) {
      var data = new Array(this.size()), i = -1;
      this.each(function(d) { data[++i] = d; });
      return data;
    }

    var depth = this._depth - 1,
        stack = new Array(depth * 2),
        bind = key ? bindKey : bindIndex;

    this.enter(); // initializes _enter and _update references
    this.exit(); // initializes _exit references
    value = valueOf(value);
    visit(this._root, depth);

    function visit(nodes, depth) {
      var i = -1,
          n,
          node;

      if (depth--) {
        var stack0 = depth * 2,
            stack1 = stack0 + 1;

        n = nodes.length;

        while (++i < n) {
          if (node = nodes[i]) {
            stack[stack0] = node._parent.__data__, stack[stack1] = i;
            visit(node, depth);
          }
        }
      }

      else {
        var j = 0,
            enter = nodes._enter,
            before;

        bind(nodes, value.apply(nodes._parent, stack));
        n = nodes.length;

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        while (++i < n) {
          if (before = enter[i]) {
            if (i >= j) j = i + 1;
            while (!(node = nodes[j]) && ++j < n);
            before._next = node || null;
          }
        }
      }
    }

    function bindIndex(update, data) {
      var i = 0,
          node,
          enter = update._enter,
          exit = update._exit,
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

    function bindKey(update, data) {
      var i,
          node,
          enter = update._enter,
          exit = update._exit,
          dataLength = data.length,
          nodeLength = update.length,
          nodeByKeyValue = new Map,
          keyStack = [null, null].concat(stack),
          keyValues = new Array(nodeLength),
          keyValue;

      // Clear the enter and exit arrays, and then initialize to the new length.
      enter.length = 0, enter.length = dataLength;
      exit.length = 0, exit.length = nodeLength;

      // Compute the keys for each node.
      for (i = 0; i < nodeLength; ++i) {
        if (node = update[i]) {
          keyStack[0] = node.__data__, keyStack[1] = i;
          keyValues[i] = keyValue = key.apply(node, keyStack);

          // Is this a duplicate of a key we’ve previously seen?
          // If so, this node is moved to the exit selection.
          if (nodeByKeyValue.has(keyValue)) {
            delete update[i];
            exit[i] = node;
          }

          // Otherwise, record the mapping from key to node.
          else {
            nodeByKeyValue.set(keyValue, node);
          }
        }
      }

      // Now clear the update array and initialize to the new length.
      update.length = 0, update.length = dataLength;

      // Compute the keys for each datum.
      for (i = 0; i < dataLength; ++i) {
        keyStack[0] = data[i], keyStack[1] = i;
        keyValue = key.apply(update._parent, keyStack);

        // Is there a node associated with this key?
        // If not, this datum is added to the enter selection.
        if (!(node = nodeByKeyValue.get(keyValue))) {
          enter[i] = new EnterNode(update._parent, data[i]);
        }

        // Did we already bind a node using this key?
        // If not, the node and datum are joined in the update selection.
        // Otherwise, the datum is ignored, neither entering nor exiting.
        else if (node !== true) { // no duplicate data key
          update[i] = node;
          node.__data__ = data[i];
        }

        // Record that we consumed this key, either to enter or update.
        nodeByKeyValue.set(keyValue, true);
      }

      // Take any remaining nodes that were not bound to data,
      // and place them in the exit selection.
      for (i = 0; i < nodeLength; ++i) {
        if ((node = nodeByKeyValue.get(keyValues[i])) !== true) {
          exit[i] = node;
        }
      }
    }

    return this;
  },

  // Lazily constructs the enter selection for this (update) selection.
  // Until this selection is joined to data, the enter selection will be empty.
  enter: function() {
    if (!this._enter) {

      function visit(nodes, depth) {
        var i = -1,
            n = nodes.length,
            node,
            enter = new Array(n);

        if (--depth) {
          while (++i < n) {
            if (node = nodes[i]) {
              enter[i] = visit(node, depth);
            }
          }
        }

        else {
          nodes._enter = enter;
          enter._update = nodes;
        }

        enter._parent = nodes._parent;
        return enter;
      }

      arrayify(this);
      this._enter = new Selection(visit(this._root, this._depth), this._depth);
    }
    return this._enter;
  },

  // Lazily constructs the exit selection for this (update) selection.
  // Until this selection is joined to data, the exit selection will be empty.
  exit: function() {
    if (!this._exit) {

      function visit(nodes, depth) {
        var i = -1,
            n = nodes.length,
            node,
            exit = new Array(n);

        if (--depth) {
          while (++i < n) {
            if (node = nodes[i]) {
              exit[i] = visit(node, depth);
            }
          }
        }

        else {
          nodes._exit = exit;
        }

        exit._parent = nodes._parent;
        return exit;
      }

      arrayify(this);
      this._exit = new Selection(visit(this._root, this._depth), this._depth);
    }
    return this._exit;
  },

  order: function() {

    function visit(nodes, depth) {
      var i = nodes.length,
          node,
          next;

      if (--depth) {
        while (--i >= 0) {
          if (node = nodes[i]) {
            visit(node, depth);
          }
        }
      }

      else {
        next = nodes[--i];
        while (--i >= 0) {
          if (node = nodes[i]) {
            if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }
    }

    visit(this._root, this._depth);
    return this;
  },

  sort: function(comparator) {
    comparator = comparator ? comparatorOf(comparator) : ascending;

    function visit(nodes, depth) {
      if (--depth) {
        var i = -1,
            n = nodes.length,
            node;
        while (++i < n) {
          if (node = nodes[i]) {
            visit(node, depth);
          }
        }
      }

      else {
        nodes.sort(comparator);
      }
    }

    arrayify(this);
    visit(this._root, this._depth);
    return this.order();
  },

  call: function() {
    var callback = arguments[0];
    callback.apply(arguments[0] = this, arguments);
    return this;
  },

  nodes: function() {
    var nodes = new Array(this.size()), i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
  },

  node: function() {

    function visit(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node;

      if (--depth) {
        while (++i < n) {
          if (node = nodes[i]) {
            if (node = visit(node, depth)) {
              return node;
            }
          }
        }
      }

      else {
        while (++i < n) {
          if (node = nodes[i]) {
            return node;
          }
        }
      }
    }

    return visit(this._root, this._depth);
  },

  size: function() {
    var size = 0;
    this.each(function() { ++size; });
    return size;
  },

  empty: function() {
    return !this.node();
  },

  each: function(callback) {
    var depth = this._depth,
        stack = new Array(depth);

    function visit(nodes, depth) {
      var i = -1,
          n = nodes.length,
          node;

      if (--depth) {
        var stack0 = depth * 2,
            stack1 = stack0 + 1;
        while (++i < n) {
          if (node = nodes[i]) {
            stack[stack0] = node._parent.__data__, stack[stack1] = i;
            visit(node, depth);
          }
        }
      }

      else {
        while (++i < n) {
          if (node = nodes[i]) {
            stack[0] = node.__data__, stack[1] = i;
            callback.apply(node, stack);
          }
        }
      }
    }

    visit(this._root, depth);
    return this;
  },

  attr: function(name, value) {
    name = namespace.qualify(name);

    if (arguments.length < 2) {
      var node = this.node();
      return name.local
          ? node.getAttributeNS(name.space, name.local)
          : node.getAttribute(name);
    }

    function remove() {
      this.removeAttribute(name);
    }

    function removeNS() {
      this.removeAttributeNS(name.space, name.local);
    }

    function setConstant() {
      this.setAttribute(name, value);
    }

    function setConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }

    function setFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name);
      else this.setAttribute(name, x);
    }

    function setFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local);
      else this.setAttributeNS(name.space, name.local, x);
    }

    return this.each(value == null
        ? (name.local ? removeNS : remove)
        : (typeof value === "function"
            ? (name.local ? setFunctionNS : setFunction)
            : (name.local ? setConstantNS : setConstant)));
  },

  style: function(name, value, priority) {
    var n = arguments.length;

    if (n < 2) return windowOf(n = this.node()).getComputedStyle(n, null).getPropertyValue(name);

    if (n < 3) priority = "";

    function remove() {
      this.style.removeProperty(name);
    }

    function setConstant() {
      this.style.setProperty(name, value, priority);
    }

    function setFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name);
      else this.style.setProperty(name, x, priority);
    }

    return this.each(value == null
        ? remove
        : (typeof value === "function"
            ? setFunction
            : setConstant));
  },

  property: function(name, value) {
    if (arguments.length < 2) return this.node()[name];

    function remove() {
      delete this[name];
    }

    function setConstant() {
      this[name] = value;
    }

    function setFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name];
      else this[name] = x;
    }

    return this.each(value == null
        ? remove
        : (typeof value === "function"
            ? setFunction
            : setConstant));
  },

  class: function(name, value) {
    name = wordsOf(name);
    var n = name.length;

    if (arguments.length < 2) {
      var node = this.node(), i = -1;
      if (value = node.classList) { // SVG elements may not support DOMTokenList!
        while (++i < n) if (!value.contains(name[i])) return false;
      } else {
        value = node.getAttribute("class");
        while (++i < n) if (!classedRe(name[i]).test(value)) return false;
      }
      return true;
    }

    name = name.map(classerOf);

    function setConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }

    function setFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }

    return this.each(typeof value === "function"
        ? setFunction
        : setConstant);
  },

  text: function(value) {
    if (!arguments.length) return this.node().textContent;

    function setConstant() {
      this.textContent = value;
    }

    function setFunction() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    }

    if (value == null) value = "";

    return this.each(typeof value === "function"
        ? setFunction
        : setConstant);
  },

  html: function(value) {
    if (!arguments.length) return this.node().innerHTML;

    function setConstant() {
      this.innerHTML = value;
    }

    function setFunction() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    }

    if (value == null) value = "";

    return this.each(typeof value === "function"
        ? setFunction
        : setConstant);
  },

  append: function(creator, selector) {
    creator = creatorOf(creator);

    function append() {
      return this.appendChild(creator.apply(this, arguments));
    }

    function insert() {
      return this.insertBefore(creator.apply(this, arguments), selector.apply(this, arguments) || null);
    }

    return this.select(arguments.length < 2
        ? append
        : (selector = selectorOf(selector)), insert);
  },

  remove: function() {
    return this.each(function() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    });
  },

  datum: function(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  },

  event: function(type, listener, capture) {
    var n = arguments.length,
        key = "__on" + type,
        filter,
        root = this._root;

    if (n < 2) return (n = this.node()[key]) && n._;

    if (n < 3) capture = false;
    if ((n = type.indexOf(".")) > 0) type = type.slice(0, n);
    if (filter = filterEvents.hasOwnProperty(type)) type = filterEvents[type];

    function add() {
      var ancestor = root, i = arguments.length >> 1, ancestors = new Array(i);
      while (--i >= 0) ancestor = ancestor[arguments[(i << 1) + 1]], ancestors[i] = i ? ancestor._parent : ancestor;
      var l = listenerOf(listener, ancestors, arguments);
      if (filter) l = filterListenerOf(l);
      remove.call(this);
      this.addEventListener(type, this[key] = l, l.$ = capture);
      l._ = listener;
    }

    function remove() {
      var l = this[key];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[key];
      }
    }

    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }

    return this.each(listener
        ? (n ? add : noop) // Attempt to add untyped listener is ignored.
        : (n ? remove : removeAll));
  },

  dispatch: function(type, params) {

    function dispatchConstant() {
      return this.dispatchEvent(new CustomEvent(type, params));
    }

    function dispatchFunction() {
      return this.dispatchEvent(new CustomEvent(type, params.apply(this, arguments)));
    }

    return this.each(typeof params === "function"
        ? dispatchFunction
        : dispatchConstant);
  }
};

Selection.select = function(selector) {
  return new Selection([typeof selector === "string" ? document.querySelector(selector) : selector], 1);
};

Selection.selectAll = function(selector) {
  return new Selection(typeof selector === "string" ? document.querySelectorAll(selector) : selector, 1);
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
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next || this._next); }
};

function noop() {}

// The leaf groups of the selection hierarchy are initially NodeList,
// and then lazily converted to arrays when mutation is required.
function arrayify(selection) {

  function visit(nodes, depth) {
    if (--depth) {
      var i = -1,
          n = nodes.length,
          node;
      while (++i < n) {
        if (node = nodes[i]) {
          nodes[i] = visit(node, depth);
        }
      }
    }

    else if (!Array.isArray(nodes)) {
      var parent = nodes._parent;
      nodes = slice.call(nodes); // TODO IE9
      nodes._parent = parent;
    }

    return nodes;
  }

  selection._root = visit(selection._root, selection._depth)
}

function wordsOf(string) {
  return (string + "").trim().split(/^|\s+/);
}

function selectorOf(selector) {
  return typeof selector === "function" ? selector : function() {
    return this.querySelector(selector);
  };
}

function selectorAllOf(selector) {
  return typeof selector === "function" ? selector : function() {
    return this.querySelectorAll(selector);
  };
}

function filterOf(filter) {
  return typeof filter === "function" ? filter : function() {
    return this.matches(filter); // TODO vendor-specific matchesSelector
  };
}

function valueOf(value) {
  return typeof value === "function" ? value : function() {
    return value;
  };
}

function creatorOf(name) {

  function creator() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri
        ? document.createElementNS(uri, name)
        : document.createElement(name);
  }

  function creatorNS() {
    return this.ownerDocument.createElementNS(name.space, name.local);
  }

  return typeof name === "function"
      ? name
      : (name = namespace.qualify(name)).local
          ? creatorNS
          : creator;
}

function windowOf(node) {
  return node
      && ((node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView); // node is a Document
}

function comparatorOf(comparator) {
  return function(a, b) {
    return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
  };
}

function classRe(name) {
  return new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
}

function classerOf(name) {
  var re = classRe(name);
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", collapse(c + " " + name));
    } else {
      node.setAttribute("class", collapse(c.replace(re, " ")));
    }
  };
}

function listenerOf(listener, ancestors, args) {
  return function(event) {
    var i = ancestors.length, event0 = global.d3.event; // Events can be reentrant (e.g., focus).
    while (--i >= 0) args[i << 1] = ancestors[i].__data__;
    global.d3.event = event;
    try {
      listener.apply(ancestors[0], args);
    } finally {
      global.d3.event = event0;
    }
  };
}

function filterListenerOf(listener) {
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener(event);
    }
  };
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function collapse(string) {
  return string.trim().replace(/\s+/g, " ");
}

function requote(string) {
  return string.replace(requoteRe, "\\$&");
}

module.exports = Selection;
