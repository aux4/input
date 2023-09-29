# input
Read STDIN input

## Install

```bash
npm install @aux4/input
```

## Usage

### Read `stdin` as String

```js
const Input = require('@aux4/input');

const string = await Input.readAsString();
```

### Read `stdin` as JSON

```js
const Input = require('@aux4/input');

const json = await Input.readAsJson();

...

const nested = await Input.readAsJson("$.nested");
```

### Stream `stdin` as JSON

```js
const Input = require('@aux4/input');

const stream = Input.stream();
stream.on('data', (data) => {
  // data is a JSON object
});

...

const stream = Input.stream("$.nested");
stream.on('data', (data) => {
  // data is a JSON object
});
```