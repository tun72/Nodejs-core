const EventEmitter = require("./event");

class Emitter extends EventEmitter {}

const myE = new Emitter();


myE.on("foo", () => {
    console.log("Event foo");
    return "run"
})


// myE.emit("foo");
console.log(myE.rawListeners("foo")[0]());

// myE.emit("foo");