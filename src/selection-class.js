import requote from "./requote";

export default function(rawName, value) {
  var name = (rawName + "").trim().split(/^|\s+/);
  var n = name.length;

  if (arguments.length < 2) {
    var node = this.node(), i = -1;
    var classes = node.classList;
    if (classes) { // SVG elements may not support DOMTokenList!
      while (++i < n) if (!classes.contains(name[i])) return false;
    } else {
      classes = node.getAttribute("class");
      while (++i < n) if (!classedRe(name[i]).test(classes)) return false;
    }
    return true;
  }

  name = name.map(classerOf);

  function setConstant() {
    var i = -1;
    while (++i < n) name[i](this, value);
  }

  function setFunction() {
    var i = -1, x = value.apply(this, arguments);
    while (++i < n) name[i](this, x);
  }

  return this.each(typeof value === "function" ? setFunction : setConstant);
};



function classerOf(name) {
  var re;
  return function(node, value) {
    if (c = node.classList) return value ? c.add(name) : c.remove(name);
    if (!re) re = classedRe(name);
    var c = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(c)) node.setAttribute("class", collapse(c + " " + name));
    } else {
      node.setAttribute("class", collapse(c.replace(re, " ")));
    }
  };
}

function collapse(string) {
  return string.trim().replace(/\s+/g, " ");
}

function classedRe(name) {
  return new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
}
