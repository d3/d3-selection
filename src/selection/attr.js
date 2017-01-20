import namespace from "../namespace";

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    var v = value.apply(this, args);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    var v = value.apply(this, args);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

export default function(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ?
      node.getAttributeNS(fullname.space, fullname.local) :
      node.getAttribute(fullname);
  }

  return this.each((value == null ?
    (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function" ?
      (fullname.local ? attrFunctionNS : attrFunction) :
      (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}