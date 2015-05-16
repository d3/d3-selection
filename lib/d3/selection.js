var namespace = require("./namespace");

var document = global.document,
    slice = [].slice,
    filteredEvents = {mouseenter: "mouseover", mouseleave: "mouseout"},
    requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

(function() {
  if (document) for (var type in filteredEvents) {
    if ("on" + type in document) {
      delete filteredEvents[type];
    }
  }
})();

function Selection(groups) {
  for (var j = 0, m = groups.length, g0, g1; j < m; ++j) {
    if (!Array.isArray(g0 = groups[j])) {
      groups[j] = g1 = arrayOf(g0);
      g1.parentNode = g0.parentNode;
    }
  }
  this._ = groups;
}

Selection.prototype = {

  select: function(selector) {
    selector = selectorOf(selector);

    for (var groups = this._, j = 0, m = groups.length, subgroups = new Array(m); j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, subgroup = subgroups[j] = new Array(n), node; i < n; ++i) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
      subgroup.parentNode = group.parentNode;
    }

    return new Selection(subgroups);
  },

  selectAll: function(selector) {
    selector = selectorAllOf(selector);

    for (var groups = this._, j = 0, m = groups.length, subgroups = []; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, subgroup, node; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(subgroup = selector.call(node, node.__data__, i, j));
          subgroup.parentNode = node;
        }
      }
    }

    return new Selection(subgroups);
  },

  filter: function(filter) {
    filter = filterOf(filter);

    for (var groups = this._, j = 0, m = groups.length, subgroups = new Array(m); j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, subgroup = subgroups[j] = [], node; i < n; ++i) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
      subgroup.parentNode = group.parentNode;
    }

    return new Selection(subgroups);
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

  append: function(name) {
    name = creatorOf(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  },

  insert: function(name, before) {
    name = creatorOf(name);
    before = selectorOf(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  },

  remove: function() {
    return this.each(function() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    });
  },

  data: function(value, key) {
    var groups = this._,
        group,
        node,
        j = -1,
        m = groups.length;

    if (!arguments.length) {
      var data = new Array(this.size()),
          k = 0;
      while (++j < m) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i, ++k) {
          if (node = group[i]) data[k] = node.__data__;
        }
      }
      return data;
    }

    var enterGroups = new Array(m),
        exitGroups = new Array(m);

    function bind(group, groupData, j) {
      var i,
          n = group.length,
          m = groupData.length,
          n0 = Math.min(n, m),
          updateGroup = new Array(m),
          enterGroup = new Array(m),
          exitGroup = new Array(n),
          node,
          nodeData;

      if (key) {
        var nodeByKeyValue = new Map, // TODO polyfill for old browsers?
            keyValues = new Array(n),
            keyValue;

        for (i = -1; ++i < n;) {
          if (nodeByKeyValue.has(keyValue = key.call(node = group[i], node.__data__, i, j))) {
            exitGroup[i] = node; // duplicate selection key
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
          keyValues[i] = keyValue;
        }

        for (i = -1; ++i < m;) {
          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
            enterGroup[i] = new Placeholder(nodeData);
          } else if (node !== true) { // no duplicate data key
            updateGroup[i] = node;
            node.__data__ = nodeData;
          }
          nodeByKeyValue.set(keyValue, true);
        }

        for (i = -1; ++i < n;) {
          if (nodeByKeyValue.get(keyValues[i]) !== true) {
            exitGroup[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0;) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateGroup[i] = node;
          } else {
            enterGroup[i] = new Placeholder(nodeData);
          }
        }
        for (; i < m; ++i) {
          enterGroup[i] = new Placeholder(groupData[i]);
        }
        for (; i < n; ++i) {
          exitGroup[i] = group[i];
        }
      }

      enterGroup.update = updateGroup;
      enterGroup.parentNode = updateGroup.parentNode = exitGroup.parentNode = group.parentNode;
      enterGroups[j] = enterGroup;
      groups[j] = updateGroup;
      exitGroups[j] = exitGroup;
    }

    if (typeof value === "function") {
      while (++j < m) {
        bind(group = groups[j], value.call(group, group.parentNode.__data__, j), j);
      }
    } else {
      while (++j < m) {
        bind(group = groups[j], value, j);
      }
    }

    this.enter = new EnterSelection(enterGroups);
    this.exit = new Selection(exitGroups);
    return this;
  },

  datum: function(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.property("__data__");
  },

  order: function() {
    for (var groups = this._, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  },

  sort: function(comparator) {
    comparator = arguments.length ? comparatorOf(comparator) : ascending;
    for (var groups = this._, j = -1, m = groups.length; ++j < m;) groups[j].sort(comparator);
    return this.order();
  },

  event: function(type, listener, capture) {
    var n = arguments.length,
        key = "__on" + type,
        wrap = listenerOf;

    if (n < 2) return (n = this.node()[key]) && n._;

    if (n < 3) capture = false;

    if ((n = type.indexOf(".")) > 0) type = type.slice(0, n);

    if (filteredEvents.hasOwnProperty(type)) wrap = filteredListenerOf, type = filteredEvents[type];

    function add() {
      var l = wrap(listener, arrayOf(arguments));
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
      return dispatchTo(this, type, params);
    }

    function dispatchFunction() {
      return dispatchTo(this, type, params.apply(this, arguments));
    }

    return this.each(typeof params === "function"
        ? dispatchFunction
        : dispatchConstant);
  },

  each: function(callback) {
    for (var groups = this._, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, j);
      }
    }
    return this;
  },

  call: function(callback) {
    var args = arrayOf(arguments);
    callback.apply(args[0] = this, args);
    return this;
  },

  empty: function() {
    return !this.node();
  },

  nodes: function() {
    for (var nodes = new Array(this.size()), groups = this._, j = 0, k = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i, ++k) {
        if (node = group[i]) nodes[k] = node;
      }
    }
    return nodes;
  },

  node: function() {
    for (var groups = this._, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) return node;
      }
    }
    return null;
  },

  size: function() {
    for (var size = 0, groups = this._, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        if (group[i]) ++size;
      }
    }
    return size;
  }
};

