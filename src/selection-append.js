import namespace from "./namespace";
import selectorOf from "./selectorOf";

export default function(creator, selector) {
  if (typeof creator !== "function") creator = creatorOf(creator);

  function append() {
    return this.appendChild(creator.apply(this, arguments));
  }

  function insert() {
    return this.insertBefore(creator.apply(this, arguments), selector.apply(this, arguments) || null);
  }

  return this.select(arguments.length < 2
      ? append
      : (typeof selector !== "function" && (selector = selectorOf(selector)), insert));
};

function creatorOf(name) {
  name = namespace(name);

  function creator() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri
        ? document.createElementNS(uri, name)
        : document.createElement(name);
  }

  function creatorNS() {
    return this.ownerDocument.createElementNS(name.space, name.local);
  }

  return name.local ? creatorNS : creator;
}
