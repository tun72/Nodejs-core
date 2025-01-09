const fs = require("fs/promises");

//open the file (32) file descriptor
// read or write the file

(async () => {
  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";
  let prevContent;

  const commandFileHandler = await fs.open("./command.txt", "r");

  const createFile = async (path) => {
    let existingFileHandel;
    try {
      existingFileHandel = await fs.open(path, "r");
      existingFileHandel.close();
      return;
    } catch (err) {
      const newFIle = await fs.open(path, "w");
      newFIle.close();
    }
  };

  const deleteFile = async (path) => {
    // if (!existingFileHandel) return;
    try {
      await fs.unlink(path);

      return console.log("File is deleted");
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("File not exist");
      } else {
        console.log(err);
      }
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);

      return console.log(`${oldPath} is renamed to ${newPath}`);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("File not exist");
      } else {
        console.log(err);
      }
    }
  };

  const addToFile = async (path, content) => {
    if (prevContent == content) return;
    try {
      const file = await fs.open(path, "a");
      file.write(content);
      prevContent = content;
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log("File not exist");
      } else {
        console.log(err);
      }
    }
  };

  commandFileHandler.on("change", async () => {
    // get size of file
    const size = (await commandFileHandler.stat()).size;

    // allocate our buffer
    const buffer = Buffer.alloc(size);

    // the location at which we want to start filling our buffer
    const offset = 0;

    // how many bytes we want to read
    const length = size;

    // the position that we want to start reading the file from
    const position = 0;

    await commandFileHandler.read(buffer, offset, length, position);

    //decoder 01 => maningful
    //encoder meaningful => 01

    const command = buffer.toString("utf-8");

    // create a file
    // create a file <path>
    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);

      createFile(filePath);
    } else if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    } else if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      renameFile(oldFilePath, newFilePath);
    } else if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });

  //watcher...
  const watcher = fs.watch("./command.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
