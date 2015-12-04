import requote from "./requote";

var filterEvents = {};

export var event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

export default function(type, listener, capture) {
  var n = arguments.length,
      key = "__on" + type,
      filter,
      selection = this;

  if (n < 2) return (n = this.node()[key]) && n._listener;

  if (n < 3) capture = false;
  if ((n = type.indexOf(".")) > 0) type = type.slice(0, n);
  if (filter = filterEvents.hasOwnProperty(type)) type = filterEvents[type];

  function add() {
    remove.call(this);
    var l = listenerOf(listener, selection.context(arguments));
    if (filter) l = filterListenerOf(l);
    l._listener = listener;
    this.addEventListener(type, this[key] = l, l._capture = capture);
  }

  function remove() {
    var l = this[key];
    if (l) {
      this.removeEventListener(type, l, l._capture);
      delete this[key];
    }
  }

  function removeAll() {
    var re = new RegExp("^__on([^.]+)" + requote(type) + "$"), match;
    for (var name in this) {
      if (match = name.match(re)) {
        var l = this[name];
        this.removeEventListener(match[1], l, l._capture);
        delete this[name];
      }
    }
  }

  return this.each(listener
      ? (n ? add : noop) // Attempt to add untyped listener is ignored.
      : (n ? remove : removeAll));
};

function listenerOf(listener, context) {
  return function(event1) {
    var event0 = event;
    event = event1; // Events can be reentrant (e.g., focus).
    try {
      context(listener);
    } finally {
      event = event0;
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

function noop() {}
