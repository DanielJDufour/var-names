# var-names
> Generate Variable Names

# install
```bash
npm install var-names
```

# usage
```javascript
const { genVarNames } = require("var-names");

// create the generator
const gen = genVarNames();

// iterate over the variables
for (const varname of gen) {
  // varname is A, B, C, ... AA, AB, ... BB, BC, ... AAB
}
```

# advanced usage
```javascript
// create the generator
const gen = genVarNames({
  chars: ['A', 'B', 'C', ... 'a', 'b'], // character set to choose from, default to English alphabet in upper then lower case
  debug = false, // set to true for increased logging
  max_count = 1000000, // maximum number of iterations, defaults to 1 million
});
```
