import defaultView from "../window";

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
    event = window.CustomEvent;

  if (event) {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    return dispatchEvent(this, type, params.apply(this, args));
  };
}

export default function(type, params) {
  return this.each((typeof params === "function" ?
    dispatchFunction :
    dispatchConstant)(type, params));
}