// 0100 1000 0110 1001 0010 0001

const {Buffer} = require("buffer");

const memoryContainer = Buffer.alloc(3);

memoryContainer[0] = 0x48
memoryContainer[1] = 0x69
memoryContainer[2] = 0x21


console.log(memoryContainer.toString("utf-8"));


