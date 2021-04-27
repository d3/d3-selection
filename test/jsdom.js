import * as jsdom from "jsdom";

export default function(html) {
  return (new jsdom.JSDOM(html)).window.document;
}

