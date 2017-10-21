require('should');

var Fs = require('fs');
var Path = require('path');
var Util = require('util');
var Parser = require('shift-parser');
var CodeGen = require('../src/shift-esotope');


var dir = 'test/fixtures/';

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

var createIt = function(f, method, withComments)
{
	return function()
	{
		var code = Fs.readFileSync(f, 'utf8');

		var ast = null;
		var options = undefined;
		var numComments = 0;

		var removeCommentIndices = function(key, value)
		{
			if ([ 'commentBefore', 'commentIn', 'commentAfter' ].indexOf(key) >= 0)
			{
				numComments++;
				return undefined;
			}
			
			return value;
		};

		if (withComments)
		{
			var ret = Parser[method + 'WithLocation'](code);
			ast = ret.tree;
			options = {
				locations: ret.locations,
				comments: ret.comments
			};
		}
		else
			ast = Parser[method](code);

		var generated = CodeGen.generate(ast, options);
		//Fs.writeFileSync('__generated.js', generated);

		var ast2 = Parser[method](generated);

		removeEmptyStatements(ast);
		removeEmptyStatements(ast2);

		var json1 = JSON.stringify(ast, withComments ? removeCommentIndices : undefined);
		var json2 = JSON.stringify(ast2);

		//Fs.writeFileSync('__orig.ast', Util.inspect(ast, { depth: null }));
		//Fs.writeFileSync('__generated.ast', Util.inspect(ast2, { depth: null }));

		//ast2.should.eql(ast);
		json2.should.eql(json1);

		if (withComments)
		{
			if (options.comments[0] !== undefined)
				numComments.should.be.greaterThan(0);
			else
				numComments.should.eql(0);
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
			{
				it(f, createIt(Path.join(directory, f), method, false));
				it(f + ' (with comments)', createIt(Path.join(directory, f), method, true));
			}
		}
	};
}

describe('scripts', createTest(dir + 'scripts', 'parseScript'));
describe('modules', createTest(dir + 'modules', 'parseModule'));
