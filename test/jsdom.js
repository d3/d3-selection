import {test} from "vitest";
import {JSDOM} from "jsdom";

export default function jsdomit(message, html, run) {
  if (arguments.length < 3) run = html, html = "";
  return test(message, async () => {
    try {
      const dom = new JSDOM(html);
      global.window = dom.window;
      global.document = dom.window.document;
      await run();
    } finally {
      delete global.window;
      delete global.document;
    }
  });
}
