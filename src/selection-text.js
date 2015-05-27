export default function(value) {
  if (!arguments.length) return this.node().textContent;

  function setConstant() {
    this.textContent = value;
  }

  function setFunction() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  }

  if (value == null) value = "";

  return this.each(typeof value === "function" ? setFunction : setConstant);
};
