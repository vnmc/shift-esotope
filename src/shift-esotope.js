/*
 Copyright (C) 2016 Matthias Christen <christen@vanamco.com>
 Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
 Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
 Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
 Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
 Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
 Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
 Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
 Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
 Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
 Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
 Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

(function() {

if (typeof module === 'undefined')
{
    if (typeof exports === 'undefined')
    {
        window.ShiftEsotope = {};
        var module = { exports: window.ShiftEsotope };        
    }
    else
        var module = { exports: exports };
}

var isArray,
    json,
    renumber,
    hexadecimal,
    quotes,
    escapeless,
    parentheses,
    semicolons,
    safeConcatenation,
    directive,
    extra,
    parse;

var Syntax = {
    ArrayBinding:                 'ArrayBinding',
    ArrayExpression:              'ArrayExpression',
    ArrowExpression:              'ArrowExpression',
    AssignmentExpression:         'AssignmentExpression',
    Block:                        'Block',
    BlockStatement:               'BlockStatement',
    BinaryExpression:             'BinaryExpression',
    BindingIdentifier:            'BindingIdentifier',
    BindingPropertyIdentifier:    'BindingPropertyIdentifier',
    BindingPropertyProperty:      'BindingPropertyProperty',
    BindingWithDefault:           'BindingWithDefault',
    BreakStatement:               'BreakStatement',
    CallExpression:               'CallExpression',
    CatchClause:                  'CatchClause',
    ClassDeclaration:             'ClassDeclaration',
    ClassExpression:              'ClassExpression',
    ClassElement:                 'ClassElement',
    CompoundAssignmentExpression: 'CompoundAssignmentExpression',
    ComputedMemberExpression:     'ComputedMemberExpression',
    ComputedPropertyName:         'ComputedPropertyName',
    ConditionalExpression:        'ConditionalExpression',
    ContinueStatement:            'ContinueStatement',
    DataProperty:                 'DataProperty',
    DebuggerStatement:            'DebuggerStatement',
    Directive:                    'Directive',
    DoWhileStatement:             'DoWhileStatement',
    EmptyStatement:               'EmptyStatement',
    Export:                       'Export',
    ExportAllFrom:                'ExportAllFrom',
    ExportDefault:                'ExportDefault',
    ExportFrom:                   'ExportFrom',
    ExportSpecifier:              'ExportSpecifier',
    ExpressionStatement:          'ExpressionStatement',
    FormalParameters:             'FormalParameters',
    ForStatement:                 'ForStatement',
    ForInStatement:               'ForInStatement',
    ForOfStatement:               'ForOfStatement',
    FunctionDeclaration:          'FunctionDeclaration',
    FunctionExpression:           'FunctionExpression',
    FunctionBody:                 'FunctionBody',
    Getter:                       'Getter',
    IdentifierExpression:         'IdentifierExpression',
    IfStatement:                  'IfStatement',
    Import:                       'Import',
    ImportNamespace:              'ImportNamespace',
    ImportSpecifier:              'ImportSpecifier',
    LiteralBooleanExpression:     'LiteralBooleanExpression',
    LiteralInfinityExpression:    'LiteralInfinityExpression',
    LiteralNullExpression:        'LiteralNullExpression',
    LiteralNumericExpression:     'LiteralNumericExpression',
    LiteralRegExpExpression:      'LiteralRegExpExpression',
    LiteralStringExpression:      'LiteralStringExpression',
    LabeledStatement:             'LabeledStatement',
    Method:                       'Method',
    Module:                       'Module',
    NewExpression:                'NewExpression',
    NewTargetExpression:          'NewTargetExpression',
    ObjectBinding:                'ObjectBinding',
    ObjectExpression:             'ObjectExpression',
    ReturnStatement:              'ReturnStatement',
    Script:                       'Script',
    Setter:                       'Setter',
    ShorthandProperty:            'ShorthandProperty',
    SpreadElement:                'SpreadElement',
    StaticMemberExpression:       'StaticMemberExpression',
    StaticPropertyName:           'StaticPropertyName',
    Super:                        'Super',
    SwitchStatement:              'SwitchStatement',
    SwitchStatementWithDefault:   'SwitchStatementWithDefault',
    SwitchCase:                   'SwitchCase',
    SwitchDefault:                'SwitchDefault',
    TemplateElement:              'TemplateElement',
    TemplateExpression:           'TemplateExpression',
    ThisExpression:               'ThisExpression',
    ThrowStatement:               'ThrowStatement',
    TryCatchStatement:            'TryCatchStatement',
    TryFinallyStatement:          'TryFinallyStatement',
    UnaryExpression:              'UnaryExpression',
    UpdateExpression:             'UpdateExpression',
    VariableDeclaration:          'VariableDeclaration',
    VariableDeclarationStatement: 'VariableDeclarationStatement',
    VariableDeclarator:           'VariableDeclarator',
    WhileStatement:               'WhileStatement',
    WithStatement:                'WithStatement',
    YieldExpression:              'YieldExpression',
    YieldGeneratorExpression:     'YieldGeneratorExpression'
};
module.exports.Syntax = Syntax;

var Precedence = {
    Sequence:       0,
    Yield:          1,
    Assignment:     1,
    Conditional:    2,
    ArrowFunction:  2,
    LogicalOR:      3,
    LogicalAND:     4,
    BitwiseOR:      5,
    BitwiseXOR:     6,
    BitwiseAND:     7,
    Equality:       8,
    Relational:     9,
    BitwiseSHIFT:   10,
    Additive:       11,
    Multiplicative: 12,
    Unary:          13,
    Postfix:        14,
    Call:           15,
    New:            16,
    TaggedTemplate: 17,
    Member:         18,
    Primary:        19
};

var BinaryPrecedence = {
    ',':          Precedence.Sequence,
    '||':         Precedence.LogicalOR,
    '&&':         Precedence.LogicalAND,
    '|':          Precedence.BitwiseOR,
    '^':          Precedence.BitwiseXOR,
    '&':          Precedence.BitwiseAND,
    '==':         Precedence.Equality,
    '!=':         Precedence.Equality,
    '===':        Precedence.Equality,
    '!==':        Precedence.Equality,
    'is':         Precedence.Equality,
    'isnt':       Precedence.Equality,
    '<':          Precedence.Relational,
    '>':          Precedence.Relational,
    '<=':         Precedence.Relational,
    '>=':         Precedence.Relational,
    'in':         Precedence.Relational,
    'instanceof': Precedence.Relational,
    '<<':         Precedence.BitwiseSHIFT,
    '>>':         Precedence.BitwiseSHIFT,
    '>>>':        Precedence.BitwiseSHIFT,
    '+':          Precedence.Additive,
    '-':          Precedence.Additive,
    '*':          Precedence.Multiplicative,
    '%':          Precedence.Multiplicative,
    '/':          Precedence.Multiplicative
};

function getDefaultOptions()
{
    // default options
    return {
        indent: null,
        base: null,
        parse: null,
        format: {
            indent: {
                style: '    ',
                base: 0
            },
            newline: '\n',
            space: ' ',
            json: false,
            renumber: false,
            hexadecimal: false,
            quotes: 'single',
            escapeless: false,
            compact: false,
            parentheses: true,
            semicolons: true,
            safeConcatenation: false
        },
        directive: true,
        raw: true,
        verbatim: null
    };
}


/////////////////////////////////////////////////////////////////////
// Lexical Utilities

// Constants
var NON_ASCII_WHITESPACES = [
    0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
    0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000,
    0xFEFF
];

// Regular expressions
var NON_ASCII_IDENTIFIER_CHARACTERS_REGEXP = new RegExp(
    '[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376' +
    '\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-' +
    '\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA' +
    '\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-' +
    '\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-' +
    '\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-' +
    '\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-' +
    '\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38' +
    '\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83' +
    '\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9' +
    '\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-' +
    '\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-' +
    '\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E' +
    '\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-' +
    '\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-' +
    '\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-' +
    '\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE' +
    '\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44' +
    '\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-' +
    '\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A' +
    '\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-' +
    '\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9' +
    '\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84' +
    '\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-' +
    '\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5' +
    '\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-' +
    '\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-' +
    '\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD' +
    '\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B' +
    '\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E' +
    '\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-' +
    '\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-' +
    '\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-' +
    '\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F' +
    '\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115' +
    '\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188' +
    '\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-' +
    '\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-' +
    '\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A' +
    '\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5' +
    '\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697' +
    '\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873' +
    '\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-' +
    '\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-' +
    '\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC' +
    '\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-' +
    '\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D' +
    '\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74' +
    '\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-' +
    '\uFFD7\uFFDA-\uFFDC]'
);


// Utility functions
function isIdentifierCh(cp)
{
    if (cp < 0x80)
    {
        return cp >= 97 && cp <= 122 ||   // a..z
            cp >= 65 && cp <= 90 ||       // A..Z
            cp >= 48 && cp <= 57 ||       // 0..9
            cp === 36 || cp === 95 ||     // $ (dollar) and _ (underscore)
            cp === 92;                    // \ (backslash)
    }

    return NON_ASCII_IDENTIFIER_CHARACTERS_REGEXP.test(String.fromCharCode(cp));
}

function isIdentifierString(s)
{
    var len = s.length;

    if (!len)
        return false;

    var cp = s.charCodeAt(0);
    if (cp >= 48 && cp <= 57)
        return false;

    for (var i = 0; i < len; ++i)
    {
        var cp = s.charCodeAt(i);
        if (cp === 92 || !isIdentifierCh(cp))
            return false;
    }

    return true;
}

function isLineTerminator(cp)
{
    return cp === 0x0A || cp === 0x0D || cp === 0x2028 || cp === 0x2029;
}

function isWhitespace(cp)
{
    return cp === 0x20 || cp === 0x09 || isLineTerminator(cp) || cp === 0x0B || cp === 0x0C || cp === 0xA0 ||
        (cp >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(cp) >= 0);
}

function isDecimalDigit(cp)
{
    return cp >= 48 && cp <= 57;
}

function stringRepeat(str, num)
{
    var result = '';

    for (num |= 0; num > 0; num >>>= 1, str += str)
        if (num & 1)
            result += str;

    return result;
}

isArray = Array.isArray;
if (!isArray)
{
    isArray = function isArray(array)
    {
        return Object.prototype.toString.call(array) === '[object Array]';
    };
}

function isHashObject(target)
{
    return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
}

function updateDeeply(target, override)
{
    for (var key in override)
    {
        if (override.hasOwnProperty(key))
        {
            var val = override[key];

            if (isHashObject(val))
            {
                if (isHashObject(target[key]))
                    updateDeeply(target[key], val);
                else
                    target[key] = updateDeeply({}, val);
            }
            else
                target[key] = val;
        }
    }

    return target;
}

function escapeAllowedCharacter(code, next)
{
    var hex, result = '\\';

    switch (code)
    {
    case 0x08: // \b
        result += 'b';
        break;

    case 0x0C: // \f
        result += 'f';
        break;

    case 0x09: // \t
        result += 't';
        break;

    default:
        hex = code.toString(16).toUpperCase();
        if (json || code > 0xFF)
            result += 'u' + '0000'.slice(hex.length) + hex;
        else if (code === 0x0000 && !isDecimalDigit(next))
            result += '0';
        else if (code === 0x000B)    // \v
            result += 'x0B';
        else
            result += 'x' + '00'.slice(hex.length) + hex;
        break;
    }

    return result;
}

function escapeDisallowedCharacter(code)
{
    switch (code)
    {
    case 0x5C: // \
        return '\\\\';
    case 0x0A: // \n
        return '\\n';
    case 0x0D: // \r
        return '\\r';
    case 0x2028:
        return '\\u2028';
    case 0x2029:
        return '\\u2029';
    }

    return '\\';
}

function escapeDirective(str)
{
    var code,
        quote = quotes === 'double' ? '"' : '\'';

    for (var i = 0, iz = str.length; i < iz; ++i)
    {
        code = str.charCodeAt(i);

        if (code === 0x27)
        {
            // '
            quote = '"';
            break;
        }
        else if (code === 0x22)
        {
            // "
            quote = '\'';
            break;
        }
        else if (code === 0x5C)
        {
            // \
            ++i;
        }
    }

    return quote + str + quote;
}

function escapeString(str)
{
    var result = '',
        code,
        singleQuotes = 0,
        doubleQuotes = 0,
        single,
        quote;
    
    // TODO http://jsperf.com/character-counting/8
    for (var i = 0, len = str.length; i < len; ++i)
    {
        code = str.charCodeAt(i);
        if (code === 0x27)              // '
            ++singleQuotes;
        else if (code === 0x22)         // "
            ++doubleQuotes;
        else if (code === 0x2F && json) // /
            result += '\\';
        else if (isLineTerminator(code) || code === 0x5C) // \
        {
            result += escapeDisallowedCharacter(code);
            continue;
        }
        else if ((json && code < 0x20) /* SP */ || !(json || escapeless || (code >= 0x20 && code <= 0x7E)) /* SP, ~ */)
        {
            result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
            continue;
        }

        result += String.fromCharCode(code);
    }

    single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
    quote = single ? '\'' : '"';

    if (!(single ? singleQuotes : doubleQuotes))
        return quote + result + quote;

    str = result;
    result = quote;

    for (i = 0, len = str.length; i < len; ++i)
    {
        code = str.charCodeAt(i);

        if ((code === 0x27 && single) || (code === 0x22 && !single))    // ', "
            result += '\\';

        result += String.fromCharCode(code);
    }

    return result + quote;
}


