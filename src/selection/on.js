import requote from "../requote";
import noop from "../noop";

var filterEvents = {};

export var event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function contextListener(listener, ancestors, args) {
  return function(event1) {
    var i = ancestors.length, event0 = event; // Events can be reentrant (e.g., focus).
    while (--i >= 0) args[i << 1] = ancestors[i].__data__;
    event = event1;
    try {
      listener.apply(ancestors[0], args);
    } finally {
      event = event0;
    }
  };
}

function filterListener(listener) {
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener(event);
    }
  };
}

function onRemove(key, type) {
  return function() {
    var l = this[key];
    if (l) {
      this.removeEventListener(type, l, l._capture);
      delete this[key];
    }
  };
}

function onRemoveAll(dotname) {
  var re = new RegExp("^__on([^.]+)" + requote(dotname) + "$");
  return function() {
    for (var key in this) {
      var match = key.match(re);
      if (match) {
        var l = this[key];
        this.removeEventListener(match[1], l, l._capture);
        delete this[key];
      }
    }
  };
}

function onAdd(root, filter, key, type, listener, capture) {
  if (capture == null) capture = false;
  return function() {
    var ancestor = root, i = arguments.length >> 1, ancestors = new Array(i);
    while (--i >= 0) ancestor = ancestor[arguments[(i << 1) + 1]], ancestors[i] = i ? ancestor._parent : ancestor;
    var value = this[key];
    if (value) this.removeEventListener(type, value, value._capture);
    value = contextListener(listener, ancestors, arguments);
    if (filter) value = filterListener(value);
    this.addEventListener(type, this[key] = value, value._capture = capture);
    value._listener = listener;
  };
}

export default function(type, listener, capture) {
  var value,
      name = type + "",
      key = "__on" + name,
      filter;

  if (arguments.length < 2) return (value = this.node()[key]) && value._listener;
  if ((value = name.indexOf(".")) > 0) name = name.slice(0, value);
  if (filter = filterEvents.hasOwnProperty(name)) name = filterEvents[name];

  return this.each(listener
      ? (value ? onAdd(this._root, filter, key, type, listener, capture) : noop) // Attempt to add untyped listener is ignored.
      : (value ? onRemove(key, name) : onRemoveAll(name)));
};
