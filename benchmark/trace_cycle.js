var ASTs = require('./asts');
var ShiftEsotope = require('../src/shift-esotope');

var len = ASTs.length;
for (var j = 0; j < 50; ++j)
    for (var i = 0; i < len; ++i)
        ShiftEsotope.generate(ASTs[i]);