function join(l, r)
{
    if (!l.length)
        return r;

    if (!r.length)
        return l;

    var lCp = l.charCodeAt(l.length - 1),
        rCp = r.charCodeAt(0);

    if (isIdentifierCh(lCp) && isIdentifierCh(rCp) ||
        lCp === rCp && (lCp === 0x2B || lCp === 0x2D) || // + +, - -
        lCp === 0x2F && rCp === 0x69)                    // /re/ instanceof foo
    {
        return l + _.space + r;
    }

    if (isWhitespace(lCp) || isWhitespace(rCp))
        return l + r;

    return l + _.optSpace + r;
}

function shiftIndent()
{
    var prevIndent = _.indent;
    _.indent += _.indentUnit;
    return prevIndent;
}

function adoptionPrefix($stmt)
{
    if ($stmt.type === Syntax.BlockStatement || $stmt.type === Syntax.FunctionBody)
        return _.optSpace;

    if ($stmt.type === Syntax.EmptyStatement)
        return '';

    return _.newline + _.indent + _.indentUnit;
}

function adoptionSuffix($stmt)
{
    if ($stmt.type === Syntax.BlockStatement)
        return _.optSpace;

    return _.newline + _.indent;
}

// Subentity generators
function generateVerbatim($expr, settings)
{
    var verbatim = $expr[extra.verbatim],
        strVerbatim = typeof verbatim === 'string',
        precedence = !strVerbatim && verbatim.precedence !== undefined ? verbatim.precedence : Precedence.Sequence,
        parenthesize = precedence < settings.precedence,
        content = strVerbatim ? verbatim : verbatim.content,
        chunks = content.split(/\r\n|\n/),
        chunkCount = chunks.length;

    if (parenthesize)
        _.js += '(';

    _.js += chunks[0];

    for (var i = 1; i < chunkCount; ++i)
        _.js += _.newline + _.indent + chunks[i];

    if (parenthesize)
        _.js += ')';
}

function generateFunctionParams($node)
{
    var $params = $node.params.items,
        $rest = $node.params.rest,
        paramCount = $params.length,
        lastParamIdx = paramCount - 1,
        arrowFuncWithSingleParam =
            $node.type === Syntax.ArrowExpression && !$rest && paramCount === 1 &&
            $params[0].type === Syntax.IdentifierExpression;

    if (arrowFuncWithSingleParam)
    {
        // "arg => { ... }"
        _.js += $params[0].name;
    }
    else
    {
        _.js += '(';

        for (var i = 0; i < paramCount; ++i)
        {
            var $param = $params[i];

            if ($param.type === Syntax.BindingIdentifier)
                _.js += $param.name;
            else
                ExprGen[$param.type]($param, Preset.e4);

            if (i !== lastParamIdx)
                _.js += ',' + _.optSpace;
        }

        if ($rest)
        {
            if (paramCount)
                _.js += ',' + _.optSpace;

            _.js += '...' + $rest.name;
        }

        _.js += ')';
    }
}

function generateFunctionBody($node)
{
    var $body = $node.body;

    if ($node.type === Syntax.ArrowExpression)
        _.js += _.optSpace + '=>';

    if (ExprGen[$body.type])
    {
        _.js += _.optSpace;

        var exprJs = exprToJs($body, Preset.e4);

        if (exprJs.charAt(0) === '{')
            exprJs = '(' + exprJs + ')';

        _.js += exprJs;
    }
    else
    {
        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s8);
    }    
}

function generateFunction($node)
{
    generateFunctionParams($node);
    generateFunctionBody($node);
}


/////////////////////////////////////////////////////////////////////
// Syntactic Entity Generation Presets

