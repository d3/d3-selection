export default function(name, value) {
  if (arguments.length < 2) return this.node()[name];

  function remove() {
    delete this[name];
  }

  function setConstant() {
    this[name] = value;
  }

  function setFunction() {
    var x = value.apply(this, arguments);
    if (x == null) delete this[name];
    else this[name] = x;
  }

  return this.each(value == null ? remove : typeof value === "function" ? setFunction : setConstant);
};
