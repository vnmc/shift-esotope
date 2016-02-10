var Benchmark = require('benchmark');

var P1 = {
    a: function(flag)
    {
        return {
            precedence: flag,
            allowIn: false,
            allowCall: true,
            allowUnparenthesizedNew: true
        };
    }
};

var P2 = {
    a0: {
        precedence: false,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },
    a1: {
        precedence: true,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },
    a: function(flag)
    {
        return flag ? P2.a1 : P2.a0;
    }
};

var a0 = {
        precedence: false,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },
    a1 = {
        precedence: true,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    };

var P3 = {
    a: function(flag)
    {
        return flag ? a1 : a0;
    }
}


new Benchmark.Suite()
    .add('return func', function()
    {
        P1.a(Math.random() < 0.5);
    })
    .add('cache', function()
    {
        P2.a(Math.random() < 0.5);
    })
    .add('cache global', function()
    {
        P3.a(Math.random() < 0.5);
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
        console.log('return func / cache ' + (this[1].hz / this[0].hz).toFixed(2) + 'x');
    })
    .run();
