import defaultView from "./defaultView";

export default function(name, value, priority) {
  var n = arguments.length;

  if (n < 2) return defaultView(n = this.node()).getComputedStyle(n, null).getPropertyValue(name);

  if (n < 3) priority = "";

  function remove() {
    this.style.removeProperty(name);
  }

  function setConstant() {
    this.style.setProperty(name, value, priority);
  }

  function setFunction() {
    var x = value.apply(this, arguments);
    if (x == null) this.style.removeProperty(name);
    else this.style.setProperty(name, x, priority);
  }

  return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
};
