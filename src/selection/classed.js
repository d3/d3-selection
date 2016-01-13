import requote from "../requote";

function collapse(string) {
  return string.trim().replace(/\s+/g, " ");
}

function classer(name) {
  var re;
  return function(node, value) {
    if (classes = node.classList) return value ? classes.add(name) : classes.remove(name);
    if (!re) re = classedRe(name); // Create only if classList is missing.
    var classes = node.getAttribute("class") || "";
    if (value) {
      re.lastIndex = 0;
      if (!re.test(classes)) node.setAttribute("class", collapse(classes + " " + name));
    } else {
      node.setAttribute("class", collapse(classes.replace(re, " ")));
    }
  };
}

function classedRe(name) {
  return new RegExp("(?:^|\\s+)" + requote(name) + "(?:\\s+|$)", "g");
}

function classedConstant(classers, value) {
  return function() {
    var i = -1, n = classers.length;
    while (++i < n) classers[i](this, value);
  };
}

function classedFunction(classers, value) {
  return function() {
    var i = -1, n = classers.length, v = value.apply(this, arguments);
    while (++i < n) classers[i](this, v);
  };
}

export default function(name, value) {
  var names = (name + "").trim().split(/^|\s+/);

  if (arguments.length < 2) {
    var node = this.node(),
        i = -1,
        n = names.length,
        classes = node.classList;
    if (classes) { // SVG elements may not support DOMTokenList!
      while (++i < n) if (!classes.contains(names[i])) return false;
    } else {
      classes = node.getAttribute("class") || "";
      while (++i < n) if (!classedRe(names[i]).test(classes)) return false;
    }
    return true;
  }

  return this.each((typeof value === "function"
      ? setFunction
      : setConstant)(names.map(classer), value));
};
