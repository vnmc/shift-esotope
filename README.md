# shift-esotope
*ECMAScript code generator for the [Shift AST](http://shift-ast.org/).*

When looking for a fast JavaScript parser (written in JavaScript), we came across the [Shift Parser](http://shift-ast.org/parser.html) by [Shape Security](http://engineering.shapesecurity.com/), which, according to [Esprima's speed comparison](http://esprima.org/test/compare.html) is the fasters parser when early errors are disabled.

Unfortunately, [the code generator](http://shift-ast.org/codegen.html) (i.e., the module that converts an AST back to JavaScript code) in the Shift suite is rather slow.

```shift-esotope``` is a replacement for the Shift code generator and is an adaption to the Shift AST of Ivan Nikulin's excellent fast [esotope](https://github.com/inikulin/esotope) code generator, which he wrote as a fast replacement for [escodegen](https://github.com/estools/escodegen), in turn.

According to our benchmarks, ```shift-esotope``` is around 8 times faster than the Shift code generator.

```shift-esotope``` also supports generation of source maps via Mozilla's [source map package](https://github.com/mozilla/source-map). The "examples" folder contains an example how to generate source maps.

```shift-esotope``` support generation of comments by passing in a comments data structure via the options (see the "Options" section below).

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

* **locations**

	Location information (a WeakMap mapping AST nodes to location information), as obtained from the result from the ```parseScriptWithLocation``` or ```parseModuleWithLocation``` functions of the Shift parser. If the nodes themselves don't contain any location information, this option needs to be passed to generate a source map. See examples/sourcemap.js.
	Defaults to ```null```.

* **comments**

	When specifying a "comments" property obtained from the Shift parser's return value "comments" property when using ```parseScriptWithLocation``` or ```parseModuleWithLocation```, the code generator tries to restore the comments at the locations specified in the comments data structure.
	The comments structure is expected to be an array of objects in the following format:

	```
	comment: {
		text: string;
		start: { offset: number; };
		end: { offset: number; }
	}
	```

	Defaults to ```null``` (no comments will be generated).

* **sourcemap**

	A SourceMapGenerator instance if you want to generate source maps. See examples/sourcemap.js. Defaults to ```null``` (i.e., no source map will be created).

* **filename**

	The file name used for the source map generation if no source information is contained in the AST. Defaults to ```''```.

* **sourcemapLineOffset**

	A line offset that is added to the generated line numbers when generating the source map.
	Defaults to 0.

* **inputSourcemap**

	A SourceMapConsumer instance defining an input source map to do source map chaining.
	The source map generated by shift-esotop will then map to the original source file
	as defined in the input source map.
	E.g., if shift-esotope is used to transform a JavaScript file generated by CoffeeScript,
	by specifying an input source map, the developer will still be able to debug the original
	coffee file instead of the JavaScript file used for the transformation (which will happen
	if no input source map is used).
	Defaults to ```null```, i.e., no input source map will be used.

* **pureSourcemap**

	If provided, and if an inputSourcemap is provided, another "pure" sourcemap will be generated that uses the AST's location information directly, i.e., without chaining the input sourcemap.
	Defaults to ```null```.


## Test
Clone the repo, then

```
npm run test
```

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
