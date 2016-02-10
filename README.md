# shift-esotope
*ECMAScript code generator for the [Shift AST](http://shift-ast.org/).*

When looking for a fast JavaScript parser (written in JavaScript), we came across the [Shift Parser](http://shift-ast.org/parser.html) by [Shape Security](http://engineering.shapesecurity.com/), which, according to [Esprima's speed comparison](http://esprima.org/test/compare.html) is the fasters parser when early errors are disabled.

Unfortunately, [the code generator](http://shift-ast.org/codegen.html) (i.e., the module that converts an AST back to JavaScript code) in the Shift suite is rather slow.

```shift-esotope``` is a replacement for the Shift code generator and is an adaption to the Shift AST of Ivan Nikulin's excellent fast [esotope](https://github.com/inikulin/esotope) code generator, which he wrote as a fast replacement for [escodegen](https://github.com/estools/escodegen), in turn.

According to our benchmarks, ```shift-esotope``` is around 9 times faster than the Shift code generator.

```shift-esotope``` currently doesn't support comments and source maps.

## Installation
### node.js
```
npm install shift-esotope
```

### Browser
Add [shift-esotope.js](https://raw.githubusercontent.com/vnmc/shift-esotope/master/src/shift-esotope.js) to your page.

## Usage

```javascript
// only needed for node.js
// in the browser the global object ShiftEsotope will be added when including the script
var ShiftEsotope = require('shift-esotope'); 

// AST which you get, e.g., by parsing JavaScript code with the Shift Parser
var ast = ...;

// creates JavaScript code (a string) from the AST
var result = ShiftEsotope.generate(ast);
```

## Test
Clone the repo, then

```
npm run test
```

Please note that some tests will fail due to a [bug in the Shift parser](https://github.com/shapesecurity/shift-parser-js/issues/255).

[Our fork](https://github.com/matthias-christen/shift-parser-js) contains a hacky fix for this bug.

## Benchmark
```
npm run benchmark
```

Using node v0.12.7:
```
shift-codegen x 0.10 ops/sec ±3.48% (5 runs sampled)
shift-esotope x 0.87 ops/sec ±4.90% (7 runs sampled)
Fastest is shift-esotope
shift-esotope is x9.13 times faster vs shift-codegen.
```

## License

[BSD](https://raw.githubusercontent.com/vnmc/shift-esotope/master/LICENSE)
