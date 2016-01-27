import namespace from "../namespace";
import selector from "../selector";

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri && uri !== document.documentElement.namespaceURI
        ? document.createElementNS(uri, name)
        : document.createElement(name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

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
