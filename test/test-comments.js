require('should');

var Parser = require('shift-parser');
var CodeGen = require('../src/shift-esotope');


var findCodeCoveredRanges = function(code)
{
	var ret = Parser.parseScriptWithLocation(code);
	var ranges = [];
	CodeGen.findCodeCoveredRanges(ret.tree, ret.locations, ranges);
	return ranges;
};

var collapseComments = function(code)
{
	var ret = Parser.parseScriptWithLocation(code);
	return CodeGen.collapseComments(ret.tree, ret.locations, ret.comments);
};

var cg = function(code)
{
	//console.log(code);
	var ret = Parser.parseScriptWithLocation(code);
	//console.log(ret.comments);

	return CodeGen.generate(
		ret.tree,
		{
			locations: ret.locations,
			comments: ret.comments,
			format: {
				compact: true,
				quotes: 'double'
			}
		}
	);
};


describe('findCodeCoveredRanges', function()
{
	it('should work with contiguous code block', function()
	{
		findCodeCoveredRanges('a(b)').should.eql([ [ 0, 1 ], [ 2, 3 ] ]);
	});

	it('should work with contiguous code block with spaces', function()
	{
		findCodeCoveredRanges('a( b )').should.eql([ [ 0, 1 ], [ 3, 4 ] ]);
	});

	it('should work with contiguous code block with comments', function()
	{
		findCodeCoveredRanges('a( /*c*/ b /*comment*/ )').should.eql([ [ 0, 1 ], [ 9, 10 ] ]);
	});
});

describe('isNotInCoveredRange', function()
{
	it('before start', function()
	{
		CodeGen.isNotInCoveredRange([ [ 3, 6 ], [ 10, 20 ] ], 0, 1).should.eql(true);
	});

	it('in first range', function()
	{
		CodeGen.isNotInCoveredRange([ [ 3, 6 ], [ 10, 20 ] ], 3, 5).should.eql(false);
	});

	it('between ranges', function()
	{
		CodeGen.isNotInCoveredRange([ [ 3, 6 ], [ 10, 20 ] ], 8, 9).should.eql(true);
	});

	it('in second range', function()
	{
		CodeGen.isNotInCoveredRange([ [ 3, 6 ], [ 10, 20 ] ], 13, 16).should.eql(false);
	});

	it('enclosing first range', function()
	{
		CodeGen.isNotInCoveredRange([ [ 3, 6 ], [ 10, 20 ] ], 1, 8).should.eql(false);
	});

	it('overlapping first range', function()
	{
		CodeGen.isNotInCoveredRange([ [ 3, 6 ], [ 10, 20 ] ], 4, 7).should.eql(false);
	});

	it('spanning both ranges', function()
	{
		CodeGen.isNotInCoveredRange([ [ 3, 6 ], [ 10, 20 ] ], 0, 30).should.eql(false);
	});
});

describe('collapseComments', function()
{
	it('should work with no comments', function()
	{
		collapseComments('print("no comment")').should.eql([]);
	});

	it('should work with one comment at start', function()
	{
		var comments = collapseComments('/* hello */ print("no comment")');
		comments.length.should.eql(1);
		comments[0].text.should.eql(' hello ');
		comments[0].start.offset.should.eql(0);
		comments[0].end.offset.should.eql(11);
	});

	it('should work with two separate comments', function()
	{
		var comments = collapseComments('/*c1*/ print("no comment") /*c2*/');
		
		comments.length.should.eql(2);

		comments[0].text.should.eql('c1');
		comments[0].start.offset.should.eql(0);
		comments[0].end.offset.should.eql(6);

		comments[1].text.should.eql('c2');
		comments[1].start.offset.should.eql(27);
		comments[1].end.offset.should.eql(33);
	});

	it('should work with subsequent comments without spaces', function()
	{
		var comments = collapseComments('/*c1*//*c2*//*c3*/ print("no comment")');
		
		comments.length.should.eql(1);

		comments[0].text.should.eql('c1*//*c2*//*c3');
		comments[0].start.offset.should.eql(0);
		comments[0].end.offset.should.eql(18);
	});

	it('should work with subsequent comments with spaces', function()
	{
		var comments = collapseComments('/*c1*/ /*c2*/\t /*c3*/\n//c4\nprint("no comment")');
		
		comments.length.should.eql(1);

		comments[0].text.should.eql('c1*//*c2*//*c3*//*c4');
		comments[0].start.offset.should.eql(0);
		comments[0].end.offset.should.eql(27);
	});
});

describe('Comments', function()
{
	it('only comment', function()
	{
		cg('/* only comment */').should.eql('/* only comment */');
	});

	it('comment at end', function()
	{
		cg('exec(); /* done */').should.eql('exec();/* done */');
	});

	it('comment at start and end', function()
	{
		cg('/*pre*/ exec(); /* done */').should.eql('/*pre*/exec();/* done */');
	});

	it('comment at start and end (block)', function()
	{
		cg('/*pre*/ {exec(); /* done */}').should.eql('/*pre*/{exec();/* done */}');
	});

	it('multiple comments, comment at start', function()
	{
		cg('/* documentation */\nfunction foo() {\n// do something\nreturn "bar"; }').should.eql('/* documentation */function foo(){/* do something*/return"bar";}');
	});

	it('comment before return', function()
	{
		cg('function foo() {\n// do something\nreturn "bar"; }').should.eql('function foo(){/* do something*/return"bar";}');
	});

	it('multi-line comment after return', function()
	{
		cg('function foo() {\nreturn "bar"; /* done */}').should.eql('function foo(){return"bar";/* done */}');
	});

	it('line comment after return', function()
	{
		cg('function foo() {\nreturn "bar";\n// done\n}').should.eql('function foo(){return"bar";/* done*/}');
	});

	it('function with comments before and after statement', function()
	{
		cg('function foo() {/*before*/ stmt(); /*after*/ }').should.eql('function foo(){/*before*/stmt();/*after*/}');
	});

	it('function body commented out', function()
	{
		cg('function foo() {/*console.log("Hello");*/}').should.eql('function foo(){/*console.log("Hello");*/}');
	});

	it('switch statement', function()
	{
		cg('switch(/*what*/ c){case 1://first case\nprint("X") /*x*/;}').should.eql('switch(/*what*/c){case 1:/*first case*/print("X")/*x*/;}');
	});

	it('object literal', function()
	{
		cg('({/*a*/ a /*b*/: /*c*/0/*d*/} /*end*/)').should.eql('({/*a*/a:/*b*//*c*/0/*d*/}/*end*/);');
	});

	it('multiple subsequent comments without spaces', function()
	{
		cg('print("a");/*magic*//*value*/print("b");').should.eql('print("a");/*magic*//*value*/print("b");');
	});

	it('multiple subsequent comments with spaces', function()
	{
		cg('print("a"); /*magic*/ /*value*/   /* wow! */ print("b"); /*X*/ print("c");').should.eql('print("a");/*magic*//*value*//* wow! */print("b");/*X*/print("c");');
	});
});
