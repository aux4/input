const JSONStream = require("JSONStream");

class Input {
  static async readAsString() {
    return await read(process.openStdin());
  }

  static async readAsJson() {
    return await read(process.openStdin()).then(JSON.parse);
  }

  static stream(path = "$") {
    const jsonPath = path === "$" ? undefined : path.replace("$.", "");
    return JSONStream.parse(jsonPath);
  }
}

async function read(buffer) {
  return new Promise((resolve, reject) => {
    let inputString = "";

    buffer.on("data", data => {
      inputString += data;
    });

    buffer.on("error", error => {
      reject(error);
    });

    buffer.on("end", () => {
      resolve(inputString);
    });
  });
}

module.exports = Input;
