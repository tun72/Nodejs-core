const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
  constructor({ fileSize }) {
    super();
    this.totalFileWrite = 0;
    this.fileSize = fileSize;
  }

  _transform(chunk, encoding, callback) {
    let counter = 0;
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] != 255) {
        chunk[i] = chunk[i] - 1;
      }
      if (counter === 8000) {
        counter = 0;
        console.log(
          "Decryption ---- " +
            Math.floor((this.totalFileWrite / this.fileSize) * 100) +
            "%"
        );
      }

      ++counter;
      ++this.totalFileWrite;
    }
    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFileHandel = await fs.open("write.txt", "r");
  const writeFileHandel = await fs.open("decrypted.txt", "w");

  const fileSize = (await readFileHandel.stat()).size;

  const readStream = readFileHandel.createReadStream();
  const writeStream = writeFileHandel.createWriteStream();

  const decrypt = new Decrypt({ fileSize });

  readStream.pipe(decrypt).pipe(writeStream);
})();
