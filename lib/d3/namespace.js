var prefixes = exports.prefix = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

exports.qualify = function(name) {
  var i = name.indexOf(":"),
      prefix = name;

  if (i >= 0) {
    prefix = name.slice(0, i);
    name = name.slice(i + 1);
  }

  return prefixes.hasOwnProperty(prefix)
      ? {space: prefixes[prefix], local: name}
      : name;
};
