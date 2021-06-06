import assert from "assert";
import {select, selection} from "../src/index.js";
import {assertSelection} from "./asserts.js";
import jsdom from "./jsdom.js";

it("select(…) returns an instanceof selection", jsdom("<h1>hello</h1>", () => {
  assert(select(document) instanceof selection);
}));

it("select(string) selects the first element that matches the selector string", jsdom("<h1 id='one'>foo</h1><h1 id='two'>bar</h1>", () => {
  assertSelection(select("h1"), [[document.querySelector("h1")]], [document.documentElement]);
}));

it("select(element) selects the given element", jsdom("<h1>hello</h1>", () => {
  assertSelection(select(document.body), [[document.body]], [null]);
  assertSelection(select(document.documentElement), [[document.documentElement]], [null]);
}));

it("select(window) selects the given window", jsdom("<h1>hello</h1>", () => {
  assertSelection(select(document.defaultView), [[document.defaultView]], [null]);
}));

it("select(document) selects the given document", jsdom("<h1>hello</h1>", () => {
  assertSelection(select(document), [[document]], [null]);
}));

it("select(null) selects null", jsdom("<h1>hello</h1><null></null><undefined></undefined>", () => {
  assertSelection(select(null), [[null]], [null]);
  assertSelection(select(undefined), [[undefined]], [null]);
  assertSelection(select(), [[undefined]], [null]);
}));

it("select(object) selects an arbitrary object", () => {
  const object = {};
  assertSelection(select(object), [[object]], [null]);
});
