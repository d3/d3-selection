import Selection from "./selection";

export default function(selector) {
  var root;
  if (typeof selector === "string") {
    root = [document.querySelector(selector)];
    root._parent = document.documentElement;
  } else {
    root = [selector];
    root._parent = null;
  }
  return new Selection(root, 1);
};
