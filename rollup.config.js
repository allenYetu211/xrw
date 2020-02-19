export default {
  input: "./src/index.js",
  output: {
    name: "index",
    banner: "#!/usr/bin/env node",
    file: "index.bundle.js",
    format: "cjs"
  }
};
