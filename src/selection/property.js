function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    var v = value.apply(this, args);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

export default function(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}
