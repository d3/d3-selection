var tape = require("tape"),
    jsdom = require("jsdom"),
    d3 = require("../");

tape("d3.selectorAll(selector).call(element) returns all elements that match the selector", function(test) {
  var document = jsdom.jsdom("<body class='foo'><div class='foo'>"),
      body = document.body,
      div = document.querySelector("div");
  test.deepEqual(d3.selectorAll("body").call(document.documentElement), [body]);
  test.deepEqual(d3.selectorAll(".foo").call(document.documentElement), [body, div]);
  test.deepEqual(d3.selectorAll("div.foo").call(document.documentElement), [div]);
  test.deepEqual(d3.selectorAll("div").call(document.documentElement), [div]);
  test.deepEqual(d3.selectorAll("div,body").call(document.documentElement), [body,div]);
  test.deepEqual(d3.selectorAll("h1").call(document.documentElement), []);
  test.deepEqual(d3.selectorAll("body.bar").call(document.documentElement), []);
  test.end();
});
