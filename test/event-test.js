var tape = require("tape"),
    jsdom = require("./jsdom"),
    d3 = require("../");

tape("d3.event is set exactly during the callback of an event listener", function(test) {
  var event,
      document = jsdom("<h1 id='one'></h1>"),
      one = document.querySelector("#one"),
      selection = d3.selectAll([one]).on("click", function() { event = d3.event; });
  test.equal(d3.event, null);
  selection.dispatch("click");
  test.equal(d3.event, null);
  test.equal(event.type, "click");
  test.equal(event.target, one);
  test.end();
});

tape("d3.event is restored to its previous value during reentrant events", function(test) {
  var event1,
      event2,
      event3,
      document = jsdom("<h1 id='one'></h1>"),
      one = document.querySelector("#one"),
      selection = d3.selectAll([one]).on("foo", function() { event1 = d3.event; selection.dispatch("bar"); event3 = d3.event; }).on("bar", function() { event2 = d3.event; });
  test.equal(d3.event, null);
  selection.dispatch("foo");
  test.equal(d3.event, null);
  test.equal(event1.type, "foo");
  test.equal(event2.type, "bar");
  test.equal(event3, event1);
  test.end();
});

tape("d3.mouse will use the passed in event parameter", function(test) {
    var event = {clientX : 2, clientY: 2},
        svg = jsdom("<svg width='20' height='20'><rect width='10' height='10'/></svg>");
        svg.clientLeft = 0;
        svg.clientTop = 0;
    svg.getBoundingClientRect = function() { return { left:0, top:0 }; }

    var point = d3.mouse(svg, event);

    test.deepEqual(point, [2, 2]);
    test.end();
});