var Preset = {
    e1_0: {
        precedence: Precedence.Assignment,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e1_1: {
        precedence: Precedence.Assignment,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e1: function(allowIn)
    {
        return allowIn ? Preset.e1_1 : Preset.e1_0;
    },

    e2_0: {
        precedence: Precedence.LogicalOR,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e2_1: {
        precedence: Precedence.LogicalOR,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e2: function(allowIn)
    {
        return allowIn ? Preset.e2_1 : Preset.e2_0;
    },

    e3: {
        precedence: Precedence.Call,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: false
    },

    e4: {
        precedence: Precedence.Assignment,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e5: {
        precedence: Precedence.Sequence,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e6_0: {
        precedence: Precedence.New,
        allowIn: true,
        allowCall: false,
        allowUnparenthesizedNew: false
    },

    e6_1: {
        precedence: Precedence.New,
        allowIn: true,
        allowCall: false,
        allowUnparenthesizedNew: true
    },

    e6: function(allowUnparenthesizedNew)
    {
        return allowUnparenthesizedNew ? Preset.e6_1 : Preset.e6_0;
    },

    e7: {
        precedence: Precedence.Unary,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e8: {
        precedence: Precedence.Postfix,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e9: {
        precedence: undefined,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e10: {
        precedence: Precedence.Call,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e11_0: {
        precedence: Precedence.Call,
        allowIn: true,
        allowCall: false,
        allowUnparenthesizedNew: false
    },

    e11_1: {
        precedence: Precedence.Call,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: false
    },

    e11: function(allowCall)
    {
        return allowCall ? Preset.e11_1 : Preset.e11_0;
    },

    e12: {
        precedence: Precedence.Primary,
        allowIn: false,
        allowCall: false,
        allowUnparenthesizedNew: true
    },

    e13: {
        precedence: Precedence.Primary,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e14: {
        precedence: Precedence.Sequence,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e15_0: {
        precedence: Precedence.Sequence,
        allowIn: true,
        allowCall: false,
        allowUnparenthesizedNew: true
    },

    e15_1: {
        precedence: Precedence.Sequence,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e15: function(allowCall)
    {
        return allowCall ? Preset.e15_0 : Preset.e15_1;
    },

    e16: function(precedence, allowIn)
    {
        return {
            precedence: precedence,
            allowIn: allowIn,
            allowCall: true,
            allowUnparenthesizedNew: true
        };
    },

    e17_0: {
        precedence: Precedence.Call,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e17_1: {
        precedence: Precedence.Call,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e17: function(allowIn)
    {
        return allowIn ? Preset.e17_1 : Preset.e17_0;
    },

    e18_0: {
        precedence: Precedence.Assignment,
        allowIn: false,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e18_1: {
        precedence: Precedence.Assignment,
        allowIn: true,
        allowCall: true,
        allowUnparenthesizedNew: true
    },

    e18: function(allowIn)
    {
        return allowIn ? Preset.e18_1 : Preset.e18_0;
    },

    e19: {
        precedence: Precedence.Sequence,
        allowIn: true,
        allowCall: true,
        semicolonOptional: false
    },

    s1_0: {
        allowIn: true,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: false
    },

    s1_1: {
        allowIn: true,
        functionBody: false,
        directiveContext: true,
        semicolonOptional: false
    },

    s1_2: {
        allowIn: true,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: true
    },

    s1_3: {
        allowIn: true,
        functionBody: false,
        directiveContext: true,
        semicolonOptional: true
    },

    s1: function(directiveContext, semicolonOptional)
    {
        return directiveContext ?
            (semicolonOptional ? Preset.s1_3 : Preset.s1_1) :
            (semicolonOptional ? Preset.s1_2 : Preset.s1_0);
    },

    s2: {
        allowIn: true,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: true
    },

    s3_0: {
        allowIn: false,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: false
    },

    s3_1: {
        allowIn: true,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: false
    },

    s3: function(allowIn)
    {
        return allowIn ? Preset.s3_1 : Preset.s3_0;
    },

    s4_0: {
        allowIn: true,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: false
    },

    s4_1: {
        allowIn: true,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: true
    },

    s4: function(semicolonOptional)
    {
        return semicolonOptional ? Preset.s4_1 : Preset.s4_0;
    },

    s5_0: {
        allowIn: true,
        functionBody: false,
        directiveContext: true,
        semicolonOptional: false,
    },

    s5_1: {
        allowIn: true,
        functionBody: false,
        directiveContext: true,
        semicolonOptional: true,
    },

    s5: function(semicolonOptional)
    {
        return semicolonOptional ? Preset.s5_1 : Preset.s5_0;
    },

    s6: {
        allowIn: false,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: false
    },

    s7: {
        allowIn: true,
        functionBody: false,
        directiveContext: false,
        semicolonOptional: false
    },

    s8: {
        allowIn: true,
        functionBody: true,
        directiveContext: false,
        semicolonOptional: false
    }
};


/////////////////////////////////////////////////////////////////////
// Expressions

// Regular expressions
var FLOATING_OR_OCTAL_REGEXP = /[.eExX]|^0[0-9]+/,
    LAST_DECIMAL_DIGIT_REGEXP = /[0-9]$/;


// Common expression generators

function generateArrayPatternOrExpression($expr)
{
    var $elems = $expr.elements,
        elemCount = $elems.length,
        $rest = $expr.restElement;

    if (elemCount)
    {
        var lastElemIdx = elemCount - 1,
            multiline = elemCount > 1 || $rest,
            prevIndent = shiftIndent(),
            itemPrefix = _.newline + _.indent;

        _.js += '[';

        for (var i = 0; i < elemCount; ++i)
        {
            var $elem = $elems[i];

            if (multiline)
                _.js += itemPrefix;

            if ($elem)
                ExprGen[$elem.type]($elem, Preset.e4);

            if (i !== lastElemIdx || !$elem)
                _.js += ',';
        }

        if ($rest)
        {
            _.js += ',';
            
            if (multiline)
                _.js += itemPrefix;
            else
                _.js += _.optSpace;

            _.js += '...';
            ExprGen[$rest.type]($rest, Preset.e4);
        }

        _.indent = prevIndent;

        if (multiline)
            _.js += _.newline + _.indent;

        _.js += ']';
    }
    else if ($rest)
    {
        _.js += '[ ...';
        ExprGen[$rest.type]($rest, Preset.e4);
        _.js += ']';
    }
    else
        _.js += '[]';
}


// Expression raw generator dictionary

var ExprRawGen = {
    AssignmentExpression: function generateAssignmentExpression($expr, settings)
    {
        var $left = $expr.binding,
            $right = $expr.expression,
            parenthesize = Precedence.Assignment < settings.precedence,
            allowIn = settings.allowIn || parenthesize;

        if (parenthesize)
            _.js += '(';

        ExprGen[$left.type]($left, Preset.e17(allowIn));
        _.js += _.optSpace + '=' + _.optSpace;
        ExprGen[$right.type]($right, Preset.e18(allowIn));

        if (parenthesize)
            _.js += ')';
    },

    CompoundAssignmentExpression: function generateCompoundAssignmentExpression($expr, settings)
    {
        var $left = $expr.binding,
            $right = $expr.expression,
            parenthesize = Precedence.Assignment < settings.precedence,
            allowIn = settings.allowIn || parenthesize;

        if (parenthesize)
            _.js += '(';

        ExprGen[$left.type]($left, Preset.e17(allowIn));
        _.js += _.optSpace + $expr.operator + _.optSpace;
        ExprGen[$right.type]($right, Preset.e18(allowIn));

        if (parenthesize)
            _.js += ')';
    },

    ArrowExpression: function generateArrowExpression($expr, settings)
    {
        var parenthesize = Precedence.ArrowFunction < settings.precedence;

        if (parenthesize)
            _.js += '(';

        generateFunction($expr);

        if (parenthesize)
            _.js += ')';
    },

    ConditionalExpression: function generateConditionalExpression($expr, settings)
    {
        var $test = $expr.test,
            $conseq = $expr.consequent,
            $alt = $expr.alternate,
            parenthesize = Precedence.Conditional < settings.precedence,
            allowIn = settings.allowIn || parenthesize,
            testGenSettings = Preset.e2(allowIn),
            branchGenSettings = Preset.e1(allowIn);

        if (parenthesize)
            _.js += '(';

        ExprGen[$test.type]($test, testGenSettings);
        _.js += _.optSpace + '?' + _.optSpace;
        ExprGen[$conseq.type]($conseq, branchGenSettings);
        _.js += _.optSpace + ':' + _.optSpace;
        ExprGen[$alt.type]($alt, branchGenSettings);

        if (parenthesize)
            _.js += ')';
    },

    BinaryExpression: function generateBinaryExpression($expr, settings)
    {
        var op = $expr.operator,
            precedence = BinaryPrecedence[$expr.operator],
            parenthesize = precedence < settings.precedence,
            allowIn = settings.allowIn || parenthesize,
            operandGenSettings = Preset.e16(precedence, allowIn),
            exprJs = exprToJs($expr.left, operandGenSettings);

        parenthesize |= op === 'in' && !allowIn;

        if (parenthesize)
            _.js += '(';

        if (exprJs.charCodeAt(exprJs.length - 1) === 0x2F && isIdentifierCh(op.charCodeAt(0)))
        {
            // 0x2F = '/'
            exprJs = exprJs + _.space + op;
        }
        else if (op === ',')
            exprJs += ',';
        else
            exprJs = join(exprJs, op);

        operandGenSettings.precedence++;

        var rightJs = exprToJs($expr.right, operandGenSettings);

        // NOTE: If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
        if (op === '/' && rightJs.charAt(0) === '/' || op.slice(-1) === '<' && rightJs.slice(0, 3) === '!--')
            exprJs += _.space + rightJs;
        else
            exprJs = join(exprJs, rightJs);

        _.js += exprJs;

        if (parenthesize)
            _.js += ')';
    },

    CallExpression: function generateCallExpression($expr, settings)
    {
        var $callee = $expr.callee,
            $args = $expr.arguments,
            argCount = $args.length,
            lastArgIdx = argCount - 1,
            parenthesize = !settings.allowCall || Precedence.Call < settings.precedence;

        if (parenthesize)
            _.js += '(';

        ExprGen[$callee.type]($callee, Preset.e3);
        _.js += '(';

        for (var i = 0; i < argCount; ++i)
        {
            var $arg = $args[i];

            ExprGen[$arg.type]($arg, Preset.e4);

            if (i !== lastArgIdx)
                _.js += ',' + _.optSpace;
        }

        _.js += ')';

        if (parenthesize)
            _.js += ')';
    },

    NewExpression: function generateNewExpression($expr, settings)
    {
        var $args = $expr['arguments'],
            parenthesize = Precedence.New < settings.precedence,
            argCount = $args.length,
            lastArgIdx = argCount - 1,
            withCall = !settings.allowUnparenthesizedNew || parentheses || argCount > 0,
            calleeJs = exprToJs($expr.callee, Preset.e6(!withCall));

        if (parenthesize)
            _.js += '(';

        _.js += join('new', calleeJs);

        if (withCall)
        {
            _.js += '(';

            for (var i = 0; i < argCount; ++i)
            {
                var $arg = $args[i];

                ExprGen[$arg.type]($arg, Preset.e4);

                if (i !== lastArgIdx)
                    _.js += ',' + _.optSpace;
            }

            _.js += ')';
        }

        if (parenthesize)
            _.js += ')';
    },

    NewTargetExpression: function generateNewTargetExpression($expr, settings)
    {
        _.js += 'new.target';
    },

    StaticMemberExpression: function generateStaticMemberExpression($expr, settings)
    {
        var $obj = $expr.object,
            $prop = $expr.property,
            parenthesize = Precedence.Member < settings.precedence,
            isNumObj = $obj.type === Syntax.LiteralNumericExpression;

        if (parenthesize)
            _.js += '(';

        if (isNumObj)
        {
            // NOTE: When the following conditions are all true:
            //   1. No floating point
            //   2. Don't have exponents
            //   3. The last character is a decimal digit
            //   4. Not hexadecimal OR octal number literal
            // then we should add a floating point.

            var numJs = exprToJs($obj, Preset.e11(settings.allowCall)),
                withPoint = LAST_DECIMAL_DIGIT_REGEXP.test(numJs) && !FLOATING_OR_OCTAL_REGEXP.test(numJs);

            _.js += withPoint ? (numJs + '.') : numJs;
        }
        else
            ExprGen[$obj.type]($obj, Preset.e11(settings.allowCall));

        _.js += '.' + $prop;

        if (parenthesize)
            _.js += ')';
    },

    ComputedMemberExpression: function generateComputedMemberExpression($expr, settings)
    {
        var $obj = $expr.object,
            objType = $obj.type,
            $prop = $expr.expression,
            parenthesize = Precedence.Member < settings.precedence ||
                (objType === Syntax.IdentifierExpression && $obj.name === 'let');

        if (parenthesize)
            _.js += '(';

        ExprGen[objType]($obj, Preset.e11(settings.allowCall));
        _.js += '[';
        ExprGen[$prop.type]($prop, Preset.e15(settings.allowCall));
        _.js += ']';

        if (parenthesize)
            _.js += ')';
    },

    UnaryExpression: function generateUnaryExpression($expr, settings)
    {
        var parenthesize = Precedence.Unary < settings.precedence,
            op = $expr.operator,
            argJs = exprToJs($expr.operand, Preset.e7);

        if (parenthesize)
            _.js += '(';

        // NOTE: delete, void, typeof
        // get `typeof []`, not `typeof[]`
        if (_.optSpace === '' || op.length > 2)
            _.js += join(op, argJs);
        else
        {
            _.js += op;

            // NOTE: Prevent inserting spaces between operator and operand if it is unnecessary, e.g., `!cond`
            var leftCp = op.charCodeAt(op.length - 1),
                rightCp = argJs.charCodeAt(0);

            // 0x2B = '+', 0x2D =  '-'
            if (leftCp === rightCp && (leftCp === 0x2B || leftCp === 0x2D) || isIdentifierCh(leftCp) && isIdentifierCh(rightCp))
                _.js += _.space;

            _.js += argJs;
        }

        if (parenthesize)
            _.js += ')';
    },

    YieldExpression: function generateYieldExpression($expr, settings)
    {
        var $arg = $expr.expression,
            js = 'yield',
            parenthesize = Precedence.Yield < settings.precedence;

        if (parenthesize)
            _.js += '(';

        if ($arg)
        {
            var argJs = exprToJs($arg, Preset.e4);
            js = join(js, argJs);
        }

        _.js += js;

        if (parenthesize)
            _.js += ')';
    },

    YieldGeneratorExpression: function generateYieldGeneratorExpression($expr, settings)
    {
        var $arg = $expr.expression,
            js = 'yield*',
            parenthesize = Precedence.Yield < settings.precedence;

        if (parenthesize)
            _.js += '(';

        if ($arg)
        {
            var argJs = exprToJs($arg, Preset.e4);
            js = join(js, argJs);
        }

        _.js += js;

        if (parenthesize)
            _.js += ')';
    },

    UpdateExpression: function generateUpdateExpression($expr, settings)
    {
        var $arg = $expr.operand,
            $op = $expr.operator,
            prefix = $expr.isPrefix,
            precedence = prefix ? Precedence.Unary : Precedence.Postfix,
            parenthesize = precedence < settings.precedence;

        if (parenthesize)
            _.js += '(';

        if (prefix)
        {
            _.js += $op;
            ExprGen[$arg.type]($arg, Preset.e8);
        }
        else
        {
            ExprGen[$arg.type]($arg, Preset.e8);
            _.js += $op;
        }

        if (parenthesize)
            _.js += ')';
    },

    FunctionExpression: function generateFunctionExpression($expr)
    {
        var $name = $expr.name,
            isGenerator = $expr.isGenerator;

        _.js += isGenerator ? 'function*' : 'function';

        if ($name)
        {
            _.js += isGenerator ? _.optSpace : _.space;
            _.js += $name.name;
        }
        else
            _.js += _.optSpace;

        generateFunction($expr);
    },

    ArrayBinding: generateArrayPatternOrExpression,

    ArrayExpression: generateArrayPatternOrExpression,

    ClassExpression: function generateClassExpression($expr)
    {
        var $id = $expr.name,
            $super = $expr.super,
            $elements = $expr.elements,
            elementCount = $elements.length,
            exprJs = 'class';

        if ($id)
        {
            var idJs = exprToJs($id, Preset.e9);
            exprJs = join(exprJs, idJs);
        }

        if ($super)
        {
            var superJs = exprToJs($super, Preset.e4);
            superJs = join('extends', superJs);
            exprJs = join(exprJs, superJs);
        }

        _.js += exprJs + _.optSpace;

        if (elementCount)
        {
            var prevIndent = shiftIndent();

            _.js += '{';

            for (var i = 0; i < elementCount; ++i)
            {
                var $element = $elements[i],
                    elementType = $element.type || Syntax.ClassElement;

                _.js += _.newline + _.indent;
                ExprGen[elementType]($element, Preset.e5);
            }

            _.indent = prevIndent;
            _.js += _.newline + _.indent + '}';
        }
        else
            _.js += '{}';
    },

    ClassElement: function generateClassElement($expr)
    {
        var $method = $expr.method;
        _.js += $expr.isStatic ? 'static' + _.optSpace : '';
        ExprGen[$method.type]($method);
    },

    Super: function generateSuper($expr)
    {
        _.js += 'super';
    },

    ComputedPropertyName: function generateComputedPropertyName($expr)
    {
        _.js += '[' + exprToJs($expr.expression, Preset.e5) + ']';
    },

    StaticPropertyName: function generateStaticPropertyName($expr)
    {
        var value = $expr.value;

        if (!isIdentifierString(value))
            value = escapeString(value);

        _.js += value;
    },

    Method: function generateMethod($expr)
    {
        var keyJs = exprToJs($expr.name, Preset.e5);

        _.js += $expr.isGenerator ? ('*' + keyJs) : keyJs;
        generateFunction($expr);
    },

    Getter: function generateGetter($expr)
    {
        var keyJs = exprToJs($expr.name, Preset.e5);

        _.js += 'get' + _.space + keyJs + '()';

        generateFunctionBody($expr);
    },

    Setter: function generateSetter($expr)
    {
        var $param = $expr.param,
            keyJs = exprToJs($expr.name, Preset.e5);

        _.js += 'set' + _.space + keyJs + '(';

        if ($param.type === Syntax.BindingIdentifier)
            _.js += $param.name;
        else
            ExprGen[$param.type]($param, Preset.e4);

        _.js += ')';

        generateFunctionBody($expr);
    },

    DataProperty: function generateDataProperty($expr)
    {
        var $val = $expr.expression,
            keyJs = exprToJs($expr.name, Preset.e5);

        _.js += keyJs + ':' + _.optSpace;
        ExprGen[$val.type]($val, Preset.e4);
    },

    ShorthandProperty: function generateShorthandProperty($expr)
    {
        _.js += $expr.name;
    },

    ObjectExpression: function generateObjectExpression($expr)
    {
        var $props = $expr.properties,
            propCount = $props.length;

        if (propCount)
        {
            var lastPropIdx = propCount - 1,
                prevIndent  = shiftIndent();

            _.js += '{';

            for (var i = 0; i < propCount; ++i)
            {
                var $prop = $props[i],
                    propType = $prop.type || Syntax.DataProperty;

                _.js += _.newline + _.indent;
                ExprGen[propType]($prop, Preset.e5);

                if (i !== lastPropIdx)
                    _.js += ',';
            }

            _.indent = prevIndent;
            _.js += _.newline + _.indent + '}';
        }
        else
            _.js += '{}';
    },

    ObjectBinding: function generateObjectBinding($expr)
    {
        var $props = $expr.properties,
            propCount = $props.length;

        if (propCount)
        {
            var lastPropIdx = propCount - 1,
                multiline = false;

            if (propCount === 1)
                multiline = $props[0].binding.type !== Syntax.BindingIdentifier;
            else
            {
                for (var i = 0; i < propCount; ++i)
                {
                    // TODO:
                    if (!$props[i].shorthand)
                    {
                        multiline = true;
                        break;
                    }
                }
            }

            _.js += multiline ? ('{' + _.newline) : '{';

            var prevIndent = shiftIndent(),
                propSuffix = ',' + (multiline ? _.newline : _.optSpace);

            for (var i = 0; i < propCount; ++i)
            {
                var $prop = $props[i];

                if (multiline)
                    _.js += _.indent;

                ExprGen[$prop.type]($prop, Preset.e5);

                if (i !== lastPropIdx)
                    _.js += propSuffix;
            }

            _.indent = prevIndent;
            _.js += multiline ? (_.newline + _.indent + '}') : '}';
        }
        else
            _.js += '{}';
    },

    ThisExpression: function generateThisExpression()
    {
        _.js += 'this';
    },

    IdentifierExpression: function generateIdentifierExpression($expr)
    {
        _.js += $expr.name;
    },

    BindingIdentifier: function generateBindingIdentifier($expr)
    {
        _.js += $expr.name;
    },

    BindingPropertyIdentifier: function generateBindingPropertyIdentifier($expr)
    {
        var $init = $expr.init,
            keyJs = exprToJs($expr.binding, Preset.e5);

        if ($init)
        {
            _.js += keyJs + '=' + _.optSpace;
            ExprGen[$init.type]($init, Preset.e4);
        }
        else
            _.js += keyJs;
    },

    BindingPropertyProperty: function generateBindingPropertyProperty($expr)
    {
        var $binding = $expr.binding,
            keyJs = exprToJs($expr.name, Preset.e5);

        _.js += keyJs + ':' + _.optSpace;
        ExprGen[$binding.type]($binding, Preset.e4);
    },

    BindingWithDefault: function generateBindingWithDefault($expr)
    {
        var $left = $expr.binding,
            $right = $expr.init;

        ExprGen[$left.type]($left, Preset.e17);
        _.js += _.optSpace + '=' + _.optSpace;
        ExprGen[$right.type]($right, Preset.e18);
    },

    ExportSpecifier: function generateExportSpecifier($expr)
    {
        var $name = $expr.name;

        if ($name)
            _.js += $name + _.space + 'as' + _.space + $expr.exportedName;
        else
            _.js += $expr.exportedName;
    },

    ImportSpecifier: function generateImportSpecifier($expr)
    {
        var $name = $expr.name;

        if ($name)
            _.js += $name + _.space + 'as' + _.space + $expr.binding.name;
        else
            _.js += $expr.binding.name;
    },

    LiteralBooleanExpression: function generateBooleanLiteral($expr)
    {
        _.js += $expr.value ? 'true' : 'false';
    },

    LiteralNumericExpression: function generateNumericLiteral($expr)
    {
        var value = $expr.value,
            result,
            point,
            temp,
            exponent,
            pos;

        if (value === 1 / 0)
        {
            _.js += json ? 'null' : renumber ? '2e308' : '2e+308';
            return;
        }

        result = '' + value;
        if (!renumber || result.length < 3)
        {
            _.js += result;
            return;
        }

        point = result.indexOf('.');

        if (!json && result.charCodeAt(0) === 0x30 /* '0' */ && point === 1)
        {
            point  = 0;
            result = result.slice(1);
        }

        temp = result;
        result = result.replace('e+', 'e');
        exponent = 0;

        if ((pos = temp.indexOf('e')) > 0)
        {
            exponent = +temp.slice(pos + 1);
            temp = temp.slice(0, pos);
        }
        
        if (point >= 0)
        {
            exponent -= temp.length - point - 1;
            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
        }
        pos = 0;

        while (temp.charCodeAt(temp.length + pos - 1) === 0x30 /* '0' */)
            --pos;

        if (pos !== 0)
        {
            exponent -= pos;
            temp = temp.slice(0, pos);
        }
        
        if (exponent !== 0)
            temp += 'e' + exponent;

        if ((temp.length < result.length ||
            (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
            +temp === value)
        {
            result = temp;
        }

        _.js += result;
    },

    LiteralStringExpression: function generateStringLiteral($expr)
    {
        _.js += escapeString($expr.value);
    },

    LiteralRegExpExpression: function generateRegExpLiteral($expr)
    {
        _.js += '/' + $expr.pattern + '/' + $expr.flags;
    },

    LiteralInfinityExpression: function generateInfinityLiteral($expr)
    {
        //_.js += 'Infinity';
        _.js += '2e308';
    },

    LiteralNullExpression: function generateNullLiteral($expr)
    {
        _.js += 'null';
    },

    SpreadElement: function generateSpreadElement($expr)
    {
        var $arg = $expr.expression;

        _.js += '...';
        ExprGen[$arg.type]($arg, Preset.e4);
    },

    TemplateExpression: function generateTemplateExpression($expr, settings)
    {
        var $tag = $expr.tag,
            $elements = $expr.elements,
            elementCount = $elements.length,
            parenthesize = Precedence.TaggedTemplate < settings.precedence;

        if (parenthesize)
            _.js += '(';

        if ($tag)
            ExprGen[$tag.type]($tag, Preset.e11(settings.allowCall));

        _.js += '`';

        for (var i = 0; i < elementCount; ++i)
        {
            var $element = $elements[i];

            if ($element.type === Syntax.TemplateElement)
                _.js += $element.rawValue;
            else
            {
                _.js += '${';
                ExprGen[$element.type]($element, Preset.e5);
                _.js += '}';                
            }
        }

        _.js += '`';

        if (parenthesize)
            _.js += ')';
    }
};


/////////////////////////////////////////////////////////////////////
// Statements

// Regular expressions
var EXPR_STMT_UNALLOWED_EXPR_REGEXP = /^{|^class(?:\s|{)|^function(?:\s|\*|\()/;


// Common statement generators

function generateForStatementIterator($op, $stmt, settings)
{
    var $body = $stmt.body,
        $left = $stmt.left,
        bodySemicolonOptional = !semicolons && settings.semicolonOptional,
        prevIndent1 = shiftIndent(),
        stmtJs = 'for' + _.optSpace + '(';

    if ($left.type === Syntax.VariableDeclaration)
    {
        var prevIndent2 = shiftIndent();

        stmtJs += $left.kind + _.space + stmtToJs($left.declarators[0], Preset.s6);
        _.indent = prevIndent2;
    }
    else
        stmtJs += exprToJs($left, Preset.e10);

    stmtJs = join(stmtJs, $op);

    var rightJs = exprToJs($stmt.right, Preset.e5);
    stmtJs = join(stmtJs, rightJs) + ')';

    _.indent = prevIndent1;

    _.js += stmtJs + adoptionPrefix($body);
    StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
}


// Statement generator dictionary

var StmtRawGen = {
    Block: function generateBlock($stmt, settings)
    {
        var $body = $stmt.statements,
            len = $body.length,
            lastIdx = len - 1,
            prevIndent = shiftIndent();

        _.js += '{' + _.newline;

        // NOTE: extremely stupid solution for the T170848. We can't preserver all comments, because it's
        // ultra slow, but we make a trick: if we have a function body without content then we add
        // empty block comment into it. A lot of popular sites uses this ads library which fails if we don't
        // do that.
        if (settings.functionBody && !$body.length)
            _.js += '/**/';

        for (var i = 0; i < len; ++i)
        {
            var $item = $body[i];

            _.js += _.indent;
            StmtGen[$item.type]($item, Preset.s1(settings.functionBody, i === lastIdx));
            _.js += _.newline;
        }

        _.indent = prevIndent;
        _.js += _.indent + '}';
    },

    BlockStatement: function generateBlockStatement($stmt, settings)
    {
        var $block = $stmt.block;
        StmtGen[$block.type]($block, settings);
    },

    FunctionBody: function generateFunctionBody($stmt, settings)
    {
        var $body = $stmt.statements,
            $directives = $stmt.directives,
            len = $body.length,
            lenDirectives = ($directives && $directives.length) || 0,
            lastIdx = len - 1,
            prevIndent = shiftIndent();

        _.js += '{' + _.newline;

        for (var i = 0; i < lenDirectives; ++i)
        {
            var $directive = $directives[i];
            StmtGen[$directive.type]($directive);
        }

        // NOTE: extremely stupid solution for the T170848. We can't preserve all comments, because it's
        // ultra slow, but we make a trick: if we have a function body without content then we add
        // empty block comment into it. A lot of popular sites use this ads library which fails if we don't
        // do that.
        if (settings.functionBody && !$body.length)
            _.js += '/**/';

        for (var i = 0; i < len; ++i)
        {
            var $item = $body[i];

            _.js += _.indent;
            StmtGen[$item.type]($item, Preset.s1(settings.functionBody, i === lastIdx));
            _.js += _.newline;
        }

        _.indent = prevIndent;
        _.js += _.indent + '}';
    },

    BreakStatement: function generateBreakStatement($stmt, settings)
    {
        if ($stmt.label)
            _.js += 'break ' + $stmt.label;
        else
            _.js += 'break';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ContinueStatement: function generateContinueStatement($stmt, settings)
    {
        if ($stmt.label)
            _.js += 'continue ' + $stmt.label;
        else
            _.js += 'continue';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ClassDeclaration: function generateClassDeclaration($stmt)
    {
        var $elements = $stmt.elements,
            elementCount = $elements.length,
            lastElementIdx = elementCount - 1,
            $super = $stmt.super,
            prevIndent = shiftIndent(),
            name = $stmt.name.name,
            js = 'class' + (name !== '*default*' ? (' ' + name) : '');

        if ($super)
        {
            var superJs = exprToJs($super, Preset.e4);
            js += _.space + join('extends', superJs);
        }

        _.js += js + _.optSpace;

        if (!elementCount)
            _.js += '{}';
        else
        {
            _.js += '{' + _.newline;

            for (var i = 0; i < elementCount; ++i)
            {
                var $element = $elements[i];

                _.js += _.indent;
                ExprGen[$element.type]($element, Preset.s2);

                if (i !== lastElementIdx)
                    _.js += _.newline;
            }

            _.indent = prevIndent;
            _.js += _.newline + _.indent + '}';
        }
    },

    Directive: function generateDirective($stmt, settings)
    {
        _.js += escapeDirective($stmt.rawValue);
        if (semicolons || !settings.semicolonOptional)
            _.js += ';';        
    },

    DoWhileStatement: function generateDoWhileStatement($stmt, settings)
    {
        var $body = $stmt.body,
            $test = $stmt.test,
            bodyJs = adoptionPrefix($body) + stmtToJs($body, Preset.s7) + adoptionSuffix($body);

        // NOTE: Because `do 42 while (cond)` is Syntax Error. We need semicolon.
        var stmtJs = join('do', bodyJs);

        _.js += join(stmtJs, 'while' + _.optSpace + '(');
        ExprGen[$test.type]($test, Preset.e5);
        _.js += ')';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    CatchClause: function generateCatchClause($stmt)
    {
        var $param = $stmt.binding,
            $body = $stmt.body,
            prevIndent = shiftIndent();

        _.js += 'catch' + _.optSpace + '(';
        ExprGen[$param.type]($param, Preset.e5);

        _.indent = prevIndent;
        _.js += ')' + adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s7);
    },

    DebuggerStatement: function generateDebuggerStatement($stmt, settings)
    {
        _.js += 'debugger';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    EmptyStatement: function generateEmptyStatement()
    {
        _.js += ';';
    },

    Export: function generateExport($stmt, settings)
    {
        _.js += join('export', stmtToJs($stmt.declaration, Preset.s4(!semicolons && settings.semicolonOptional)));
    },

    ExportAllFrom: function generateExportAllFrom($stmt, settings)
    {
        _.js += 'export * from ' + escapeString($stmt.moduleSpecifier);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ExportDefault: function generateExportDefault($stmt, settings)
    {
        var $body = $stmt.body;

        if (ExprGen[$body.type])
            _.js += join('export default', exprToJs($body, Preset.e4));
        else
            _.js += join('export default', stmtToJs($body, Preset.s4));

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ExportFrom: function generateExportFrom($stmt, settings)
    {
        var $exports = $stmt.namedExports,
            $moduleSpec = $stmt.moduleSpecifier,
            exportCount = $exports.length,
            stmtJs = 'export';

        if (exportCount)
        {
            var prevIndent = shiftIndent(),
                lastExportIdx = exportCount - 1;

            stmtJs += _.optSpace + '{';

            for (var i = 0; i < exportCount; ++i)
            {
                stmtJs += _.newline + _.indent;
                stmtJs += exprToJs($exports[i], Preset.e5);

                if (i !== lastExportIdx)
                    stmtJs += ',';
            }

            _.indent = prevIndent;
            stmtJs += _.newline + _.indent + '}';
        }
        else
            stmtJs += _.optSpace + '{}';

        if ($moduleSpec)
            _.js += join(stmtJs, 'from' + _.optSpace + escapeString($moduleSpec));
        else
            _.js += stmtJs;

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ExpressionStatement: function generateExpressionStatement($stmt, settings)
    {
        var exprJs = exprToJs($stmt.expression, Preset.e5),
            type = $stmt.expression.type,
            parenthesize = EXPR_STMT_UNALLOWED_EXPR_REGEXP.test(exprJs) ||
                (directive && settings.directiveContext &&
                (type === Syntax.LiteralBooleanExpression || type === Syntax.LiteralNullExpression || type === Syntax.LiteralNumericExpression || type === Syntax.LiteralRegExpExpression || type === Syntax.LiteralStringExpression)
                && typeof $stmt.expression.value === 'string');

        // NOTE: '{', 'function', 'class' are not allowed in expression statement.
        // Therefore, they should be parenthesized.
        if (parenthesize)
            _.js += '(' + exprJs + ')';
        else
            _.js += exprJs;

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    Import: function generateImport($stmt, settings)
    {
        var $defaultBinding = $stmt.defaultBinding,
            $namedImports = $stmt.namedImports,
            namedImportCount = $namedImports.length,
            stmtJs = 'import';

        if ($defaultBinding)
            stmtJs = join(stmtJs, $defaultBinding.name);

        if (namedImportCount)
        {
            var lastSpecIdx = namedImportCount - 1;

            if ($defaultBinding)
                stmtJs += ',';

            stmtJs += _.optSpace + '{';

            // import { ... } from "...";
            if (namedImportCount === 1)
                stmtJs += _.optSpace + exprToJs($namedImports[0], Preset.e5) + _.optSpace;
            else
            {
                var prevIndent = shiftIndent();

                // import {
                //    ...,
                //    ...,
                // } from "...";
                for (var i = 0; i < namedImportCount; ++i)
                {
                    stmtJs += _.newline + _.indent + exprToJs($namedImports[i], Preset.e5);

                    if (i !== lastSpecIdx)
                        stmtJs += ',';
                }

                _.indent = prevIndent;
                stmtJs += _.newline + _.indent;
            }

            stmtJs += '}' + _.optSpace;
        }

        if ($defaultBinding || namedImportCount)
            stmtJs = join(stmtJs, 'from');

        _.js += stmtJs + _.optSpace + escapeString($stmt.moduleSpecifier);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    ImportNamespace: function generateImportNamespace($stmt, settings)
    {
        var $defaultBinding = $stmt.defaultBinding,
            $namespaceBinding = $stmt.namespaceBinding,
            stmtJs = 'import';

        if ($defaultBinding)
            stmtJs = join(stmtJs, $defaultBinding.name + ',' + _.optSpace);

        stmtJs += '*' + _.optSpace + 'as';
        stmtJs = join(stmtJs, $namespaceBinding.name);
        stmtJs = join(stmtJs, 'from');
        _.js += stmtJs + _.optSpace + escapeString($stmt.moduleSpecifier);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    VariableDeclarator: function generateVariableDeclarator($stmt, settings)
    {
        var $binding = $stmt.binding,
            $init = $stmt.init,
            genSettings = Preset.e1(settings.allowIn);

        if ($init)
        {
            ExprGen[$binding.type]($binding, genSettings);
            _.js += _.optSpace + '=' + _.optSpace;
            ExprGen[$init.type]($init, genSettings);
        }
        else
        {
            if ($binding.type === Syntax.BindingIdentifier)
                _.js += $binding.name;
            else
                ExprGen[$binding.type]($binding, genSettings);
        }
    },

    VariableDeclaration: function generateVariableDeclaration($stmt, settings)
    {
        var $decls = $stmt.declarators,
            len = $decls.length,
            prevIndent = len > 1 ? shiftIndent() : _.indent,
            declGenSettings = Preset.s3(settings.allowIn);

        _.js += $stmt.kind;

        for (var i = 0; i < len; ++i)
        {
            var $decl = $decls[i];

            _.js += i === 0 ? _.space : (',' + _.optSpace);
            StmtGen[$decl.type]($decl, declGenSettings);
        }

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';

        _.indent = prevIndent;
    },

    VariableDeclarationStatement: function generateVariableDeclarationStatement($stmt, settings)
    {
        var $decl = $stmt.declaration;
        StmtGen[$decl.type]($decl, settings);
    },

    ThrowStatement: function generateThrowStatement($stmt, settings)
    {
        var argJs = exprToJs($stmt.expression, Preset.e5);

        _.js += join('throw', argJs);

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    TryCatchStatement: function generateTryCatchStatement($stmt)
    {
        var $block = $stmt.body,
            stmtJs = 'try' + adoptionPrefix($block) + stmtToJs($block, Preset.s7) + adoptionSuffix($block);

        _.js += join(stmtJs, stmtToJs($stmt.catchClause, Preset.s7));
    },

    TryFinallyStatement: function generateTryFinallyStatement($stmt)
    {
        var $block = $stmt.body,
            $catchClause = $stmt.catchClause,
            $finalizer = $stmt.finalizer,
            stmtJs = 'try' + adoptionPrefix($block) + stmtToJs($block, Preset.s7) + adoptionSuffix($block);

        if ($catchClause)
        {
            stmtJs = join(stmtJs, stmtToJs($catchClause, Preset.s7));
            stmtJs += adoptionSuffix($catchClause.body);
        }

        stmtJs = join(stmtJs, 'finally' + adoptionPrefix($finalizer));
        stmtJs += stmtToJs($finalizer, Preset.s7);

        _.js += stmtJs;
    },

    SwitchStatement: function generateSwitchStatement($stmt)
    {
        var $discr = $stmt.discriminant,
            $cases = $stmt.cases,
            prevIndent = shiftIndent();

        _.js += 'switch' + _.optSpace + '(';
        ExprGen[$discr.type]($discr, Preset.e5);
        _.js += ')' + _.optSpace + '{' + _.newline;
        _.indent = prevIndent;

        if ($cases)
        {
            var caseCount = $cases.length,
                lastCaseIdx = caseCount - 1;

            for (var i = 0; i < caseCount; ++i) 
            {
                var $case = $cases[i];

                _.js += _.indent;
                StmtGen[$case.type]($case, Preset.s4(i === lastCaseIdx));
                _.js += _.newline;
            }
        }

        _.js += _.indent + '}';
    },

    SwitchStatementWithDefault: function generateSwitchStatementWithDefault($stmt)
    {
        var $discr = $stmt.discriminant,
            $preDefaultCases = $stmt.preDefaultCases,
            $defaultCase = $stmt.defaultCase,
            $postDefaultCases = $stmt.postDefaultCases,
            prevIndent = shiftIndent();

        _.js += 'switch' + _.optSpace + '(';
        ExprGen[$discr.type]($discr, Preset.e5);
        _.js += ')' + _.optSpace + '{' + _.newline;
        _.indent = prevIndent;

        // pre-default cases
        if ($preDefaultCases)
        {
            var caseCount = $preDefaultCases.length;

            for (var i = 0; i < caseCount; ++i) 
            {
                var $case = $preDefaultCases[i];

                _.js += _.indent;
                StmtGen[$case.type]($case, Preset.s4);
                _.js += _.newline;
            }
        }

        // default case
        _.js += _.indent;
        StmtGen[$defaultCase.type]($defaultCase, Preset.s4(!$postDefaultCases));
        _.js += _.newline;

        // post-default cases
        if ($postDefaultCases)
        {
            var caseCount = $postDefaultCases.length,
                lastCaseIdx = caseCount - 1;

            for (var i = 0; i < caseCount; ++i) 
            {
                var $case = $postDefaultCases[i];

                _.js += _.indent;
                StmtGen[$case.type]($case, Preset.s4(i === lastCaseIdx));
                _.js += _.newline;
            }
        }

        _.js += _.indent + '}';
    },

    SwitchCase: function generateSwitchCase($stmt, settings)
    {
        var $conseqs = $stmt.consequent,
            $firstConseq = $conseqs[0],
            $test = $stmt.test,
            i = 0,
            conseqSemicolonOptional = !semicolons && settings.semicolonOptional,
            conseqCount = $conseqs.length,
            lastConseqIdx = conseqCount - 1,
            prevIndent = shiftIndent();

        var testJs = exprToJs($test, Preset.e5);
        _.js += join('case', testJs) + ':';

        if (conseqCount && $firstConseq.type === Syntax.BlockStatement)
        {
            i++;
            _.js += adoptionPrefix($firstConseq);
            StmtGen[$firstConseq.type]($firstConseq, Preset.s7);
        }

        for (; i < conseqCount; ++i)
        {
            var $conseq = $conseqs[i],
                semicolonOptional = i === lastConseqIdx && conseqSemicolonOptional;

            _.js += _.newline + _.indent;
            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));
        }

        _.indent = prevIndent;
    },

    SwitchDefault: function generateSwithDefault($stmt, settings)
    {
        var $conseqs = $stmt.consequent,
            $firstConseq = $conseqs[0],
            i = 0,
            conseqSemicolonOptional = !semicolons && settings.semicolonOptional,
            conseqCount = $conseqs.length,
            lastConseqIdx = conseqCount - 1,
            prevIndent = shiftIndent();

        _.js += 'default:';

        if (conseqCount && $firstConseq.type === Syntax.BlockStatement)
        {
            i++;
            _.js += adoptionPrefix($firstConseq);
            StmtGen[$firstConseq.type]($firstConseq, Preset.s7);
        }

        for (; i < conseqCount; ++i)
        {
            var $conseq = $conseqs[i],
                semicolonOptional = i === lastConseqIdx && conseqSemicolonOptional;

            _.js += _.newline + _.indent;
            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));
        }

        _.indent = prevIndent;
    },

    IfStatement: function generateIfStatement($stmt, settings)
    {
        var $conseq = $stmt.consequent,
            $test = $stmt.test,
            prevIndent = shiftIndent(),
            semicolonOptional = !semicolons && settings.semicolonOptional;

        _.js += 'if' + _.optSpace + '(';
        ExprGen[$test.type]($test, Preset.e5);
        _.js += ')';
        _.indent = prevIndent;
        _.js += adoptionPrefix($conseq);

        if ($stmt.alternate)
        {
            var conseq = stmtToJs($conseq, Preset.s7) + adoptionSuffix($conseq),
                alt = stmtToJs($stmt.alternate, Preset.s4(semicolonOptional));

            if ($stmt.alternate.type === Syntax.IfStatement)
                alt = 'else ' + alt;
            else
                alt = join('else', adoptionPrefix($stmt.alternate) + alt);

            _.js += join(conseq, alt);
        }
        else
            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));
    },

    ForStatement: function generateForStatement($stmt, settings)
    {
        var $init = $stmt.init,
            $test = $stmt.test,
            $body = $stmt.body,
            $update = $stmt.update,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent = shiftIndent();

        _.js += 'for' + _.optSpace + '(';

        if ($init)
        {
            if ($init.type === Syntax.VariableDeclaration)
                StmtGen[$init.type]($init, Preset.s6);
            else
            {
                ExprGen[$init.type]($init, Preset.e14);
                _.js += ';';
            }
        }
        else
            _.js += ';';

        if ($test)
        {
            _.js += _.optSpace;
            ExprGen[$test.type]($test, Preset.e5);
        }

        _.js += ';';

        if ($update)
        {
            _.js += _.optSpace;
            ExprGen[$update.type]($update, Preset.e5);
        }

        _.js += ')';
        _.indent = prevIndent;
        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
    },

    ForInStatement: function generateForInStatement($stmt, settings)
    {
        generateForStatementIterator('in', $stmt, settings);
    },

    ForOfStatement: function generateForOfStatement($stmt, settings)
    {
        generateForStatementIterator('of', $stmt, settings);
    },

    LabeledStatement: function generateLabeledStatement($stmt, settings)
    {
        var $body = $stmt.body,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent = _.indent;

        _.js += $stmt.label + ':' + adoptionPrefix($body);

        if ($body.type !== Syntax.BlockStatement)
            prevIndent = shiftIndent();

        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
        _.indent = prevIndent;
    },

    Module: function generateModule($stmt)
    {
        var $items = $stmt.items,
            $directives = $stmt.directives,
            len = $items.length,
            lenDirectives = ($directives && $directives.length) || 0,
            lastIdx = len - 1;

        if (safeConcatenation && (len > 0 || lenDirectives > 0))
            _.js += '\n';

        for (var i = 0; i < lenDirectives; ++i)
        {
            var $directive = $directives[i];
            StmtGen[$directive.type]($directive);
        }

        for (var i = 0; i < len; ++i)
        {
            var $item = $items[i];

            _.js += _.indent;
            StmtGen[$item.type]($item, Preset.s5(!safeConcatenation && i === lastIdx));

            if (i !== lastIdx)
                _.js += _.newline;
        }
    },    

    Script: function generateScript($stmt)
    {
        var $body = $stmt.statements,
            $directives = $stmt.directives,
            len = $body.length,
            lenDirectives = ($directives && $directives.length) || 0,
            lastIdx = len - 1;

        if (safeConcatenation && (len > 0 || lenDirectives > 0))
            _.js += '\n';

        for (var i = 0; i < lenDirectives; ++i)
        {
            var $directive = $directives[i];
            StmtGen[$directive.type]($directive);
        }

        for (var i = 0; i < len; ++i)
        {
            var $item = $body[i];

            _.js += _.indent;
            StmtGen[$item.type]($item, Preset.s5(!safeConcatenation && i === lastIdx));

            if (i !== lastIdx)
                _.js += _.newline;
        }
    },

    FunctionDeclaration: function generateFunctionDeclaration($stmt)
    {
        var name = $stmt.name.name,
            isGenerator = !!$stmt.isGenerator;

        _.js += isGenerator ? ('function*' + _.optSpace) : ('function' + _.space);

        if (name !== '*default*')
            _.js += $stmt.name.name;

        generateFunction($stmt);
    },

    ReturnStatement: function generateReturnStatement($stmt, settings)
    {
        var $arg = $stmt.expression;

        if ($arg)
        {
            var argJs = exprToJs($arg, Preset.e5);
            _.js += join('return', argJs);
        }
        else
            _.js += 'return';

        if (semicolons || !settings.semicolonOptional)
            _.js += ';';
    },

    WhileStatement: function generateWhileStatement($stmt, settings)
    {
        var $body = $stmt.body,
            $test = $stmt.test,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent = shiftIndent();

        _.js += 'while' + _.optSpace + '(';
        ExprGen[$test.type]($test, Preset.e5);
        _.js += ')';
        _.indent = prevIndent;

        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
    },

    WithStatement: function generateWithStatement($stmt, settings)
    {
        var $body = $stmt.body,
            $obj = $stmt.object,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent = shiftIndent();

        _.js += 'with' + _.optSpace + '(';
        ExprGen[$obj.type]($obj, Preset.e5);
        _.js += ')';
        _.indent = prevIndent;
        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));
    }
};


/////////////////////////////////////////////////////////////////////
// CodeGen

function exprToJs($expr, settings)
{
    var savedJs = _.js;
    _.js = '';

    ExprGen[$expr.type]($expr, settings);

    var src = _.js;
    _.js = savedJs;

    return src;
}

function stmtToJs($stmt, settings)
{
    var savedJs = _.js;
    _.js = '';

    StmtGen[$stmt.type]($stmt, settings);

    var src = _.js;
    _.js = savedJs;

    return src;
}

function run($node)
{
    _.js = '';

    if (StmtGen[$node.type])
        StmtGen[$node.type]($node, Preset.s7);
    else
        ExprGen[$node.type]($node, Preset.e19);

    return _.js;
}

function wrapExprGen(gen)
{
    return function ($expr, settings)
    {
        if (extra.verbatim && $expr.hasOwnProperty(extra.verbatim))
            generateVerbatim($expr, settings);
        else
            gen($expr, settings);
    }
}

function createExprGenWithExtras()
{
    var gens = {};

    for (var key in ExprRawGen)
        if (ExprRawGen.hasOwnProperty(key))
            gens[key] = wrapExprGen(ExprRawGen[key]);

    return gens;
}


// Strings
var _ = {
    js: '',
    newline: '\n',
    optSpace: ' ',
    space: ' ',
    indentUnit: '    ',
    indent: ''
};


// Generators
var ExprGen = undefined,
    StmtGen = StmtRawGen;


function generate ($node, options)
{
    var defaultOptions = getDefaultOptions();

    if (options)
    {
        // NOTE: Obsolete options
        //
        //   `options.indent`
        //   `options.base`
        //
        // Instead of them, we can use `option.format.indent`

        if (typeof options.indent === 'string')
            defaultOptions.format.indent.style = options.indent;

        if (typeof options.base === 'number')
            defaultOptions.format.indent.base = options.base;

        options = updateDeeply(defaultOptions, options);
        _.indentUnit = options.format.indent.style;

        if (typeof options.base === 'string')
            _.indent = options.base;
        else
            _.indent = stringRepeat(_.indentUnit, options.format.indent.base);
    }
    else
    {
        options = defaultOptions;
        _.indentUnit = options.format.indent.style;
        _.indent = stringRepeat(_.indentUnit, options.format.indent.base);
    }
    
    json = options.format.json;
    renumber = options.format.renumber;
    hexadecimal = json ? false : options.format.hexadecimal;
    quotes = json ? 'double' : options.format.quotes;
    escapeless = options.format.escapeless;

    _.newline = options.format.newline;
    _.optSpace = options.format.space;

    if (options.format.compact)
        _.newline = _.optSpace = _.indentUnit = _.indent = '';

    _.space = _.optSpace ? _.optSpace : ' ';
    parentheses = options.format.parentheses;
    semicolons = options.format.semicolons;
    safeConcatenation = options.format.safeConcatenation;
    directive = options.directive;
    parse = json ? null : options.parse;
    extra = options;

    if (extra.verbatim)
        ExprGen = createExprGenWithExtras();
    else
        ExprGen = ExprRawGen;

    return run($node);
}

module.exports.generate = generate;

})();
