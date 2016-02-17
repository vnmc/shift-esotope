var ShiftParser = require('shift-parser');
var ShiftEsotope = require('../src/shift-esotope');

var code =
	'var pi = 0;\n' +
	'for (var i = 1, sign = 1; i < 1000000; i += 2, sign *= -1)\n' +
	'    pi += sign / i;\n' +
	'pi *= 4;\n' +
	'console.log(pi);';

var ast = ShiftParser.parseScript(code);
var generated = ShiftEsotope.generate(
	ast,
	{
		format: {
			indent: { style: '\t', base: 0 },
			space: ' ',
			newline: '\n'
		}
	}
);

console.log(generated);