Selection.select = function(selector) {
  var group;
  if (typeof selector === "string") {
    group = [document.querySelector(selector)];
    group.parentNode = document.documentElement;
  } else { // selector is node
    group = [selector];
    group.parentNode = documentElementOf(selector);
  }
  return new Selection([group]);
};

Selection.selectAll = function(selector) {
  var group;
  if (typeof selector === "string") {
    group = document.querySelectorAll(selector);
    group.parentNode = document.documentElement;
  } else { // selector is array of nodes
    group = selector;
    group.parentNode = null;
  }
  return new Selection([group]);
};

function EnterSelection(groups) {
  Selection.call(this, groups);
}

EnterSelection.prototype = Object.create(Selection.prototype);

EnterSelection.prototype.select = function(creator) { // Note: not selector!
  for (var groups = this._, j = 0, m = groups.length, subgroups = new Array(m); j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, subgroup = subgroups[j] = new Array(n), node, d; i < n; ++i) {
      if (node = group[i]) {
        (subgroup[i] = group.update[i] = creator.call(group.parentNode, d = node.__data__, i, j)).__data__ = d;
      }
    }
    subgroup.parentNode = group.parentNode;
  }

  return new Selection(subgroups);
};

EnterSelection.prototype.insert = function(name, before) {
  if (arguments.length < 2) before = selectorUpdateOf(this._);
  return Selection.prototype.insert.call(this, name, before);
};

function Placeholder(data) {
  this.__data__ = data;
}

function arrayOf(array) { // conversion for NodeList, arguments, etc.
  return slice.call(array); // TODO fallback to manual if this is unsupported
}

function wordsOf(string) {
  return (string + "").trim().split(/^|\s+/);
}

function noop() {}

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

function selectorUpdateOf(groups) {
  var i0, j0;
  return function(d, i, j) {
    var group = groups[j].update,
        n = group.length,
        node;
    if (j != j0) j0 = j, i0 = 0;
    if (i >= i0) i0 = i + 1;
    while (!(node = group[i0]) && ++i0 < n);
    return node;
  };
}

function filterOf(filter) {
  return typeof filter === "function" ? filter : function() {
    return this.matches(filter); // TODO vendor-specific matchesSelector
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

function documentElementOf(node) {
  return node
      && (node.ownerDocument // node is a Element
      || node.document // node is a Window
      || node).documentElement; // node is a Document
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

function listenerOf(listener, args) {
  return function(e) {
    var o = global.d3.event; // Events can be reentrant (e.g., focus).
    global.d3.event = e;
    args[0] = this.__data__;
    try {
      listener.apply(this, args);
    } finally {
      global.d3.event = o;
    }
  };
}

function filteredListenerOf(listener, args) {
  var l = listenerOf(listener, args);
  return function(e) {
    var target = this, related = e.relatedTarget;
    if (!related || (related !== target && !(related.compareDocumentPosition(target) & 8))) {
      l.call(target, e);
    }
  };
}

function dispatchTo(node, type, params) {
  var window = windowOf(node),
      CustomEvent = window.CustomEvent || customEventOf(window);
  node.dispatchEvent(new CustomEvent(type, params));
}

function customEventOf(window) {

  function CustomEvent(type, params) {
    var event = document.createEvent("CustomEvent");
    if (params) event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
    else event.initCustomEvent(type, false, false, undefined);
    return event;
  }

  CustomEvent.prototype = window.Event.prototype;

  return window.CustomEvent = CustomEvent;
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
