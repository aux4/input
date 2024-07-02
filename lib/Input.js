const JSONStream = require("JSONStream");
const jsonpath = require("jsonpath");

class Input {
  static async readAsString() {
    return await read(process.openStdin());
  }

  static async readAsJson(path = "$") {
    return await read(process.openStdin())
      .then(text => {
        if (text === "") return undefined;

        return JSON.parse(text);
      }).then(json => {
        if (!json) return undefined;

        return jsonpath.value(json, path);
      });
  }

  static stream(path = "$") {
    const jsonPath = path === "$" ? undefined : path.replace("$.", "");
    return process.openStdin().pipe(JSONStream.parse(jsonPath));
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
