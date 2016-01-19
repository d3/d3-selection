// var tape = require("tape"),
//     jsdom = require("jsdom"),
//     d3 = require("../../");

// tape("selection.enter initially returns an empty selection", function(test) {
//   var document = jsdom.jsdom("<h1>hello</h1>"),
//       s = d3.select(document.body),
//       e = s.enter();
//   test.ok(e instanceof d3.selection);
//   test.ok(Array.isArray(e._));
//   test.equal(e._.length, 1);
//   test.ok(Array.isArray(e._[0]));
//   test.equal(e._[0].length, 1);
//   test.ok(!(0 in e._[0]));
//   test.equal(e._[0]._parent, undefined);
//   test.equal(e._enter, undefined);
//   test.equal(e._exit, undefined);
//   test.end();
// });

// tape("enter.select copies enter nodes into the update selection", function(test) {
//   var document = jsdom.jsdom(),
//       nodes = [],
//       update = d3.select(document.body).selectAll("p").data([0, 1, 2]),
//       enter = update.enter();
//   test.equal(enter._.length, 1);
//   test.equal(enter._[0].length, 3);
//   test.equal(enter._[0][0].__data__, 0);
//   test.equal(enter._[0][1].__data__, 1);
//   test.equal(enter._[0][2].__data__, 2);
//   test.equal(update._.length, 1);
//   test.equal(update._[0].length, 3);
//   test.ok(!(0 in update._[0]));
//   test.ok(!(1 in update._[0]));
//   test.ok(!(2 in update._[0]));
//   enter.select(function() { var p = this.appendChild(document.createElement("P")); nodes.push(p); return p; });
//   test.equal(enter._.length, 1);
//   test.equal(enter._[0].length, 3);
//   test.equal(update._.length, 1);
//   test.equal(update._[0].length, 3);
//   test.equal(update._[0][0], nodes[0]);
//   test.equal(update._[0][1], nodes[1]);
//   test.equal(update._[0][2], nodes[2]);
//   test.equal(update._[0][0].__data__, 0);
//   test.equal(update._[0][1].__data__, 1);
//   test.equal(update._[0][2].__data__, 2);
//   test.end();
// });

// tape("selection.append inserts enter nodes before following update nodes", function(test) {
//   var document = jsdom.jsdom();
//   d3.select(document.body).selectAll("p").data([1, 3]).enter().append("p");
//   var p = document.querySelectorAll("p");
//   test.equal(p.length, 2);
//   test.equal(p[0].__data__, 1);
//   test.equal(p[1].__data__, 3);
//   d3.select(document.body).selectAll("p").data([0, 1, 2, 3, 4], function(d) { return d; }).enter().append("p");
//   var p = document.querySelectorAll("p");
//   test.equal(p.length, 5);
//   test.equal(p[0].__data__, 0);
//   test.equal(p[1].__data__, 1);
//   test.equal(p[2].__data__, 2);
//   test.equal(p[3].__data__, 3);
//   test.equal(p[4].__data__, 4);
//   test.end();
// });
