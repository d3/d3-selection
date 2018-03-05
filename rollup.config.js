import uglify from "rollup-plugin-uglify";

const definition = require("./package.json");
const dependencies = Object.keys(definition.dependencies || {});
const globals = dependencies.reduce((p, v) => (p[v] = "d3", p), {});

function onwarn(warning) {
  if (warning.code !== "CIRCULAR_DEPENDENCY") {
    console.error(`(!) ${warning.message}`);
  }
}

const preamble = `// ${
  definition.homepage || definition.name} Version ${
  definition.version}. Copyright ${
  (new Date).getFullYear()} ${
  definition.author.name + (/\.$/.test(definition.author.name) ? "" : ".")}`;

export default [
  {
    input: "index",
    external: dependencies,
    onwarn,
    output: {
      banner: preamble,
      extend: true,
      file: `dist/${definition.name}.js`,
      format: "umd",
      globals,
      name: "d3"
    }
  },
  {
    input: "index",
    external: dependencies,
    plugins: [uglify({output: {preamble}})],
    onwarn,
    output: {
      banner: preamble,
      extend: true,
      file: `dist/${definition.name}.min.js`,
      format: "umd",
      globals,
      name: "d3"
    }
  },
  {
    input: "index",
    external: dependencies,
    onwarn,
    output: {
      banner: preamble,
      file: `dist/${definition.name}.mjs`,
      format: "es"
    }
  },
  {
    input: "index",
    external: dependencies,
    plugins: [uglify({output: {preamble}})],
    onwarn,
    output: {
      banner: preamble,
      file: `dist/${definition.name}.min.mjs`,
      format: "es"
    }
  }
];
