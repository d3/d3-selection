export default function(selector) {
  return function() {
    return this.querySelector(selector);
  };
}
