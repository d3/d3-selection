import creator from "../creator";
import selector from "../selector";

function constantNull() {
  return null;
}

export default function(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    return this.insertBefore(create.apply(this, args), select.apply(this, args) || null);
  });
}
