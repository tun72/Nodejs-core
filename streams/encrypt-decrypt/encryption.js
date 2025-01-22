const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] != 255) {
        chunk[i] += 1;
      }
    }
    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFileHandel = await fs.open("read.txt", "r");
  const writeFileHandel = await fs.open("write.txt", "w");

  const readStream = readFileHandel.createReadStream();
  const writeStream = writeFileHandel.createWriteStream();

  const encrypt = new Encrypt();

  readStream.pipe(encrypt).pipe(writeStream);
})();
