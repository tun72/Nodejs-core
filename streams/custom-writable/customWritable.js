const { Writable } = require("node:stream");
const fs = require("node:fs");
const fsPromise = require("fs/promises");
const { Buffer } = require("buffer");
class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.writeCount = 0;
  }

  // this will run after constructor,

  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;

    if (this.chunkSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunkSize = 0;
        ++this.writeCount;
        callback();
      });
    } else {
      //   ++this.writeCount;
      callback();
    }
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];

      callback();
      //   console.log(callback);
    });
  }

  _destroy(error, callback) {
    console.log("Number of writes: ", this.writeCount);

    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err | error);
      });
    } else {
      callback(error);
    }
  }
}

(async () => {
  console.time("writeMany");
  const stream = new FileWriteStream({
    fileName: "./text.txt",
  });

  let i = 0;
  const numberOfWrites = 100000;

  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");
      const isStop = stream.write(buff);

      // this is last write
      if (i === 99999) {
        return stream.end(buff);
      }
      i++;
      if (!isStop) break;
    }
  };

  writeMany();
  let d = 0;
  stream.on("drain", () => {
    // console.log("drained!!");
    ++d;
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    console.log("Drained: ", d);
  });
})();

// stream.write(Buffer.from("this is string"));

// stream.end(Buffer.from("Our last write"));

// stream.on("finish", () => {
//   console.log("stream was finished.");
// });

// stream.on("drain", () => {});
