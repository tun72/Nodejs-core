const { Buffer } = require("buffer");

const memoryContainer = Buffer.alloc(4); // 4 bytes (32bits)
//<Buffer 00 00 00 00>

memoryContainer[0] = 0xf4;
memoryContainer[1] = 0x34;
memoryContainer[2] = 0x00;
memoryContainer[3] = 0xff;

// console.log(memoryContainer.toString("utf16le"));s
const buffer = Buffer.from([0x48, 0x69, 0x21]);


const buff = Buffer.from("hello", "utf-8");

console.log(buff);

const buff2 = Buffer.from("E0A49B", "hex");

console.log(buff2.toString("utf-8"));
