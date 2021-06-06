import assert from "assert";
import * as d3 from "../src/index.js";

it("d3.namespaces is the expected map", () => {
  assert.deepStrictEqual(d3.namespaces, {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  });
});
