export default function(selector) {
  return function() {
    return this.querySelectorAll(selector);
  };
}
