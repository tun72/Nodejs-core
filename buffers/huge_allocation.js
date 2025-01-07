const { Buffer,constants } = require("buffer");
const b = Buffer.alloc(0.5e9); // 1GB

console.log(9e8);

setInterval(() => {
  //   for (let i = 0; i < b.length; i++) {
  //     // b.length is the size of the buffer in bytes
  //     b[i] = 0x22;
  //   }
  b.fill(0x22);
}, 5000);
