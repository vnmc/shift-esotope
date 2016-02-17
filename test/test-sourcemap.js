require('should');

var Fs = require('fs');
var Path = require('path');
var Util = require('util');
var Parser = require('shift-parser');
var CodeGen = require('../src/shift-esotope');


var dir = 'test/fixtures/';

var createIt = function(f, method)
{
	return function()
	{
		var code = Fs.readFileSync(f, 'utf8');
		var ast = Parser[method](code, { loc: true });

		var mappings = [];
		var map = {
			addMapping: function(mapping, node)
			{
				mappings.push({
					line: mapping.generated.line,
					col: mapping.generated.column,
					origline: mapping.original.line,
					origcol: mapping.original.column,
					ast: node
				});
			}
		};

		var generated = CodeGen.generate(ast, { sourcemap: map });
		//Fs.writeFileSync('__generated.js', generated);

		var lines = generated.split('\n');

		var len = mappings.length;
		for (var i = 0; i < len; i++)
		{
			var m = mappings[i];
			var a = lines[m.line - 1].substr(m.col);
			var b = CodeGen.generate(m.ast);

			//console.log('[', m.line, m.col, ']:', m.ast.type, b.length, b.substr(0, Math.max(50, b.indexOf('\n'))), ' <|> ', a);

			var l = Math.min(a.length, b.length);
			a = a.substr(0, l);
			b = b.substr(0, l);
			(a + ' ' + m.origline + ':' + m.origcol).should.eql(b + ' ' + m.origline + ':' + m.origcol);
		}
	}
};

var createTest = function(directory, method)
{
	return function()
	{
		var files = Fs.readdirSync(directory);
		var len = files.length;

		for (var i = 0; i < len; ++i)
		{
			var f = files[i];
			if (/\.js$/.test(f))
				it(f, createIt(Path.join(directory, f), method));
		}
	};
}

describe('source positions', function()
{
	describe('scripts', createTest(dir + 'scripts', 'parseScript'));
	describe('modules', createTest(dir + 'modules', 'parseModule'));	
});
