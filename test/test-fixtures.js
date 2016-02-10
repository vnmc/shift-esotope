var Fs = require('fs');
var Path = require('path');
require('should');
var Parser = require('shift-parser');
var CodeGen = require('../src/shift-esotope');

var dir = 'test/fixtures';

var files = Fs.readdirSync(dir);
var lenFiles = files.length;

describe('fixtures', function()
{
	var createIt = function(f)
	{
		return function()
		{
			var code = Fs.readFileSync(Path.join(dir, f), 'utf8');

			var ast = Parser.parseScript(code);

			var generated = CodeGen.generate(ast);
			//Fs.writeFileSync('__generated.js', generated);

			var ast2 = Parser.parseScript(generated);

			var json1 = JSON.stringify(ast);
			var json2 = JSON.stringify(ast2);

			//ast2.should.eql(ast);
			json2.should.eql(json1);
		}
	};

	for (var i = 0; i < lenFiles; ++i)
	{
		var f = files[i];
		if (/\.js$/.test(f))
			it(f, createIt(f));
	}
});
