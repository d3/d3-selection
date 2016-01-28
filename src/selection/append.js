import creator from "../creator";
import selector from "../selector";

function append(create) {
  return function() {
    return this.appendChild(create.apply(this, arguments));
  };
}

function insert(create, select) {
  return function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  };
}

function constantNull() {
  return null;
}

export default function(name, before) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(arguments.length < 2
      ? append(create)
      : insert(create, before == null
          ? constantNull : typeof before === "function"
          ? before
          : selector(before)));
}
