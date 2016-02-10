var Fs = require('fs');
require('should');
var Parser = require('shift-parser');
var CodeGen = require('../src/shift-esotope');


var lines = Fs.readFileSync('test/fixtures/snippets.txt', 'utf8').split('\n');
var len = lines.length;


describe('Running snippets', function()
{
	var removeEmptyStatements = function(node)
	{
		for (var k in node)
		{
			var child = node[k];
			if (Array.isArray(child))
			{
				var len = child.length;
				if (len > 1)
				{
					for (var i = 0; i < len; ++i)
					{
						var a = child[i];
						if (typeof a === 'object' && a.type === 'EmptyStatement')
						{
							child.splice(i, 1);
							--len;
							--i;
						}
					}
				}
			}
		}
	};

	var createIt = function(code)
	{
		it(code, function()
		{
			var fnx = 'parseScript';
			if (/^export|^import/.test(code))
				fnx = 'parseModule';

			// Note: to allow newlines in the code snippets, "\n" is treated as newline, and "\\n" is treated as "\n"
			var ast = Parser[fnx](code.replace(/\\?\\n/g, function(match)
			{
				if (match === '\\\\n')
					return '\\n';
				return '\n';
			}));

			var ast2 = Parser[fnx](CodeGen.generate(ast));

			removeEmptyStatements(ast);
			removeEmptyStatements(ast2);

			ast2.should.eql(ast);
		});
	};

	var createDescribe = function(name, idx)
	{
		describe(name, function()
		{
			for (var i = idx; i < len; i++)
			{
				var line = lines[i];
				if (!line || /^\/\//.test(line))
					break;

				createIt(line);
			}
		});
	};

	for (var i = 0; i < len; i++)
	{
		var line = lines[i];

		if (!line)
			continue;
		
		if (/^\/\/.*?\.js$/.test(line))
			createDescribe(line.substr(2).trim(), i + 1);
	}
});
