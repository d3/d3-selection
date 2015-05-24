var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("selection.enter initially returns an empty selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.body),
      e = s.enter();
  test.ok(e instanceof selection, "is a selection");
  test.equal(e._depth, 1, "_depth is one");
  test.ok(Array.isArray(e._root), "_root is an array");
  test.equal(e._root.length, 1, "_root has the same length as in update");
  test.ok(!(0 in e._root), "_root is empty");
  test.equal(e._root._parent, null, "_root._parent is null");
  test.equal(e._enter, null, "_enter is null");
  test.equal(e._exit, null, "_exit is null");
  test.equal(e._root._update, s._root, "_root._update is the update group");
  test.equal(s._root._enter, e._root, "_root is update._root._enter");
  test.end();
});

tape("selection.select moves enter nodes to the update selection", function(test) {
  var document = jsdom.jsdom(),
      nodes = [],
      update = selection.select(document.body).selectAll("p").data([0, 1, 2]),
      enter = update.enter();
  test.equal(enter._root.length, 1, "enter selection initially contains enter nodes");
  test.equal(enter._root[0].length, 3, "enter selection initially contains enter nodes");
  test.equal(enter._root[0][0].__data__, 0, "enter selection initially contains enter nodes");
  test.equal(enter._root[0][1].__data__, 1, "enter selection initially contains enter nodes");
  test.equal(enter._root[0][2].__data__, 2, "enter selection initially contains enter nodes");
  test.equal(update._root.length, 1, "update selection is initially empty");
  test.equal(update._root[0].length, 3, "update selection is initially empty");
  test.equal(update._root[0][0], undefined, "update selection is initially empty");
  test.equal(update._root[0][1], undefined, "update selection is initially empty");
  test.equal(update._root[0][2], undefined, "update selection is initially empty");
  enter.select(function() { var p = this.appendChild(document.createElement("P")); nodes.push(p); return p; });
  test.equal(enter._root.length, 1, "enter selection is subsequentyl empty");
  test.equal(enter._root[0].length, 3, "enter selection is subsequentyl empty");
  test.equal(enter._root[0][0], undefined, "enter selection is subsequentyl empty");
  test.equal(enter._root[0][1], undefined, "enter selection is subsequentyl empty");
  test.equal(enter._root[0][2], undefined, "enter selection is subsequentyl empty");
  test.equal(update._root.length, 1, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0].length, 3, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][0], nodes[0], "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][1], nodes[1], "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][2], nodes[2], "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][0].__data__, 0, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][1].__data__, 1, "update selection subsequently contains materialized nodes");
  test.equal(update._root[0][2].__data__, 2, "update selection subsequently contains materialized nodes");
  test.end();
});

tape("selection.append inserts enter nodes before following update nodes", function(test) {
  var document = jsdom.jsdom();
  selection.select(document.body).selectAll("p").data([1, 3]).enter().append("p");
  var p = document.querySelectorAll("p");
  test.equal(p.length, 2, "inserts the expected number of nodes");
  test.equal(p[0].__data__, 1, "inserted nodes have the expected order");
  test.equal(p[1].__data__, 3, "inserted nodes have the expected order");
  selection.select(document.body).selectAll("p").data([0, 1, 2, 3, 4], function(d) { return d; }).enter().append("p");
  var p = document.querySelectorAll("p");
  test.equal(p.length, 5, "inserts the expected number of nodes");
  test.equal(p[0].__data__, 0, "inserted nodes have the expected order");
  test.equal(p[1].__data__, 1, "inserted nodes have the expected order");
  test.equal(p[2].__data__, 2, "inserted nodes have the expected order");
  test.equal(p[3].__data__, 3, "inserted nodes have the expected order");
  test.equal(p[4].__data__, 4, "inserted nodes have the expected order");
  test.end();
});
