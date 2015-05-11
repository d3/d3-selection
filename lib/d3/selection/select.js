var Selection = require("./");

module.exports = function(selector) {
  var group;
  if (typeof selector === "string") {
    var document = global.document;
    group = [document.querySelector(selector)];
    group.parentNode = document.documentElement;
  } else { // selector is node
    group = [selector];
    group.parentNode = documentElementOf(selector);
  }
  return new Selection([group]);
};

function documentElementOf(node) {
  return node
      && (node.ownerDocument // node is a Element
      || node.document // node is a Window
      || node).documentElement; // node is a Document
}
