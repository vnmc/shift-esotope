# shift-esotope
*ECMAScript code generator for the [Shift AST](http://shift-ast.org/).*

When looking for a fast JavaScript parser (written in JavaScript), we came across the [Shift Parser](http://shift-ast.org/parser.html) by [Shape Security](http://engineering.shapesecurity.com/), which, according to [Esprima's speed comparison](http://esprima.org/test/compare.html) is the fasters parser when early errors are disabled.

Unfortunately, [the code generator](http://shift-ast.org/codegen.html) (i.e., the module that converts an AST back to JavaScript code) in the Shift suite is rather slow.

```shift-esotope``` is a replacement for the Shift code generator and is an adaption to the Shift AST of Ivan Nikulin's excellent fast [esotope](https://github.com/inikulin/esotope) code generator, which he wrote as a fast replacement for [escodegen](https://github.com/estools/escodegen), in turn.

According to our benchmarks, ```shift-esotope``` is around 8 times faster than the Shift code generator.

```shift-esotope``` also supports generation of source maps via Mozilla's [source map package](https://github.com/mozilla/source-map). The "examples" folder contains an example how to generate source maps.

```shift-esotope``` doesn't support generation of comments.

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

// optionally, pass options (for possible options, see below)
var options = { ... };
var result = ShiftEsotope.generate(ast, options);
```

For more usage examples, check out the files in the [examples](https://github.com/vnmc/shift-esotope/tree/master/examples) folder.

### Options

The options hash recognizes the following properties:

* **format**

	A hash with the following properties:
	
	* **indent**: ```{ style: ' ', base: 0 }```
		
		The style property controls one indentation unit; the base property controls the number of indentation units that are applied globally to the start of each line.
		
	* **newline**: The newline character. Defaults to ```'\n'```.
	* **space**: The space character. Defaults to ```' '```.
	* **json**: If set to ```true```, the output will be formatted as JSON (e.g., property names and strings in double quotes). Defaults to ```false```.
	* **renumber**: If set to true, numbers will be formatted consistently. Defaults to ```false```.
	* **quotes**: The quote character to use for strings. Can be one of ```'single'``` or ```'double'```. Defaults to ```'single'```.
	* **escapeless**: If set to ```true```, strings are rendered without escapes if possible (e.g., the tab character will be rendered as actual tab instead of ```'\t'```). Defaults to ```false```.
	* **compact**: If set to ```true```, generates a compact output with minimal spaces. Overrides indent, space, and newline settings. Defaults to ```false```.
	* **parentheses**: If set to ```true```, renders parentheses even if they could be omitted (e.g. in a ```new``` expression). Defaults to ```true```.
	* **semicolons**: If set to ```true```, renders semicolons even if they could be omitted. Defaults to ```true```.
	* **safeConcatenation**: Safe concatenation of scripts if the AST represents multiple scripts. Defaults to ```false```.

* **directive**

	Set to ```true``` if directives can appear in the global context. Defaults to ```true```.

* **verbatim**

	Defaults to ```null```.

* **sourcemap**

	A SourceMapGenerator instance if you want to generate source maps. See examples/sourcemap.js. Defaults to ```null``` (i.e., no source map will be created).


* **filename**

	The file name used for the source map generation if no source information is contained in the AST. Defaults to ```''```.


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
shift-codegen x 0.10 ops/sec ±2.94% (5 runs sampled)
shift-esotope x 0.84 ops/sec ±6.21% (7 runs sampled)
Fastest is shift-esotope
shift-esotope is x8.83 times faster vs shift-codegen.
```

## License

[BSD](https://raw.githubusercontent.com/vnmc/shift-esotope/master/LICENSE)
