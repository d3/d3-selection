import creator from "../creator.js";
import selector from "../selector.js";

function constantNull() {
  return null;
}

function selectThis() {
  return this;
}

function selectNextSibling() {
  return this.nextSibling;
}

export default function(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

export function insertBefore(name) {
  return this.insert(name, selectThis);
}

export function insertAfter(name) {
  return this.insert(name, selectNextSibling);
}
