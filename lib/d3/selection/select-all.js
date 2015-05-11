var Selection = require("./");

module.exports = function(selector) {
  var group;
  if (typeof selector === "string") {
    var document = global.document;
    group = document.querySelectorAll(selector);
    group.parentNode = document.documentElement;
  } else { // selector is array of nodes
    group = selector;
    group.parentNode = null;
  }
  return new Selection([group]);
};
