function textConstant(value) {
  if (value == null) value = "";
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

export default function(value) {
  return arguments.length
      ? this.each((typeof value === "function"
          ? textFunction
          : textContent)(value))
      : this.node().textContent;
};
