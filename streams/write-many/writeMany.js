const { Buffer } = require("buffer");

const fs = require("fs/promises");
const { buffer } = require("stream/consumers");
// const fs = require("fs");

console.time("writeMany");

const b = Buffer.allocUnsafe(0.5e9);
// 8s to run 1 cpu 1 core and 50MB Memory
// (async () => {
//   const testFile = await fs.open("test.txt", "w");
//   for (let i = 0; i < 1e6; i++) {
//     testFile.write(b[i] + " ");
//   }
//   //   testFile.close();
//   console.timeEnd("writeMany");
// })();

// calback

// 3.524s for run
// (async () => {
//   fs.open("test.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1e6; i++) {
//       fs.write(fd, i + " ", () => {});
//     }
//     //   testFile.close();
//     console.timeEnd("writeMany");
//   });
// })();

//  with stream 631.24ms to run
// DON"T DO IT THIS WAY
// (async () => {
//   const testFile = await fs.open("test.txt", "w");

//   const stream = testFile.createWriteStream();
//   for (let i = 0; i < 1e6; i++) {
//     stream.write(Buffer.from(`${i}`, "utf-8"));
//   }
//   //   testFile.close();
//   console.timeEnd("writeMany");
// })();

// fix with stream for performance
const numberOfWrites = 1000000;
(async () => {
  const testFile = await fs.open("test.txt", "w");

  

  const stream = testFile.createWriteStream();

  // console.log(stream.writableHighWaterMark);

  // const buff = Buffer.alloc(10000000, 10)

  // stream.write(buff);
  // stream.write(buff)
  // // console.log(stream.writableLength);
  // // console.log(buff);

  // stream.on("drain", () => {
  //   console.log(stream.writableLength);

  //   console.log("We are now safe to write more");

  // })

  // setInterval(() => {}, 1000)

  let i = 0;
  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      const isStop = stream.write(buff);

      // this is last write
      if (i === 999999) {
        return stream.end(buff);
      }
      i++;
      if (!isStop) break;
    }
  };

  writeMany();
  stream.on("drain", () => {
    // console.log("drained!!");
    
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    testFile.close();
  });

  // testFile.close()
})();
