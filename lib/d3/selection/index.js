var qualifyNamespace = require("../namespace/qualify");

function Selection(groups) {
  for (var j = 0, m = groups.length, g; j < m; ++j) {
    if (!Array.isArray(g = groups[j])) {
      groups[j] = arrayOf(g);
    }
  }
  this.groups = groups;
}

Selection.prototype = {
  select: function(selector) {
    selector = selectorOf(selector);

    for (var groups = this.groups, j = 0, m = groups.length, subgroups = new Array(m); j < m; ++j) {
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

    for (var groups = this.groups, j = 0, m = groups.length, subgroups = []; j < m; ++j) {
      for (var group = this[j], i = 0, n = group.length, subgroup, node; i < n; ++i) {
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

    for (var groups = this.groups, j = 0, m = groups.length, subgroups = new Array(m); j < m; ++j) {
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
    throw new Error("not yet implemented"); // TODO
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
    throw new Error("not yet implemented"); // TODO
  },
  property: function(name, value) {
    if (arguments.length < 2) return this.node()[name];

    return this.each(value == null
        ? function() { delete this[name]; }
        : (typeof value === "function"
            ? function() { var x = value.apply(this, arguments); if (x == null) delete this[name]; else this[name] = x; }
            : function() { this[name] = value; }));
  },
  properties: function(map) {
    throw new Error("not yet implemented"); // TODO
  },
  classed: function(name, value) {
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

    return this.each(typeof value === "function"
        ? function() { var i = -1, x = value.apply(this, arguments); while (++i < n) name[i](this, x); }
        : function() { var i = -1; while (++i < n) name[i](this, value); });
  },
  classeds: function(map) {
    throw new Error("not yet implemented"); // TODO
  },
  text: function(value) {
    if (!arguments.length) return this.node().textContent;

    return this.each(value == null
        ? function() { this.textContent = ""; }
        : typeof value === "function"
            ? function() { var v = value.apply(this, arguments); this.textContent = v == null ? "" : v; }
            : function() { this.textContent = value; });
  },
  html: function(value) {
    if (!arguments.length) return this.node().innerHTML;

    return this.each(value == null
        ? function() { this.innerHTML = ""; }
        : typeof value === "function"
            ? function() { var v = value.apply(this, arguments); this.innerHTML = v == null ? "" : v; }
            : function() { this.innerHTML = value; });
  },
  append: function(name) {
    name = creatorOf(name);
    return this.select(function() { return this.appendChild(name.apply(this, arguments)); });
  },
  insert: function(name, before) {
    name = creatorOf(name);
    before = selectorOf(before);
    return this.select(function() { return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null); });
  },
  remove: function() {
    return this.each(function() { var parent = this.parentNode; if (parent) parent.removeChild(this); });
  },
  data: function(value, key) {
    throw new Error("not yet implemented"); // TODO
  },
  datum: function(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.property("__data__");
  },
  order: function() {
    for (var groups = this.groups, j = 0, m = groups.length; j < m; ++j) {
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
    for (var groups = this.groups, j = -1, m = groups.length; ++j < m;) groups[j].sort(comparator);
    return this.order();
  },
  on: function(type, listener, capture) {
    throw new Error("not yet implemented"); // TODO
  },
  ons: function(map, capture) {
    throw new Error("not yet implemented"); // TODO
  },
  each: function(callback) {
    for (var groups = this.groups, j = 0, m = groups.length; j < m; ++j) {
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
    for (var groups = this.groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) return node;
      }
    }
    return null;
  },
  size: function() {
    for (var size = 0, groups = this.groups, j = 0, m = groups.length; j < m; ++j) {
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
    var document = global.document;
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
    var document = global.document;
    group = document.querySelectorAll(selector);
    group.parentNode = document.documentElement;
  } else { // selector is array of nodes
    group = selector;
    group.parentNode = null;
  }
  return new Selection([group]);
};

var slice = [].slice;

function arrayOf(array) { // conversion for NodeList, arguments, etc.
  return slice.call(array); // TODO fallback to manual is this is unsupported
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

function creatorOf(name) {
  return typeof name === "function"
      ? name
      : (name = qualifyNamespace(name)).local
          ? function() { return this.ownerDocument.createElementNS(name.space, name.local); }
          : function() { var document = this.ownerDocument, namespace = this.namespaceURI; return namespace ? document.createElementNS(namespace, name) : document.createElement(name); };
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

function classedRe(name) {
  return new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
}

function classerOf(name) {
  var re = classedRe(name);
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

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function collapse(string) {
  return string.trim().replace(/\s+/g, " ");
}

function requote(string) {
  return string.replace(requoteRe, "\\$&");
}

var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

module.exports = Selection;
