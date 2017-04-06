var ShiftParser = require('shift-parser');
var ShiftEsotope = require('../src/shift-esotope');
var SourceMap = require('source-map');

var code =
	'var pi = 0;\n' +
	'for (var i = 1, sign = 1; i < 1000000; i += 2, sign *= -1)\n' +
	'    pi += sign / i;\n' +
	'pi *= 4;\n' +
	'console.log(pi);';

// remember to parse with using the "parseScriptWithLocation" function
var result = ShiftParser.parseScriptWithLocation(code);

// create a source map generator and pass it to the code generator in the options
var sourcemap = new SourceMap.SourceMapGenerator({ file: 'out.js' });
var newCode = ShiftEsotope.generate(
	result.tree,
	{
		locations: result.locations,
		sourcemap: sourcemap,
		filename: 'in.js'
	}
);

console.log(newCode);
console.log(sourcemap.toString());
