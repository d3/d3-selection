var qualifyNamespace = require("../namespace/qualify");

function Selection(groups) {
  for (var j = 0, m = groups.length, g; j < m; ++j) {
    if (!Array.isArray(g = groups[j])) {
      groups[j] = arrayOf(g);
    }
  }
  this._ = groups;
}

Selection.prototype = {
  select: function(selector) {
    selector = selectorOf(selector);

    for (var groups = this._, j = 0, m = groups.length, subgroups = new Array(m); j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, subgroup = new Array(n), node; i < n; ++i) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
      subgroups[j] = subgroup;
      subgroup.parentNode = group.parentNode;
    }

    return new Selection(subgroups);
  },
  selectAll: function(selector) {
    selector = selectorAllOf(selector);

    for (var groups = this._, j = 0, m = groups.length, subgroups = []; j < m; ++j) {
      for (var group = this[j], i = 0, n = group.length, subgroup, node; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(subgroup = selector.call(node, node.__data__, i, j));
          subgroup.parentNode = node;
        }
      }
    }

    return new Selection(subgroups);
  },
  attr: function(name, value) {
    name = qualifyNamespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return name.local
          ? node.getAttributeNS(name.space, name.local)
          : node.getAttribute(name);
    }

    return this.each(value == null
        ? (name.local
            ? function() { this.removeAttributeNS(name.space, name.local); }
            : function() { this.removeAttribute(name); })
        : (typeof value === "function"
            ? (name.local
                ? function() { var x = value.apply(this, arguments); if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x); }
                : function() { var x = value.apply(this, arguments); if (x == null) this.removeAttribute(name); else this.setAttribute(name, x); })
            : (name.local
                ? function() { this.setAttributeNS(name.space, name.local, value); }
                : function() { this.setAttribute(name, value); })));
  },
  attrs: function(map) {
    throw new Error("not yet implemented");
  },
  style: function(name, value, priority) {
    var n = arguments.length;

    if (n < 2) {
      var node = this.node();
      return windowOf(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    if (n < 3) priority = "";

    return this.each(value == null
        ? function() { this.style.removeProperty(name); }
        : (typeof value === "function"
            ? function() { var x = value.apply(this, arguments); if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority); }
            : function() { this.style.setProperty(name, value, priority); }));
  },
  styles: function(map) {
    throw new Error("not yet implemented");
  },
  property: function(name, value) {

  },
  properties: function(map) {
    throw new Error("not yet implemented");
  },
  classed: function(name, value) {

  },
  text: function(value) {

  },
  html: function(value) {

  },
  append: function(name) {

  },
  insert: function(name) {

  },
  remove: function() {

  },
  data: function(value, key) {

  },
  datum: function() {

  },
  filter: function(selector) {

  },
  order: function() {

  },
  sort: function(comparator) {

  },
  on: function(type, listener, capture) {

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
  node: function() {
    for (var size = 0, groups = this._, j = 0, m = groups.length; j < m; ++j) {
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

var slice = [].slice;

function arrayOf(array) { // conversion for NodeList, arguments, etc.
  return slice.call(array);
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

function windowOf(node) {
  return node
      && ((node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView); // node is a Document
}

module.exports = Selection;
