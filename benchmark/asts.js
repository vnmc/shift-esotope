var Fs = require('fs');
var Path = require('path');
var Parser = require('shift-parser');

var dir = Path.join(__dirname, '../test/fixtures/scripts');

var files = Fs.readdirSync(dir);
var lenFiles = files.length;

var asts = [];
for (var i = 0; i < lenFiles; ++i)
{
    var f = files[i];
    if (/\.js$/.test(f))
        asts.push(Parser.parseScript(Fs.readFileSync(Path.join(dir, f), 'utf8')));
}

module.exports = asts;
