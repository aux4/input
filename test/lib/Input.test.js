const Input = require("../../lib/Input");
const { Readable } = require("stream");

describe("Input", () => {
  let content;

  describe("readAsString", () => {
    beforeEach(async () => {
      jest.spyOn(process, "openStdin").mockImplementation(() => {
        return Readable.from("Hello World");
      });

      content = await Input.readAsString();
    });

    it("should return hello world", () => {
      expect(content).toEqual("Hello World");
    });
  });

  describe("readAsJson", () => {
    beforeEach(async () => {
      jest.spyOn(process, "openStdin").mockImplementation(() => {
        return Readable.from(JSON.stringify({ message: "Hello World" }));
      });

      content = await Input.readAsJson();
    });

    it("should return hello world", () => {
      expect(content).toEqual({ message: "Hello World" });
    });
  });

  describe("stream", () => {
    describe("from array", () => {
      beforeEach(async () => {
        const inputStream = Readable.from(JSON.stringify([{ message: "Hello One" }, { message: "Hello Two" }]));

        const result = await new Promise((resolve, reject) => {
          const list = [];

          const stream = inputStream.pipe(Input.stream());
          stream.on("data", data => list.push(data));
          stream.on("error", error => reject(error));
          stream.on("end", () => resolve(list));
        });

        content = result[0];
      });

      it("should return hello world", () => {
        expect(content).toEqual([{ message: "Hello One" }, { message: "Hello Two" }]);
      });
    });
  });

  describe("from nested object", () => {
    beforeEach(async () => {
      const inputStream = Readable.from(
        JSON.stringify({ response: [{ message: "Hello One" }, { message: "Hello Two" }] })
      );

      const result = await new Promise((resolve, reject) => {
        const list = [];

        const stream = inputStream.pipe(Input.stream("$.response"));
        stream.on("data", data => list.push(data));
        stream.on("error", error => reject(error));
        stream.on("end", () => resolve(list));
      });

      content = result[0];
    });

    it("should return hello world", () => {
      expect(content).toEqual([{ message: "Hello One" }, { message: "Hello Two" }]);
    });
  });

  describe("from multiple objects", () => {
    beforeEach(async () => {
      const inputStream = Readable.from([
        JSON.stringify({ message: "Hello One" }),
        JSON.stringify({ message: "Hello Two" })
      ]);

      content = await new Promise((resolve, reject) => {
        const list = [];

        const stream = inputStream.pipe(Input.stream());
        stream.on("data", data => list.push(data));
        stream.on("error", error => reject(error));
        stream.on("end", () => resolve(list));
      });
    });

    it("should return hello world", () => {
      expect(content).toEqual([{ message: "Hello One" }, { message: "Hello Two" }]);
    });
  });
});
