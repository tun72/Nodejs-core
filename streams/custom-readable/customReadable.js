const { Readable } = require("node:stream");

const fs = require("node:fs");

class fileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fs = null;
  }

  _construct(callback) {
    fs.open(this.fileName, "r", (err, fd) => {
      this.fd = fd;
      if (err) {
        return callback(err);
      }
      callback();
    });
  }

  _read(size) {
    const buff = Buffer.alloc(size);
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      // null is to indicate the end of the stream

      console.log(bytesRead);

      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
    });
  }
  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err || error));
    } else {
      callback(error);
    }
  }
}

const stream = new fileReadStream({ fileName: "test.txt" });

stream.on("data", (chunk) => {
  console.log(chunk);
});

stream.on("end", () => {
    console.log("stream is done reading");
    
})
