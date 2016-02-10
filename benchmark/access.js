var Benchmark = require('benchmark');

var _ = {
    js: '',
    js2: ''
};

var _js = '';

new Benchmark.Suite()
    .add('_', function()
    {
        for (var i = 0; i < 10; ++i)
            _.js += Math.random().toString(36).substr(2, 5);
    })
    .add('glob', function()
    {
        for (var i = 0; i < 10; ++i)
            _js += Math.random().toString(36).substr(2, 5);
    })
    .add('loc', function()
    {
        var tmp = '';
        for (var i = 0; i < 10; ++i)
            tmp += Math.random().toString(36).substr(2, 5);
        _.js2 += tmp;
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
        console.log('return _ / glob ' + (this[1].hz / this[0].hz).toFixed(2) + 'x');
    })
    .run();
