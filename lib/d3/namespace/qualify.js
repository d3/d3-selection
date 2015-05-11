var prefixes = require("./prefix");

module.exports = function(name) {
  var i = name.indexOf(":"), prefix = name;

  if (i >= 0) {
    prefix = name.slice(0, i);
    name = name.slice(i + 1);
  }

  return prefixes.hasOwnProperty(prefix)
      ? {space: prefixes[prefix], local: name}
      : name;
};
