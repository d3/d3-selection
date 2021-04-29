import * as jsdom from "jsdom";

export default function(html) {
  const dom = new jsdom.JSDOM(html);
  return global.document = dom.window.document
}
