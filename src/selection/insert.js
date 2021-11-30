import creator from "../creator.js";
import selector from "../selector.js";

function constantNull() {
  return null;
}

export default function insert(name, before) {
  const create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

export function insertBefore(name) {
  const create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.parentNode.insertBefore(create.apply(this, arguments), this);
  });
}

export function insertAfter(name) {
  const create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.parentNode.insertBefore(create.apply(this, arguments), this.nextSibling);
  });
}
