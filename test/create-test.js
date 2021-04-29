import assert from "assert";
import * as d3 from "../src/index.js";
import jsdom from "./jsdom.js";

it("d3.create(name) returns a new HTML element with the given name", () => {
  const document = jsdom("");
  try {
    const h1 = d3.create("h1");
    assert.strictEqual(h1._groups[0][0].namespaceURI, "http://www.w3.org/1999/xhtml");
    assert.strictEqual(h1._groups[0][0].tagName, "H1");
    assert.deepEqual(h1._parents, [null]);
} finally {
    delete global.document;
  }
});

it("d3.create(name) returns a new SVG element with the given name", () => {
  const document = jsdom("");
  try {
    const svg = d3.create("svg");
    assert.strictEqual(svg._groups[0][0].namespaceURI, "http://www.w3.org/2000/svg");
    assert.strictEqual(svg._groups[0][0].tagName, "svg");
    assert.deepEqual(svg._parents, [null]);
} finally {
    delete global.document;
  }
});
