import { terser } from "rollup-plugin-terser";

export default {
  input: {
    index: "src/index.js", 
    logger: "src/logger.js"
  },
  output: {
    dir: "lib",
    format: "cjs"
  },
  plugins: [terser()],
};
