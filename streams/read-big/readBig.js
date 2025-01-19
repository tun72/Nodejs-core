const fs = require("fs/promises");
(async () => {
  console.time("reading");
  const fileHandelRead = await fs.open("test.txt", "r");
  const fileHandelWrite = await fs.open("dest.txt", "w");

  const streamRead = fileHandelRead.createReadStream({
    highWaterMark: 64 * 1024,
  }); // 64KB

  let split = "";
  const streamWrite = fileHandelWrite.createWriteStream();
  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split("  ");

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) numbers[0] = split.trim() + numbers[0].trim();
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }
    numbers.forEach((number) => {
      let n = Number(number);

      if (n % 2 === 0) {
        if (!streamWrite.write(" " + n + " ")) streamRead.pause();
      }
    });

    // streamWrite.write(chunk);

    // console.log(chunk.length);
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  streamRead.on("end", () => {
    console.timeEnd("reading");
  });
})();
