const fs = require("fs");

const imagePath = "./typescript-icon.png";
const base64String = fs.readFileSync(imagePath, { encoding: "base64" });

console.log(base64String);
