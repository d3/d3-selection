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

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).
    event = event1;
    try {
      listener.call(this, this.__data__, index, group);
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

function onAdd(filter, key, type, listener, capture) {
  return function(d, i, group) {
    var value = this[key];
    if (value) this.removeEventListener(type, value, value._capture);
    value = contextListener(listener, i, group);
    if (filter) value = filterListener(value);
    value._listener = listener;
    this.addEventListener(type, this[key] = value, value._capture = capture);
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
      ? (value ? onAdd(filter, key, name, listener, capture == null ? false : capture) : noop) // Attempt to add untyped listener is ignored.
      : (value ? onRemove(key, name) : onRemoveAll(name)));
}
