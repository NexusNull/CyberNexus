const crypto = require('crypto');
const fs = require("fs");

const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
});

let privPem = privateKey.export({type: "pkcs1", format: "pem"});
let pubPem = publicKey.export({type: "pkcs1", format: "pem"});

fs.writeFileSync("./keys/privateKey.pem", privPem);
fs.writeFileSync("./keys/publicKey.pem", pubPem);