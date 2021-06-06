import {JSDOM} from "jsdom";

export default function jsdom(html, run) {
  return async () => {
    try {
      const dom = new JSDOM(html);
      global.window = dom.window;
      global.document = dom.window.document;
      await run();
    } finally {
      delete global.window;
      delete global.document;
    }
  };
}
