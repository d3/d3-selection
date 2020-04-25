export default function(selector) {
  selector += "";
  return function() {
    return this.matches(selector);
  };
}
