export default function() {
  var args = new Array(arguments.length);
  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }
  var callback = args[0];
  args[0] = this;
  callback.apply(null, args);
  return this;
}
