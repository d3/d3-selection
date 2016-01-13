export default function() {
  var callback = arguments[0];
  callback.apply(arguments[0] = this, arguments);
  return this;
};
