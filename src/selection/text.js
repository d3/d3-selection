function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    var v = value.apply(this, args);
    this.textContent = v == null ? "" : v;
  };
}

export default function(value) {
  return arguments.length ?
    this.each(value == null ?
      textRemove : (typeof value === "function" ?
        textFunction :
        textConstant)(value)) :
    this.node().textContent;
}