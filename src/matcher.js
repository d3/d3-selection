var matcher = function(selector) {
  if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!element.matches) {
      var vendorMatches = element.webkitMatchesSelector
        || element.msMatchesSelector
        || element.mozMatchesSelector
        || element.oMatchesSelector;
      return function() {
        return vendorMatches.call(this, selector);
      };
    }
  }

  return function() {
    return this.matches(selector);
  };
};

export default matcher;
