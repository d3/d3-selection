var d3 = global.d3 || (global.d3 = {}),
    selection = d3.selection = require("./lib/d3/selection");
d3.select = selection.select;
d3.selectAll = selection.selectAll;
d3.namespace = {prefix: require("./lib/d3/namespace/prefix")};
