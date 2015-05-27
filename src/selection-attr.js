import namespace from "./namespace";

export default function(name, value) {
  name = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return name.local
        ? node.getAttributeNS(name.space, name.local)
        : node.getAttribute(name);
  }

  function remove() {
    this.removeAttribute(name);
  }

  function removeNS() {
    this.removeAttributeNS(name.space, name.local);
  }

  function setConstant() {
    this.setAttribute(name, value);
  }

  function setConstantNS() {
    this.setAttributeNS(name.space, name.local, value);
  }

  function setFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttribute(name);
    else this.setAttribute(name, x);
  }

  function setFunctionNS() {
    var x = value.apply(this, arguments);
    if (x == null) this.removeAttributeNS(name.space, name.local);
    else this.setAttributeNS(name.space, name.local, x);
  }

  return this.each(value == null
      ? (name.local ? removeNS : remove)
      : (typeof value === "function"
          ? (name.local ? setFunctionNS : setFunction)
          : (name.local ? setConstantNS : setConstant)));
};
