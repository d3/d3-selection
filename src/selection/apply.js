export default function() {
  var callback = arguments[0];
  arguments[0] = this;
  return callback.apply(null, arguments);
}
