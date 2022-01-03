import creator from "../creator.js";

export default function(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    const wrap = create.apply(this, arguments);
    if (this.parentNode) this.parentNode.insertBefore(wrap, this);
    wrap.appendChild(this);
    return wrap;
  });
}
