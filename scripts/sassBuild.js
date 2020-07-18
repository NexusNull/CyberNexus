const sass = require('sass');
const fs = require("fs");

console.log("Running Sass compiler");
const result = sass.renderSync({
    file: "client/sass/main.sass",
    outFile: "public/styles/main.min.css",
    outputStyle: "compressed",
    sourceMap: true,
});

fs.writeFileSync("client/public/styles/main.min.css", result.css);
fs.writeFileSync("client/public/styles/main.min.css.map", result.map);
process.exit(0);