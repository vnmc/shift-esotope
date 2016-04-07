require('should');

var Parser = require('shift-parser');
var CodeGen = require('../src/shift-esotope');

var cg = function(code)
{
	return CodeGen.generate(
		Parser.parseScript(code),
		{
			format: {
				compact: true,
				quotes: 'double'
			}
		}
	);
};


describe('Object literals', function()
{
	it('should not add quotes to identifier char proprety names', function()
	{
		cg('({foo:0});').should.eql('({foo:0});');
	});

	it('should add quotes to digit property names', function()
	{
		cg('({"0":0});').should.eql('({"0":0});');
	});

	it('should add quotes to non-identifier char property names', function()
	{
		cg('({"a-b":0});').should.eql('({"a-b":0});');
	});

	it('should add quotes to reserved-word property names', function()
	{
		cg('({class:0});').should.eql('({"class":0});');
	});
});
