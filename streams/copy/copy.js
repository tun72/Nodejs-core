const fs = require("node:fs/promises");
const { pipeline } = require("stream")(
  // speed Big n n^2
  // space

  // memory usage is 1GB
  // (async () => {
  //   const destFile = await fs.open("text-copy.txt", "w");
  //   const result = await fs.readFile("test.txt");

  //   await destFile.write(result)
  // })();

  // 30 MB memory usage

  // (async () => {
  //   const destFile = await fs.open("text-copy.txt", "w");
  //   const srcFile = await fs.open("test.txt", "r");

  //   let bytesRead = -1;

  //   while (bytesRead !== 0) {
  //     const readResult = await srcFile.read();
  //     bytesRead = readResult.bytesRead;

  //     if (bytesRead !== 16384) {
  //       const indexOfNotFilled = readResult.buffer.indexOf(0);
  //       const newBuffer = Buffer.alloc(indexOfNotFilled);
  //     //   console.log(bytesRead);

  //     //   console.log(indexOfNotFilled);

  //     //   console.log(newBuffer);

  //       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
  //       destFile.write(newBuffer);
  //     } else {
  //       destFile.write(readResult.buffer);
  //     }
  //   }

  // //   await destFile.write(result);
  // })();

  // piping
  // use pipline to handel error not use pipe
  async () => {
    const destFile = await fs.open("text-copy.txt", "w");
    const srcFile = await fs.open("test.txt", "r");

    const readStream = srcFile.createReadStream();
    const writeStream = srcFile.createWriteStream();

    // readStream.pipe(writeStream);
    // readStream.unpipe(writeStream)

    pipeline(readStream, writeStream, (err) => {
      console.log(err);
    });

    //   await destFile.write(result);
  }
)();
