import creator from "../creator";

export default function(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    return this.appendChild(create.apply(this, args));
  });
}
