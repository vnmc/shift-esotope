var Benchmark = require('benchmark');
var Parser = require('shift-parser');
var ShiftEsotope = require('../src/shift-esotope');
var ShiftCodeGen = require('shift-codegen');
var ASTs = require('./asts');


new Benchmark.Suite()
    .add('shift-codegen', function()
    {
        var len = ASTs.length;
        for (var i = 0; i < len; ++i)
            ShiftCodeGen.default(ASTs[i]);
    })
    .add('shift-esotope', function()
    {
        var len = ASTs.length;
        for (var i = 0; i < len; ++i)
            ShiftEsotope.generate(ASTs[i]);
    })
    .on('start', function()
    {
        console.log('Benchmarking...')
    })
    .on('cycle', function(event)
    {
        console.log(event.target.toString());
    })
    .on('complete', function()
    {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        console.log('shift-esotope is x' + (this[1].hz / this[0].hz).toFixed(2) + ' times faster vs shift-codegen.');
    })
    .run();
