/*
 Copyright (C) 2016-2018 Matthias Christen <christen@vanamco.com>
 Copyright (C) 2016-2017 Florian Müller <mueller@vanamco.com>
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
    locations,
    comments,
    sourcemap,
    filename,
    sourcemapLineOffset,
    inputSourcemap,
    pureSourcemap;

var Syntax = {
    _MultiStatement:                    '_MultiStatement',
    ArrayBinding:                       'ArrayBinding',
    ArrayAssignmentTarget:              'ArrayAssignmentTarget',
    ArrayExpression:                    'ArrayExpression',
    ArrowExpression:                    'ArrowExpression',
    AssignmentExpression:               'AssignmentExpression',
    AssignmentTargetIdentifier:         'AssignmentTargetIdentifier',
    AssignmentTargetPropertyIdentifier: 'AssignmentTargetPropertyIdentifier',
    AssignmentTargetPropertyProperty:   'AssignmentTargetPropertyProperty',
    AssignmentTargetWithDefault:        'AssignmentTargetWithDefault',
    Block:                              'Block',
    BlockStatement:                     'BlockStatement',
    BinaryExpression:                   'BinaryExpression',
    BindingIdentifier:                  'BindingIdentifier',
    BindingPropertyIdentifier:          'BindingPropertyIdentifier',
    BindingPropertyProperty:            'BindingPropertyProperty',
    BindingWithDefault:                 'BindingWithDefault',
    BreakStatement:                     'BreakStatement',
    CallExpression:                     'CallExpression',
    CatchClause:                        'CatchClause',
    ClassDeclaration:                   'ClassDeclaration',
    ClassExpression:                    'ClassExpression',
    ClassElement:                       'ClassElement',
    CompoundAssignmentExpression:       'CompoundAssignmentExpression',
    ComputedMemberAssignmentTarget:     'ComputedMemberAssignmentTarget',
    ComputedMemberExpression:           'ComputedMemberExpression',
    ComputedPropertyName:               'ComputedPropertyName',
    ConditionalExpression:              'ConditionalExpression',
    ContinueStatement:                  'ContinueStatement',
    DataProperty:                       'DataProperty',
    DebuggerStatement:                  'DebuggerStatement',
    Directive:                          'Directive',
    DoWhileStatement:                   'DoWhileStatement',
    EmptyStatement:                     'EmptyStatement',
    Export:                             'Export',
    ExportAllFrom:                      'ExportAllFrom',
    ExportDefault:                      'ExportDefault',
    ExportFrom:                         'ExportFrom',
    ExportFromSpecifier:                'ExportFromSpecifier',
    ExportLocals:                       'ExportLocals',
    ExportLocalSpecifier:               'ExportLocalSpecifier',
    ExportSpecifier:                    'ExportSpecifier',
    ExpressionStatement:                'ExpressionStatement',
    FormalParameters:                   'FormalParameters',
    ForStatement:                       'ForStatement',
    ForInStatement:                     'ForInStatement',
    ForOfStatement:                     'ForOfStatement',
    FunctionDeclaration:                'FunctionDeclaration',
    FunctionExpression:                 'FunctionExpression',
    FunctionBody:                       'FunctionBody',
    Getter:                             'Getter',
    IdentifierExpression:               'IdentifierExpression',
    IfStatement:                        'IfStatement',
    Import:                             'Import',
    ImportNamespace:                    'ImportNamespace',
    ImportSpecifier:                    'ImportSpecifier',
    LiteralBooleanExpression:           'LiteralBooleanExpression',
    LiteralInfinityExpression:          'LiteralInfinityExpression',
    LiteralNullExpression:              'LiteralNullExpression',
    LiteralNumericExpression:           'LiteralNumericExpression',
    LiteralRegExpExpression:            'LiteralRegExpExpression',
    LiteralStringExpression:            'LiteralStringExpression',
    LabeledStatement:                   'LabeledStatement',
    Method:                             'Method',
    Module:                             'Module',
    NewExpression:                      'NewExpression',
    NewTargetExpression:                'NewTargetExpression',
    ObjectBinding:                      'ObjectBinding',
    ObjectExpression:                   'ObjectExpression',
    ReturnStatement:                    'ReturnStatement',
    Script:                             'Script',
    Setter:                             'Setter',
    ShorthandProperty:                  'ShorthandProperty',
    SpreadElement:                      'SpreadElement',
    StaticMemberAssignmentTarget:       'StaticMemberAssignmentTarget',
    StaticMemberExpression:             'StaticMemberExpression',
    StaticPropertyName:                 'StaticPropertyName',
    Super:                              'Super',
    SwitchStatement:                    'SwitchStatement',
    SwitchStatementWithDefault:         'SwitchStatementWithDefault',
    SwitchCase:                         'SwitchCase',
    SwitchDefault:                      'SwitchDefault',
    TemplateElement:                    'TemplateElement',
    TemplateExpression:                 'TemplateExpression',
    ThisExpression:                     'ThisExpression',
    ThrowStatement:                     'ThrowStatement',
    TryCatchStatement:                  'TryCatchStatement',
    TryFinallyStatement:                'TryFinallyStatement',
    UnaryExpression:                    'UnaryExpression',
    UpdateExpression:                   'UpdateExpression',
    VariableDeclaration:                'VariableDeclaration',
    VariableDeclarationStatement:       'VariableDeclarationStatement',
    VariableDeclarator:                 'VariableDeclarator',
    WhileStatement:                     'WhileStatement',
    WithStatement:                      'WithStatement',
    YieldExpression:                    'YieldExpression',
    YieldGeneratorExpression:           'YieldGeneratorExpression'
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

var ReservedWords = {
    'abstract':     true,
    'await':        true,
    'boolean':      true,
    'byte':         true,
    'break':        true,
    'case':         true,
    'char':         true,
    'class':        true,
    'catch':        true,
    'const':        true,
    'continue':     true,
    'debugger':     true,
    'default':      true,
    'delete':       true,
    'do':           true,
    'double':       true,
    'else':         true,
    'enum':         true,
    'export':       true,
    'extends':      true,
    'false':        true,
    'final':        true,
    'finally':      true,
    'float':        true,
    'for':          true,
    'function':     true,
    'goto':         true,
    'if':           true,
    'implements':   true,
    'import':       true,
    'in':           true,
    'instanceof':   true,
    'int':          true,
    'interface':    true,
    'let':          true,
    'long':         true,
    'native':       true,
    'new':          true,
    'null':         true,
    'package':      true,
    'private':      true,
    'protected':    true,
    'public':       true,
    'return':       true,
    'short':        true,
    'static':       true,
    'super':        true,
    'switch':       true,
    'synchronized': true,
    'this':         true,
    'throw':        true,
    'throws':       true,
    'transient':    true,
    'true':         true,
    'try':          true,
    'typeof':       true,
    'var':          true,
    'void':         true,
    'volatile':     true,
    'while':        true,
    'with':         true,
    'yield':        true
};

function getDefaultOptions()
{
    // default options
    return {
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
        verbatim: null,
        sourcemap: null,
        filename: '',
        locations: null,
        sourcemapLineOffset: 0,
        inputSourcemap: null,
        pureSourcemap: null
    };
}


///////////////////////////////////////////////////////////////////////////////
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

function isUnquotedPropertyName(s)
{
    if (ReservedWords.hasOwnProperty(s))
        return false;

    var len = s.length;
    if (!len)
        return false;

    var cp = s.charCodeAt(0);
    if (48 <= cp && cp <= 57)
        return false;

    for (var i = 0; i < len; ++i)
    {
        var cp = s.charCodeAt(i);
        if (!((48 <= cp && cp <= 57) || (65 <= cp && cp <= 90) || (97 <= cp && cp <= 122) || cp === 36 || cp === 95))
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

            if (key !== 'sourcemap' && key !== 'inputSourcemap' && key !== 'pureSourcemap' && key !== 'locations' && isHashObject(val))
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


function join(l, r, oldLine)
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
        if (oldLine === undefined || oldLine === _.line)
            _.col += _.spaceLength;
        return l + _.space + r;
    }

    if (isWhitespace(lCp) || isWhitespace(rCp))
        return l + r;

    if (oldLine === undefined || oldLine === _.line)
        _.col += _.optSpaceLength;

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
    if ($stmt.type === Syntax.BlockStatement || $stmt.type === Syntax.Block || $stmt.type === Syntax.FunctionBody)
    {
        _.col += _.optSpaceLength;
        return _.optSpace;
    }

    if ($stmt.type === Syntax.EmptyStatement)
        return '';

    _.line += _.newlineNumLines;
    if (_.newlineResetsCol)
        _.col = _.newlineNumCols + _.indent.length + _.indentUnit.length;
    else
        _.col += _.newlineNumCols + _.indent.length + _.indentUnit.length;

    return _.newline + _.indent + _.indentUnit;
}

function adoptionSuffix($stmt)
{
    if ($stmt.type === Syntax.Block || $stmt.type === Syntax.BlockStatement)
    {
        _.col += _.optSpaceLength;
        return _.optSpace;
    }

    _.line += _.newlineNumLines;
    if (_.newlineResetsCol)
        _.col = _.newlineNumCols + _.indent.length;
    else
        _.col += _.newlineNumCols + _.indent.length;

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
    {
        _.js += '(';
        ++_.col;
    }

    _.js += chunks[0];
    _.col += chunks[0].length;

    for (var i = 1; i < chunkCount; ++i)
    {
        var chunk = chunks[i];

        _.js += _.newline + _.indent + chunk;
        _.line += _.newlineNumLines;
        if (_.newlineResetsCol)
            _.col = _.newlineNumCols + _.indent.length + chunk.length;
        else
            _.col += _.newlineNumCols + _.indent.length + chunk.length;
    }

    if (parenthesize)
    {
        _.js += ')';
        ++_.col;
    }
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
        _.col += $params[0].name.length;
    }
    else
    {
        _.js += '(';
        ++_.col;

        for (var i = 0; i < paramCount; ++i)
        {
            var $param = $params[i];

            if ($param.type === Syntax.BindingIdentifier)
            {
                _.js += $param.name;
                _.col += $param.name.length;
            }
            else
                ExprGen[$param.type]($param, Preset.e4);

            if (i !== lastParamIdx)
            {
                _.js += ',' + _.optSpace;
                _.col += 1 + _.optSpaceLength;
            }
        }

        if ($rest)
        {
            if (paramCount)
            {
                _.js += ',' + _.optSpace;
                _.col += 1 + _.optSpaceLength;
            }

            _.js += '...' + $rest.name;
            _.col += 3 + $rest.name.length;
        }

        _.js += ')';
        ++_.col;
    }
}

function generateFunctionBody($node)
{
    var $body = $node.body;

    if ($node.type === Syntax.ArrowExpression)
    {
        _.js += _.optSpace + '=>';
        _.col += _.optSpaceLength + 2;
    }

    if (ExprGen[$body.type])
    {
        _.js += _.optSpace;
        _.col += _.optSpaceLength;

        var oldLine = _.line;
        var exprJs = exprToJs($body, Preset.e4);

        if (exprJs.charAt(0) === '{')
        {
            _.js += '(' + exprJs + ')';

            if (oldLine === _.line)
                _.col += 2;
            else
                ++_.col;
        }
        else
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

function addMapping($stmt, name)
{
    var loc = $stmt.loc || (locations && locations.get($stmt));
    if (!loc)
        return;

    var source = loc.start.source || filename;
    var origLine = loc.start.line;
    var origColumn = loc.start.column;

    if (pureSourcemap && inputSourcemap)
    {
        pureSourcemap.addMapping({
            generated: {
                line: _.line + sourcemapLineOffset + 1,
                column: _.col
            },
            source: source,
            original: { line: origLine, column: origColumn },
            name: name || ''
        }, $stmt);
    }

    if (inputSourcemap)
    {
        var info = inputSourcemap.originalPositionFor({
            line: origLine,
            column: origColumn
        });

        if (info.source === null)
            return;

        source = info.source;
        origLine = info.line;
        origColumn = info.column;
        name = info.name || name;
    }

    sourcemap.addMapping({
        generated: {
            line: _.line + sourcemapLineOffset + 1,
            column: _.col
        },
        source: source,
        original: { line: origLine, column: origColumn },
        name: name || ''
    }, $stmt);
}

function addComment(comment)
{
    // if the comment text contains the substring "*/"
    // (which isn't followed by an opening comment "/*"),
    // replace the "*/" by "* /" to avoid problems
    var commentText = comment.text.replace(/\*\/([^\/][^\*]|\/[^\*]|[^\/]$)/g, '* /$1');

    _.js += '/*' + commentText + '*/';

    if (comment.start.line === comment.end.line)
        _.col += commentText.length + 4;
    else
    {
        _.line += comment.end.line - comment.start.line;
        _.col = comment.end.col;
    }
}

function addCommentBefore($node)
{
    if ($node.commentBefore !== undefined)
        addComment(comments[$node.commentBefore]);
}

function addCommentIn($node)
{
    if ($node.commentIn !== undefined)
        addComment(comments[$node.commentIn]);
}

function addCommentAfter($node)
{
    if ($node.commentAfter !== undefined)
        addComment(comments[$node.commentAfter]);
}


///////////////////////////////////////////////////////////////////////////////
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


///////////////////////////////////////////////////////////////////////////////
// Expressions

// Regular expressions
var FLOATING_OR_OCTAL_REGEXP = /[.eExX]|^0[0-9]+/,
    LAST_DECIMAL_DIGIT_REGEXP = /[0-9]$/;


// Common expression generators

function generateIdentifierExpression($expr)
{
    addCommentBefore($expr);

    _.js += $expr.name;
    _.col += $expr.name.length;

    addCommentAfter($expr);
}

function generateArrayPatternOrExpression($expr)
{
    var $elems = $expr.elements,
        elemCount = $elems.length,
        $rest = $expr.restElement || $expr.rest;

    addCommentBefore($expr);

    if (elemCount)
    {
        var lastElemIdx = elemCount - 1,
            multiline = elemCount > 1 || $rest,
            prevIndent = shiftIndent(),
            itemPrefix = _.newline + _.indent,
            itemPrefixNewlineNumCol = _.newlineNumCols + _.indent.length;

        _.js += '[';
        ++_.col;

        for (var i = 0; i < elemCount; ++i)
        {
            var $elem = $elems[i];

            if (multiline)
            {
                _.js += itemPrefix;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = itemPrefixNewlineNumCol;
                else
                    _.col += itemPrefixNewlineNumCol;
            }

            if ($elem)
                ExprGen[$elem.type]($elem, Preset.e4);

            if (i !== lastElemIdx || !$elem)
            {
                _.js += ',';
                ++_.col;
            }
        }

        if ($rest)
        {
            _.js += ',';
            ++_.col;
            
            if (multiline)
            {
                _.js += itemPrefix;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = itemPrefixNewlineNumCol;
                else
                    _.col += itemPrefixNewlineNumCol;
            }
            else
            {
                _.js += _.optSpace;
                _.col += _.optSpaceLength;
            }

            _.js += '...';
            _.col += 3;
            ExprGen[$rest.type]($rest, Preset.e4);
        }

        _.indent = prevIndent;

        if (multiline)
        {
            _.js += _.newline + _.indent;
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = itemPrefixNewlineNumCol;
            else
                _.col += itemPrefixNewlineNumCol;
        }

        _.js += ']';
        ++_.col;
    }
    else if ($rest)
    {
        _.js += '[ ...';
        _.col += 5;

        ExprGen[$rest.type]($rest, Preset.e4);
        
        _.js += ']';
        ++_.col;
    }
    else
    {
        _.js += '[]';
        _.col += 2;
    }

    addCommentAfter($expr);
}

function generateObjectBinding($expr)
{
    var $props = $expr.properties,
        propCount = $props.length;

    addCommentBefore($expr);

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

        if (multiline)
        {
            _.js += '{' + _.newline;
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols;
            else
                _.col += _.newlineNumCols;
        }
        else
        {
            _.js += '{';
            ++_.col;
        }

        var prevIndent = shiftIndent(),
            propSuffix = ',' + (multiline ? _.newline : _.optSpace),
            propSuffixLineIncrement = multiline ? _.newlineNumLines : 0;

        for (var i = 0; i < propCount; ++i)
        {
            var $prop = $props[i];

            if (multiline)
            {
                _.js += _.indent;
                _.col += _.indent.length;
            }

            ExprGen[$prop.type]($prop, Preset.e5);

            if (i !== lastPropIdx)
            {
                _.js += propSuffix;
                _.line += propSuffixLineIncrement;
                if (!multiline)
                    _.col += _.optSpaceLength;
                else if (_.newlineResetsCol)
                    _.col = 0;
            }
        }

        _.indent = prevIndent;

        if (multiline)
        {
            _.js += _.newline + _.indent + '}';
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols + _.indent.length + 1;
            else
                _.col += _.newlineNumCols + _.indent.length + 1;
        }
        else
        {
            _.js += '}';
            ++_.col;
        }
    }
    else
    {
        _.js += '{}';
        _.col += 2;
    }

    addCommentAfter($expr);
}

function generateBindingPropertyIdentifier($expr)
{
    var $binding = $expr.binding,
        $init = $expr.init;

    addCommentBefore($expr);

    ExprGen[$binding.type]($binding, Preset.e5);

    if ($init)
    {
        _.js += '=' + _.optSpace;
        _.col += 1 + _.optSpaceLength;

        ExprGen[$init.type]($init, Preset.e4);
    }

    addCommentAfter($expr);
}

function generateBindingPropertyProperty($expr)
{
    var $name = $expr.name,
        $binding = $expr.binding;

    addCommentBefore($expr);

    ExprGen[$name.type]($name, Preset.e5);

    _.js += ':' + _.optSpace;
    _.col += 1 + _.optSpaceLength;

    ExprGen[$binding.type]($binding, Preset.e4);

    addCommentAfter($expr);
}

function generateBindingWithDefault($expr)
{
    var $left = $expr.binding,
        $right = $expr.init;

    addCommentBefore($expr);

    ExprGen[$left.type]($left, Preset.e17);

    _.js += _.optSpace + '=' + _.optSpace;
    _.col += _.optSpaceLength + 1 + _.optSpaceLength;

    ExprGen[$right.type]($right, Preset.e18);

    addCommentAfter($expr);
}

function generateStaticMemberExpression($expr, settings)
{
    var $obj = $expr.object,
        $prop = $expr.property,
        parenthesize = Precedence.Member < settings.precedence,
        isNumObj = $obj.type === Syntax.LiteralNumericExpression;

    addCommentBefore($expr);

    if (parenthesize)
    {
        _.js += '(';
        ++_.col;
    }

    if (isNumObj)
    {
        // NOTE: When the following conditions are all true:
        //   1. No floating point
        //   2. Don't have exponents
        //   3. The last character is a decimal digit
        //   4. Not hexadecimal OR octal number literal
        // then we should add a floating point.

        var oldLine = _.line,
            numJs = exprToJs($obj, Preset.e11(settings.allowCall)),
            withPoint = LAST_DECIMAL_DIGIT_REGEXP.test(numJs) && !FLOATING_OR_OCTAL_REGEXP.test(numJs);

        if (withPoint)
        {
            _.js += numJs + '.';
            if (oldLine === _.line)
                ++_.col;
        }
        else
            _.js += numJs;
    }
    else
        ExprGen[$obj.type]($obj, Preset.e11(settings.allowCall));

    _.js += '.' + $prop;
    _.col += 1 + $prop.length;

    if (parenthesize)
    {
        _.js += ')';
        ++_.col;
    }

    addCommentAfter($expr);
}

function generateComputedMemberExpression($expr, settings)
{
    var $obj = $expr.object,
        objType = $obj.type,
        $prop = $expr.expression,
        parenthesize = Precedence.Member < settings.precedence || (objType === Syntax.IdentifierExpression && $obj.name === 'let');

    addCommentBefore($expr);

    if (parenthesize)
    {
        _.js += '(';
        ++_.col;
    }

    ExprGen[objType]($obj, Preset.e11(settings.allowCall));

    _.js += '[';
    ++_.col;

    ExprGen[$prop.type]($prop, Preset.e15(settings.allowCall));

    _.js += ']';
    ++_.col;

    if (parenthesize)
    {
        _.js += ')';
        ++_.col;
    }

    addCommentAfter($expr);
}


// Expression raw generator dictionary

var ExprRawGen = {
    AssignmentExpression: function generateAssignmentExpression($expr, settings)
    {
        var $left = $expr.binding,
            $right = $expr.expression,
            parenthesize = Precedence.Assignment < settings.precedence,
            allowIn = settings.allowIn || parenthesize;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        ExprGen[$left.type]($left, Preset.e17(allowIn));
        _.js += _.optSpace + '=' + _.optSpace;
        _.col += _.optSpaceLength + 1 + _.optSpaceLength;
        ExprGen[$right.type]($right, Preset.e18(allowIn));

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    CompoundAssignmentExpression: function generateCompoundAssignmentExpression($expr, settings)
    {
        var $left = $expr.binding,
            $right = $expr.expression,
            parenthesize = Precedence.Assignment < settings.precedence,
            allowIn = settings.allowIn || parenthesize;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        ExprGen[$left.type]($left, Preset.e17(allowIn));
        _.js += _.optSpace + $expr.operator + _.optSpace;
        _.col += _.optSpaceLength + $expr.operator.length + _.optSpaceLength;
        ExprGen[$right.type]($right, Preset.e18(allowIn));

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    ArrowExpression: function generateArrowExpression($expr, settings)
    {
        var parenthesize = Precedence.ArrowFunction < settings.precedence;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        generateFunction($expr);

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
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

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        ExprGen[$test.type]($test, testGenSettings);

        _.js += _.optSpace + '?' + _.optSpace;
        _.col += _.optSpaceLength + 1 + _.optSpaceLength;

        ExprGen[$conseq.type]($conseq, branchGenSettings);
        _.js += _.optSpace + ':' + _.optSpace;
        _.col += _.optSpaceLength + 1 + _.optSpaceLength;

        ExprGen[$alt.type]($alt, branchGenSettings);

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    BinaryExpression: function generateBinaryExpression($expr, settings)
    {
        var op = $expr.operator,
            precedence = BinaryPrecedence[$expr.operator],
            parenthesize = precedence < settings.precedence,
            allowIn = settings.allowIn || parenthesize,
            operandGenSettings = Preset.e16(precedence, allowIn);

        parenthesize |= op === 'in' && !allowIn;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        ExprGen[$expr.left.type]($expr.left, operandGenSettings);
        if (_.js.charCodeAt(_.js.length - 1) === 0x2F && isIdentifierCh(op.charCodeAt(0)))
        {
            // 0x2F = '/'
            _.js += _.space + op;
            _.col += _.spaceLength + op.length;
        }
        else if (op === ',')
        {
            _.js += ',';
            ++_.col;
        }
        else
        {
            _.js = join(_.js, op);
            _.col += op.length;
        }

        operandGenSettings.precedence++;

        var oldLine = _.line,
            rightJs = exprToJs($expr.right, operandGenSettings);

        // NOTE: If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
        if (op === '/' && rightJs.charAt(0) === '/' || op.slice(-1) === '<' && rightJs.slice(0, 3) === '!--')
        {
            _.js += _.space + rightJs;
            if (oldLine === _.line)
                _.col += _.spaceLength;
        }
        else
            _.js = join(_.js, rightJs, oldLine);

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    CallExpression: function generateCallExpression($expr, settings)
    {
        var $callee = $expr.callee,
            $args = $expr.arguments,
            argCount = $args.length,
            lastArgIdx = argCount - 1,
            parenthesize = !settings.allowCall || Precedence.Call < settings.precedence;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        ExprGen[$callee.type]($callee, Preset.e3);
        _.js += '(';
        ++_.col;

        for (var i = 0; i < argCount; ++i)
        {
            var $arg = $args[i];

            ExprGen[$arg.type]($arg, Preset.e4);

            if (i !== lastArgIdx)
            {
                _.js += ',' + _.optSpace;
                _.col += 1 + _.optSpaceLength;
            }
        }

        _.js += ')';
        ++_.col;

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    NewExpression: function generateNewExpression($expr, settings)
    {
        var oldLine = _.line,
            $args = $expr['arguments'],
            parenthesize = Precedence.New < settings.precedence,
            argCount = $args.length,
            lastArgIdx = argCount - 1,
            withCall = !settings.allowUnparenthesizedNew || parentheses || argCount > 0;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        _.col += 3;
        _.js += join('new', exprToJs($expr.callee, Preset.e6(!withCall)), oldLine);

        if (withCall)
        {
            _.js += '(';
            ++_.col;

            for (var i = 0; i < argCount; ++i)
            {
                var $arg = $args[i];

                ExprGen[$arg.type]($arg, Preset.e4);

                if (i !== lastArgIdx)
                {
                    _.js += ',' + _.optSpace;
                    _.col += 1 + _.optSpaceLength;
                }
            }

            _.js += ')';
            ++_.col;
        }

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    NewTargetExpression: function generateNewTargetExpression($expr, settings)
    {
        addCommentBefore($expr);

        _.js += 'new.target';
        _.col += 10;

        addCommentAfter($expr);
    },

    StaticMemberExpression: generateStaticMemberExpression,

    StaticMemberAssignmentTarget: generateStaticMemberExpression,

    ComputedMemberExpression: generateComputedMemberExpression,

    ComputedMemberAssignmentTarget: generateComputedMemberExpression,

    UnaryExpression: function generateUnaryExpression($expr, settings)
    {
        var oldLine = _.line,
            parenthesize = Precedence.Unary < settings.precedence,
            op = $expr.operator;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        // NOTE: delete, void, typeof
        // get `typeof []`, not `typeof[]`
        if (_.optSpace === '' || op.length > 2)
        {
            _.col += op.length;
            _.js += join(op, exprToJs($expr.operand, Preset.e7), oldLine);
        }
        else
        {
            _.js += op;
            _.col += op.length;

            // NOTE: Prevent inserting spaces between operator and operand if it is unnecessary, e.g., `!cond`
            var argJs = exprToJs($expr.operand, Preset.e7),
                leftCp = op.charCodeAt(op.length - 1),
                rightCp = argJs.charCodeAt(0);

            // 0x2B = '+', 0x2D =  '-'
            if (leftCp === rightCp && (leftCp === 0x2B || leftCp === 0x2D) || isIdentifierCh(leftCp) && isIdentifierCh(rightCp))
            {
                _.js += _.space;
                if (oldLine === _.line)
                    _.col += _.spaceLength;
            }

            _.js += argJs;
        }

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    YieldExpression: function generateYieldExpression($expr, settings)
    {
        var oldLine = _.line,
            $arg = $expr.expression,
            parenthesize = Precedence.Yield < settings.precedence;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        _.col += 5;
        _.js += $arg ? join('yield', exprToJs($arg, Preset.e4), oldLine) : 'yield';

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    YieldGeneratorExpression: function generateYieldGeneratorExpression($expr, settings)
    {
        var oldLine = _.line,
            $arg = $expr.expression,
            parenthesize = Precedence.Yield < settings.precedence;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        _.col += 6;
        _.js += $arg ? join('yield*', exprToJs($arg, Preset.e4), oldLine) : 'yield*';

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    UpdateExpression: function generateUpdateExpression($expr, settings)
    {
        var $arg = $expr.operand,
            $op = $expr.operator,
            prefix = $expr.isPrefix,
            precedence = prefix ? Precedence.Unary : Precedence.Postfix,
            parenthesize = precedence < settings.precedence;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        if (prefix)
        {
            _.js += $op;
            _.col += $op.length;

            ExprGen[$arg.type]($arg, Preset.e8);
        }
        else
        {
            ExprGen[$arg.type]($arg, Preset.e8);

            _.js += $op;
            _.col += $op.length;
        }

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    },

    FunctionExpression: function generateFunctionExpression($expr)
    {
        var $name = $expr.name,
            isGenerator = $expr.isGenerator;

        addCommentBefore($expr);

        _.js += isGenerator ? 'function*' : 'function';

        if ($name)
        {
            _.js += (isGenerator ? _.optSpace : _.space) + $name.name;
            _.col += (isGenerator ? _.optSpaceLength : _.spaceLength) + $name.name.length;
        }
        else
        {
            _.js += _.optSpace;
            _.col += _.optSpaceLength;
        }

        generateFunction($expr);

        addCommentAfter($expr);
    },

    ArrayBinding: generateArrayPatternOrExpression,

    ArrayAssignmentTarget: generateArrayPatternOrExpression,

    ArrayExpression: generateArrayPatternOrExpression,

    ClassExpression: function generateClassExpression($expr)
    {
        addCommentBefore($expr);

        var oldLine = _.line,
            $id = $expr.name,
            $super = $expr.super,
            $elements = $expr.elements,
            elementCount = $elements.length,
            exprJs = 'class';

        _.col += 5;

        if ($id)
        {
            var idJs = exprToJs($id, Preset.e9);
            exprJs = join(exprJs, idJs, oldLine);
        }

        if ($super)
        {
            oldLine = _.line;
            _.col += 7;

            var superJs = exprToJs($super, Preset.e4);
            superJs = join('extends', superJs, oldLine);
            exprJs = join(exprJs, superJs, oldLine);
        }

        _.js += exprJs + _.optSpace;
        _.col += _.optSpaceLength;

        if (elementCount)
        {
            var prevIndent = shiftIndent();

            _.js += '{';
            ++_.col;

            for (var i = 0; i < elementCount; ++i)
            {
                var $element = $elements[i],
                    elementType = $element.type || Syntax.ClassElement;

                _.js += _.newline + _.indent;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols + _.indent.length;
                else
                    _.col += _.newlineNumCols + _.indent.length;

                ExprGen[elementType]($element, Preset.e5);
            }

            _.indent = prevIndent;
            _.js += _.newline + _.indent + '}';
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col += _.newlineNumCols + _.indent.length + 1;
            else
                _.col += _.newlineNumCols + _.indent.length + 1;
        }
        else
        {
            _.js += '{}';
            _.col += 2;
        }

        addCommentAfter($expr);
    },

    ClassElement: function generateClassElement($expr)
    {
        var $method = $expr.method;

        addCommentBefore($expr);

        if ($expr.isStatic)
        {
            _.js += 'static' + _.optSpace;
            _.col += 6 + _.optSpaceLength;
        }

        ExprGen[$method.type]($method);

        addCommentAfter($expr);
    },

    Super: function generateSuper($expr)
    {
        addCommentBefore($expr);

        _.js += 'super';
        _.col += 5;

        addCommentAfter($expr);
    },

    ComputedPropertyName: function generateComputedPropertyName($expr)
    {
        addCommentBefore($expr);

        _.js += '[(';
        _.col += 2;

        ExprGen[$expr.expression.type]($expr.expression, Preset.e5);

        _.js += ')]';
        _.col += 2;

        addCommentAfter($expr);
    },

    StaticPropertyName: function generateStaticPropertyName($expr)
    {
        var value = $expr.value;

        if (!isUnquotedPropertyName(value))
            value = escapeString(value);

        addCommentBefore($expr);

        _.js += value;
        _.col += value.length;

        addCommentAfter($expr);
    },

    Method: function generateMethod($expr)
    {
        addCommentBefore($expr);

        if ($expr.isGenerator)
        {
            _.js += '*';
            ++_.col;
        }

        ExprGen[$expr.name.type]($expr.name, Preset.e5);
        generateFunction($expr);

        addCommentAfter($expr);
    },

    Getter: function generateGetter($expr)
    {
        addCommentBefore($expr);

        _.js += 'get' + _.space;
        _.col += 3 + _.spaceLength;

        ExprGen[$expr.name.type]($expr.name, Preset.e5);

        _.js += '()';
        _.col += 2;

        generateFunctionBody($expr);

        addCommentAfter($expr);
    },

    Setter: function generateSetter($expr)
    {
        var $name = $expr.name,
            $param = $expr.param;

        addCommentBefore($expr);

        _.js += 'set' + _.space;
        _.col += 3 + _.spaceLength;

        ExprGen[$name.type]($name, Preset.e5);

        _.js += '(';
        ++_.col;

        if ($param.type === Syntax.BindingIdentifier)
        {
            _.js += $param.name;
            _.col += $param.name.length;
        }
        else
            ExprGen[$param.type]($param, Preset.e4);

        _.js += ')';
        ++_.col;

        generateFunctionBody($expr);

        addCommentAfter($expr);
    },

    DataProperty: function generateDataProperty($expr)
    {
        var $name = $expr.name,
            $val = $expr.expression;

        addCommentBefore($expr);

        ExprGen[$name.type]($name, Preset.e5);

        _.js += ':' + _.optSpace;
        _.col += 1 + _.optSpaceLength;

        ExprGen[$val.type]($val, Preset.e4);

        addCommentAfter($expr);
    },

    ShorthandProperty: function generateShorthandProperty($expr)
    {
        var $name = $expr.name;

        addCommentBefore($expr);

        if ($name.type !== undefined)
            ExprGen[$name.type]($name, Preset.e5);
        else if (typeof $name === 'string')
        {
            _.js += $name;
            _.col += $name.length;
        }

        addCommentAfter($expr);
    },

    ObjectExpression: function generateObjectExpression($expr)
    {
        var $props = $expr.properties,
            propCount = $props.length;

        addCommentBefore($expr);

        if (propCount)
        {
            var lastPropIdx = propCount - 1,
                prevIndent  = shiftIndent();

            _.js += '{';
            ++_.col;

            for (var i = 0; i < propCount; ++i)
            {
                var $prop = $props[i],
                    propType = $prop.type || Syntax.DataProperty;

                _.js += _.newline + _.indent;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols + _.indent.length;
                else
                    _.col += _.newlineNumCols + _.indent.length;

                ExprGen[propType]($prop, Preset.e5);

                if (i !== lastPropIdx)
                {
                    _.js += ',';
                    ++_.col;
                }
            }

            _.indent = prevIndent;
            _.js += _.newline + _.indent + '}';
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols + _.indent.length + 1;
            else
                _.col += _.newlineNumCols + _.indent.length + 1;
        }
        else
        {
            _.js += '{}';
            _.col += 2;
        }

        addCommentAfter($expr);
    },

    ObjectBinding: generateObjectBinding,

    ObjectAssignmentTarget: generateObjectBinding,

    ThisExpression: function generateThisExpression($expr)
    {
        addCommentBefore($expr);

        _.js += 'this';
        _.col += 4;

        addCommentAfter($expr);
    },

    IdentifierExpression: generateIdentifierExpression,

    BindingIdentifier: generateIdentifierExpression,

    AssignmentTargetIdentifier: generateIdentifierExpression,

    BindingPropertyIdentifier: generateBindingPropertyIdentifier,

    AssignmentTargetPropertyIdentifier: generateBindingPropertyIdentifier,

    BindingPropertyProperty: generateBindingPropertyProperty,

    AssignmentTargetPropertyProperty: generateBindingPropertyProperty,

    BindingWithDefault: generateBindingWithDefault,

    AssignmentTargetWithDefault: generateBindingWithDefault,

    ExportSpecifier: function generateExportSpecifier($expr)
    {
        var $name = $expr.name;

        addCommentBefore($expr);

        if ($name)
        {
            _.js += $name + _.space + 'as' + _.space + $expr.exportedName;
            _.col += $name.length + _.spaceLength + 2 + _.spaceLength + $expr.exportedName.length;
        }
        else
        {
            _.js += $expr.exportedName;
            _.col += $expr.exportedName.length;
        }

        addCommentAfter($expr);
    },

    ExportFromSpecifier: function generateExportFromSpecifier($expr)
    {
        var $name = $expr.name;

        addCommentBefore($expr);

        if ($expr.exportedName)
        {
            _.js += $name + _.space + 'as' + _.space + $expr.exportedName;
            _.col += $name.length + _.spaceLength + 2 + _.spaceLength + $expr.exportedName.length;
        }
        else
        {
            _.js += $name;
            _.col += $name.length;
        }

        addCommentAfter($expr);
    },

    ExportLocalSpecifier: function genereateExportLocalSpecifier($expr)
    {
        var $name = $expr.name;

        addCommentBefore($expr);

        ExprGen[$name.type]($name, Preset.e5);

        if ($expr.exportedName)
        {
            _.js += _.space + 'as' + _.space + $expr.exportedName;
            _.col += _.spaceLength + 2 + _.spaceLength + $expr.exportedName.length;
        }

        addCommentAfter($expr);
    },

    ImportSpecifier: function generateImportSpecifier($expr)
    {
        var $name = $expr.name;

        addCommentBefore($expr);

        if ($name)
        {
            _.js += $name + _.space + 'as' + _.space + $expr.binding.name;
            _.col += $name.length + _.spaceLength + 2 + _.spaceLength + $expr.binding.name.length;
        }
        else
        {
            _.js += $expr.binding.name;
            _.col += $expr.binding.name.length;
        }

        addCommentAfter($expr);
    },

    LiteralBooleanExpression: function generateBooleanLiteral($expr)
    {
        addCommentBefore($expr);

        _.js += $expr.value ? 'true' : 'false';
        _.col += $expr.value ? 4 : 5;

        addCommentAfter($expr);
    },

    LiteralNumericExpression: function generateNumericLiteral($expr)
    {
        var value = $expr.value,
            result,
            point,
            temp,
            exponent,
            pos;

        addCommentBefore($expr);

        if (value === 1 / 0)
        {
            _.js += json ? 'null' : renumber ? '2e308' : '2e+308';
            _.col += json ? 4 : renumber ? 5 : 6;
            return;
        }

        result = '' + value;
        if (!renumber || result.length < 3)
        {
            _.js += result;
            _.col += result.length;
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
        _.col += result.length;

        addCommentAfter($expr);
    },

    LiteralStringExpression: function generateStringLiteral($expr)
    {
        addCommentBefore($expr);

        var s = escapeString($expr.value);
        _.js += s;
        _.col += s.length;

        addCommentAfter($expr);
    },

    LiteralRegExpExpression: function generateRegExpLiteral($expr)
    {
        var flags = $expr.flags;
        if (flags === undefined)
        {
            flags = '';
            if ($expr.global)
                flags += 'g';
            if ($expr.ignoreCase)
                flags += 'i';
            if ($expr.multiLine)
                flags += 'm';
            if ($expr.sticky)
                flags += 'XXX';
            if ($expr.unicode)
                flags += 'u';
        }

        addCommentBefore($expr);

        _.js += '/' + $expr.pattern + '/' + flags;
        _.col += 2 + $expr.pattern.length + flags.length;

        addCommentAfter($expr);
    },

    LiteralInfinityExpression: function generateInfinityLiteral($expr)
    {
        addCommentBefore($expr);

        //_.js += 'Infinity';
        _.js += '2e308';
        _.col += 5;

        addCommentAfter($expr);
    },

    LiteralNullExpression: function generateNullLiteral($expr)
    {
        addCommentBefore($expr);

        _.js += 'null';
        _.col += 4;

        addCommentAfter($expr);
    },

    SpreadElement: function generateSpreadElement($expr)
    {
        var $arg = $expr.expression;

        addCommentBefore($expr);

        _.js += '...';
        _.col += 3;

        ExprGen[$arg.type]($arg, Preset.e4);

        addCommentAfter($expr);
    },

    TemplateExpression: function generateTemplateExpression($expr, settings)
    {
        var $tag = $expr.tag,
            $elements = $expr.elements,
            elementCount = $elements.length,
            parenthesize = Precedence.TaggedTemplate < settings.precedence;

        addCommentBefore($expr);

        if (parenthesize)
        {
            _.js += '(';
            ++_.col;
        }

        if ($tag)
            ExprGen[$tag.type]($tag, Preset.e11(settings.allowCall));

        _.js += '`';
        ++_.col;

        for (var i = 0; i < elementCount; ++i)
        {
            var $element = $elements[i];

            if ($element.type === Syntax.TemplateElement)
            {
                _.js += $element.rawValue;
                _.col += $element.rawValue.length;
            }
            else
            {
                _.js += '${';
                _.col += 2;

                ExprGen[$element.type]($element, Preset.e5);

                _.js += '}';
                ++_.col;
            }
        }

        _.js += '`';
        ++_.col;

        if (parenthesize)
        {
            _.js += ')';
            ++_.col;
        }

        addCommentAfter($expr);
    }
};


///////////////////////////////////////////////////////////////////////////////
// Statements

// Regular expressions
var EXPR_STMT_UNALLOWED_EXPR_REGEXP = /^{|^class(?:\s|{)|^function(?:\s|\*|\()/;


// Common statement generators

function generateForStatementIterator($op, $stmt, settings)
{
    var oldLine = _.line,
        $body = $stmt.body,
        $left = $stmt.left,
        bodySemicolonOptional = !semicolons && settings.semicolonOptional,
        prevIndent1 = shiftIndent(),
        stmtJs = 'for' + _.optSpace + '(';

    if (sourcemap)
        addMapping($stmt);

    addCommentBefore($stmt);

    _.col += 4 + _.optSpaceLength;

    if ($left.type === Syntax.VariableDeclaration)
    {
        var prevIndent2 = shiftIndent();

        _.col += $left.kind.length + _.spaceLength;
        stmtJs += $left.kind + _.space + stmtToJs($left.declarators[0], Preset.s6);
        _.indent = prevIndent2;
    }
    else
        stmtJs += exprToJs($left, Preset.e10);

    _.col += $op.length;
    stmtJs = join(stmtJs, $op, oldLine);

    oldLine = _.line;
    stmtJs = join(stmtJs, exprToJs($stmt.right, Preset.e5), oldLine) + ')';
    ++_.col;

    _.indent = prevIndent1;

    _.js += stmtJs + adoptionPrefix($body);

    StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));

    addCommentAfter($stmt);
}

function generateExportFrom($stmt, settings)
{
    var $exports = $stmt.namedExports,
        $moduleSpec = $stmt.moduleSpecifier,
        exportCount = $exports.length;

    if (sourcemap)
        addMapping($stmt);

    addCommentBefore($stmt);

    _.js += 'export';
    _.col += 6;

    if (exportCount)
    {
        var prevIndent = shiftIndent(),
            lastExportIdx = exportCount - 1;

        _.js += _.optSpace + '{';
        _.col += _.optSpaceLength + 1;

        for (var i = 0; i < exportCount; ++i)
        {
            _.js += _.newline + _.indent;
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols + _.indent.length;
            else
                _.col += _.newlineNumCols + _.indent.length;

            ExprGen[$exports[i].type]($exports[i], Preset.e5);

            if (i !== lastExportIdx)
            {
                _.js += ',';
                ++_.col;
            }
        }

        _.indent = prevIndent;
        
        _.js += _.newline + _.indent + '}';
        _.line += _.newlineNumLines;
        if (_.newlineResetsCol)
            _.col = _.newlineNumCols + _.indent.length + 1;
        else
            _.col += _.newlineNumCols + _.indent.length + 1;
    }
    else
    {
        _.js += _.optSpace + '{}';
        _.col += _.optSpaceLength + 2;
    }

    if ($moduleSpec)
    {
        var moduleSpec = escapeString($moduleSpec);
        _.js += _.space + 'from' + _.optSpace + moduleSpec;
        _.col += _.spaceLength + 4 + _.optSpaceLength + moduleSpec.length;
    }

    if (semicolons || !settings.semicolonOptional)
    {
        _.js += ';';
        ++_.col;
    }

    addCommentAfter($stmt);
}


// Statement generator dictionary

var StmtRawGen = {
    Block: function generateBlock($stmt, settings)
    {
        var $body = $stmt.statements,
            len = $body.length,
            lastIdx = len - 1,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += '{' + _.newline;
        _.line += _.newlineNumLines;
        if (_.newlineResetsCol)
            _.col = _.newlineNumCols;
        else
            _.col += _.newlineNumCols;

        // NOTE: extremely stupid solution for the T170848. We can't preserver all comments, because it's
        // ultra slow, but we make a trick: if we have a function body without content then we add
        // empty block comment into it. A lot of popular sites uses this ads library which fails if we don't
        // do that.
        if (settings.functionBody && !$body.length)
        {
            if ($stmt.commentIn !== undefined)
                addCommentIn($stmt);
            else
            {
                _.js += '/**/';
                _.col += 4;
            }
        }

        for (var i = 0; i < len; ++i)
        {
            var $item = $body[i];

            _.js += _.indent;
            _.col += _.indent.length;

            StmtGen[$item.type]($item, Preset.s1(settings.functionBody, i === lastIdx));

            _.js += _.newline;
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols;
            else
                _.col += _.newlineNumCols;
        }

        _.indent = prevIndent;
        _.js += _.indent + '}';
        _.col += _.indent.length + 1;

        addCommentAfter($stmt);
    },

    BlockStatement: function generateBlockStatement($stmt, settings)
    {
        var $block = $stmt.block;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);
        StmtGen[$block.type]($block, settings);
        addCommentAfter($stmt);
    },

    _MultiStatement: function generateMultiStatement($stmt, settings)
    {
        var $body = $stmt.statements,
            len = $body.length,
            lastIdx = len - 1;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        for (var i = 0; i < len; ++i)
        {
            var $item = $body[i];

            _.js += _.indent;
            _.col += _.indent.length;

            StmtGen[$item.type]($item, Preset.s1(settings.functionBody, i === lastIdx));

            _.js += _.newline;
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols;
            else
                _.col += _.newlineNumCols;
        }

        addCommentAfter($stmt);
    },

    FunctionBody: function generateFunctionBody($stmt, settings)
    {
        var $body = $stmt.statements,
            $directives = $stmt.directives,
            len = $body.length,
            lenDirectives = ($directives && $directives.length) || 0,
            lastIdx = len - 1,
            prevIndent = shiftIndent();

        addCommentBefore($stmt);

        _.js += '{' + _.newline;
        _.line += _.newlineNumLines;
        if (_.newlineResetsCol)
            _.col = _.newlineNumCols;
        else
            _.col += _.newlineNumCols;

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
        {
            if ($stmt.commentIn !== undefined)
                addCommentIn($stmt);
            else
            {
                _.js += '/**/';
                _.col += 4;
            }
        }

        for (var i = 0; i < len; ++i)
        {
            var $item = $body[i];

            _.js += _.indent;
            _.col += _.indent.length;

            StmtGen[$item.type]($item, Preset.s1(settings.functionBody, i === lastIdx));

            _.js += _.newline;
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols;
            else
                _.col += _.newlineNumCols;
        }

        _.indent = prevIndent;
        _.js += _.indent + '}';
        _.col += _.indent.length + 1;

        addCommentAfter($stmt);
    },

    BreakStatement: function generateBreakStatement($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        if ($stmt.label)
        {
            _.js += 'break ' + $stmt.label;
            _.col += 5 + $stmt.label.length;
        }
        else
        {
            _.js += 'break';
            _.col += 5;
        }

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    ContinueStatement: function generateContinueStatement($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        if ($stmt.label)
        {
            _.js += 'continue ' + $stmt.label;
            _.col += 8 + $stmt.label.length;
        }
        else
        {
            _.js += 'continue';
            _.col += 8;
        }

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    ClassDeclaration: function generateClassDeclaration($stmt)
    {
        var oldLine = _.line,
            $elements = $stmt.elements,
            elementCount = $elements.length,
            lastElementIdx = elementCount - 1,
            $super = $stmt.super,
            prevIndent = shiftIndent(),
            name = $stmt.name.name,
            isNotDefault = name !== '*default*',
            js = 'class' + (isNotDefault ? (' ' + name) : '');

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.col += 5;
        if (isNotDefault)
            _.col += name.length + 1;

        if ($super)
        {
            _.col += _.spaceLength + 7;
            var superJs = exprToJs($super, Preset.e4);
            js += _.space + join('extends', superJs, oldLine);
        }

        _.js += js + _.optSpace;
        _.col += _.optSpaceLength;

        if (!elementCount)
        {
            _.js += '{}';
            _.col += 2;
        }
        else
        {
            _.js += '{' + _.newline;
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols;
            else
                _.col += _.newlineNumCols;

            for (var i = 0; i < elementCount; ++i)
            {
                var $element = $elements[i];

                _.js += _.indent;
                _.col += _.indent.length;

                ExprGen[$element.type]($element, Preset.s2);

                if (i !== lastElementIdx)
                {
                    _.js += _.newline;
                    _.line += _.newlineNumLines;
                    if (_.newlineResetsCol)
                        _.col = _.newlineNumCols;
                    else
                        _.col += _.newlineNumCols;
                }
            }

            _.indent = prevIndent;
            _.js += _.newline + _.indent + '}';
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols + _.indent.length + 1;
            else
                _.col += _.newlineNumCols + _.indent.length + 1;
        }

        addCommentAfter($stmt);
    },

    Directive: function generateDirective($stmt, settings)
    {
        var directive = escapeDirective($stmt.rawValue);

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += directive;
        _.col += directive.length;

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    DoWhileStatement: function generateDoWhileStatement($stmt, settings)
    {
        var oldLine = _.line,
            $body = $stmt.body,
            $test = $stmt.test;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        // NOTE: Because `do 42 while (cond)` is Syntax Error. We need semicolon.
        _.col += 2;
        var stmtJs = join('do', adoptionPrefix($body) + stmtToJs($body, Preset.s7) + adoptionSuffix($body), oldLine);
        _.js += join(stmtJs, 'while' + _.optSpace + '(');
        _.col += 6 + _.optSpaceLength;

        ExprGen[$test.type]($test, Preset.e5);

        _.js += ')';
        ++_.col;

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    CatchClause: function generateCatchClause($stmt)
    {
        var $param = $stmt.binding,
            $body = $stmt.body,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'catch' + _.optSpace + '(';
        _.col += 6 + _.optSpaceLength;

        ExprGen[$param.type]($param, Preset.e5);

        _.indent = prevIndent;

        ++_.col;
        _.js += ')' + adoptionPrefix($body);

        StmtGen[$body.type]($body, Preset.s7);

        addCommentAfter($stmt);
    },

    DebuggerStatement: function generateDebuggerStatement($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'debugger';
        _.col += 8;

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    EmptyStatement: function generateEmptyStatement($stmt)
    {
        addCommentBefore($stmt);

        _.js += ';';
        ++_.col;

        addCommentAfter($stmt);
    },

    Export: function generateExport($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'export ';
        _.col += 7;

        StmtGen[$stmt.declaration.type]($stmt.declaration, Preset.s4(!semicolons && settings.semicolonOptional));

        addCommentAfter($stmt);
    },

    ExportAllFrom: function generateExportAllFrom($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        var js = 'export * from ' + escapeString($stmt.moduleSpecifier);
        _.js += js;
        _.col += js.length;

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    ExportDefault: function generateExportDefault($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'export default ';
        _.col += 15;

        var $body = $stmt.body;

        if (ExprGen[$body.type])
            ExprGen[$body.type]($body, Preset.e4);
        else
            StmtGen[$body.type]($body, Preset.s2);

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    ExportFrom: generateExportFrom,

    ExportLocals: generateExportFrom,

    ExpressionStatement: function generateExpressionStatement($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        var oldLine = _.line,
            exprJs = exprToJs($stmt.expression, Preset.e5),
            type = $stmt.expression.type,
            parenthesize = EXPR_STMT_UNALLOWED_EXPR_REGEXP.test(exprJs) ||
                (directive && settings.directiveContext &&
                (type === Syntax.LiteralBooleanExpression || type === Syntax.LiteralNullExpression || type === Syntax.LiteralNumericExpression || type === Syntax.LiteralRegExpExpression || type === Syntax.LiteralStringExpression)
                && typeof $stmt.expression.value === 'string');


        // NOTE: '{', 'function', 'class' are not allowed in expression statement.
        // Therefore, they should be parenthesized.
        if (parenthesize)
        {
            _.js += '(' + exprJs + ')';

            if (oldLine === _.line)
                _.col += 2;
            else
            {
                // expr spans more than one line: increment only for closing bracket
                ++_.col;
            }
        }
        else
            _.js += exprJs;

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    Import: function generateImport($stmt, settings)
    {
        var $defaultBinding = $stmt.defaultBinding,
            $namedImports = $stmt.namedImports,
            namedImportCount = $namedImports.length;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'import';
        _.col += 6;

        if ($defaultBinding)
        {
            _.js += _.space + $defaultBinding.name;
            _.col += _.spaceLength + $defaultBinding.name.length;
        }

        if (namedImportCount)
        {
            var lastSpecIdx = namedImportCount - 1;

            if ($defaultBinding)
            {
                _.js += ',';
                ++_.col;
            }

            _.js += _.optSpace + '{';
            _.col += _.optSpaceLength + 1;

            // import { ... } from "...";
            if (namedImportCount === 1)
            {
                _.js += _.optSpace;
                _.col += _.optSpaceLength;

                ExprGen[$namedImports[0].type]($namedImports[0], Preset.e5);

                _.js += _.optSpace;
                _.col += _.optSpaceLength;
            }
            else
            {
                var prevIndent = shiftIndent();

                // import {
                //    ...,
                //    ...,
                // } from "...";

                for (var i = 0; i < namedImportCount; ++i)
                {
                    _.js += _.newline + _.indent;
                    _.line += _.newlineNumLines;
                    if (_.newlineResetsCol)
                        _.col = _.newlineNumCols + _.indent.length;
                    else
                        _.col += _.newlineNumCols + _.indent.length;

                    ExprGen[$namedImports[i].type]($namedImports[i], Preset.e5);

                    if (i !== lastSpecIdx)
                    {
                        _.js += ',';
                        ++_.col;
                    }
                }

                _.indent = prevIndent;

                _.js += _.newline + _.indent;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols + _.indent.length;
                else
                    _.col += _.newlineNumCols + _.indent.length;
            }

            _.js += '}';
            ++_.col;
        }

        if ($defaultBinding || namedImportCount)
        {
            _.js += _.optSpace + 'from';
            _.col += _.optSpaceLength + 4;
        }

        var moduleSpec = escapeString($stmt.moduleSpecifier);
        _.js += _.space + moduleSpec;
        _.col += _.spaceLength + moduleSpec.length;

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    ImportNamespace: function generateImportNamespace($stmt, settings)
    {
        var $defaultBinding = $stmt.defaultBinding,
            $namespaceBinding = $stmt.namespaceBinding;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'import';
        _.col += 6;

        if ($defaultBinding)
        {
            _.js += _.space + $defaultBinding.name + ',' + _.optSpace;
            _.col += _.spaceLength + $defaultBinding.name.length + 1 + _.optSpaceLength;
        }

        var moduleSpec = escapeString($stmt.moduleSpecifier);
        _.js += '*' + _.optSpace + 'as' + _.space + $namespaceBinding.name + _.space + 'from' + _.space + moduleSpec;
        _.col += 7 + _.optSpaceLength + 3 * _.spaceLength + $namespaceBinding.name.length + moduleSpec.length;

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    VariableDeclarator: function generateVariableDeclarator($stmt, settings)
    {
        var $binding = $stmt.binding,
            $init = $stmt.init,
            genSettings = Preset.e1(settings.allowIn);

        addCommentBefore($stmt);

        if ($init)
        {
            ExprGen[$binding.type]($binding, genSettings);

            _.js += _.optSpace + '=' + _.optSpace;
            _.col += _.optSpaceLength + 1 + _.optSpaceLength;

            ExprGen[$init.type]($init, genSettings);
        }
        else
        {
            if ($binding.type === Syntax.BindingIdentifier)
            {
                _.js += $binding.name;
                _.col += $binding.name.length;
            }
            else
                ExprGen[$binding.type]($binding, genSettings);
        }

        addCommentAfter($stmt);
    },

    VariableDeclaration: function generateVariableDeclaration($stmt, settings)
    {
        var $decls = $stmt.declarators,
            len = $decls.length,
            prevIndent = len > 1 ? shiftIndent() : _.indent,
            declGenSettings = Preset.s3(settings.allowIn);

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += $stmt.kind;
        _.col += $stmt.kind.length;

        for (var i = 0; i < len; ++i)
        {
            var $decl = $decls[i];

            _.js += i === 0 ? _.space : (',' + _.optSpace);
            _.col += i === 0 ? _.spaceLength : (1 + _.optSpaceLength);

            StmtGen[$decl.type]($decl, declGenSettings);
        }

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        _.indent = prevIndent;

        addCommentAfter($stmt);
    },

    VariableDeclarationStatement: function generateVariableDeclarationStatement($stmt, settings)
    {
        var $decl = $stmt.declaration;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);
        StmtGen[$decl.type]($decl, settings);
        addCommentAfter($stmt);
    },

    ThrowStatement: function generateThrowStatement($stmt, settings)
    {
        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        var oldLine = _.line;

        _.col += 5;
        _.js += join('throw', exprToJs($stmt.expression, Preset.e5), oldLine);

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    TryCatchStatement: function generateTryCatchStatement($stmt)
    {
        var oldLine = _.line,
            $block = $stmt.body;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.col += 3;
        _.js += join(
            'try' + adoptionPrefix($block) + stmtToJs($block, Preset.s7) + adoptionSuffix($block),
            stmtToJs($stmt.catchClause, Preset.s7),
            oldLine
        );

        addCommentAfter($stmt);
    },

    TryFinallyStatement: function generateTryFinallyStatement($stmt)
    {
        var oldLine,
            $block = $stmt.body,
            $catchClause = $stmt.catchClause,
            $finalizer = $stmt.finalizer;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.col += 3;
        var stmtJs = 'try' + adoptionPrefix($block) + stmtToJs($block, Preset.s7) + adoptionSuffix($block);

        if ($catchClause)
        {
            oldLine = _.line;
            stmtJs = join(stmtJs, stmtToJs($catchClause, Preset.s7), oldLine);
            stmtJs += adoptionSuffix($catchClause.body);
        }

        oldLine = _.line;
        _.col += 7;
        stmtJs = join(stmtJs, 'finally' + adoptionPrefix($finalizer), oldLine);
        stmtJs += stmtToJs($finalizer, Preset.s7);

        _.js += stmtJs;

        addCommentAfter($stmt);
    },

    SwitchStatement: function generateSwitchStatement($stmt)
    {
        var $discr = $stmt.discriminant,
            $cases = $stmt.cases,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'switch' + _.optSpace + '(';
        _.col += 7 + _.optSpaceLength;

        ExprGen[$discr.type]($discr, Preset.e5);

        _.js += ')' + _.optSpace + '{' + _.newline;
        _.line += _.newlineNumLines;
        if (_.newlineResetsCol)
            _.col = _.newlineNumCols;
        else
            _.col += 2 + _.optSpaceLength + _.newlineNumCols;

        _.indent = prevIndent;

        if ($cases)
        {
            var caseCount = $cases.length,
                lastCaseIdx = caseCount - 1;

            for (var i = 0; i < caseCount; ++i) 
            {
                var $case = $cases[i];

                _.js += _.indent;
                _.col += _.indent.length;

                StmtGen[$case.type]($case, Preset.s4(i === lastCaseIdx));

                _.js += _.newline;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols;
                else
                    _.col += _.newlineNumCols;
            }
        }

        _.js += _.indent + '}';

        addCommentAfter($stmt);
    },

    SwitchStatementWithDefault: function generateSwitchStatementWithDefault($stmt)
    {
        var $discr = $stmt.discriminant,
            $preDefaultCases = $stmt.preDefaultCases,
            $defaultCase = $stmt.defaultCase,
            $postDefaultCases = $stmt.postDefaultCases,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'switch' + _.optSpace + '(';
        _.col += 7 + _.optSpaceLength;

        ExprGen[$discr.type]($discr, Preset.e5);

        _.js += ')' + _.optSpace + '{' + _.newline;
        _.line += _.newlineNumLines;
        if (_.newlineResetsCol)
            _.col = _.newlineNumCols;
        else
            _.col += 2 + _.optSpaceLength + _.newlineNumCols;

        _.indent = prevIndent;

        // pre-default cases
        if ($preDefaultCases)
        {
            var caseCount = $preDefaultCases.length;

            for (var i = 0; i < caseCount; ++i) 
            {
                var $case = $preDefaultCases[i];

                _.js += _.indent;
                _.col += _.indent.length;

                StmtGen[$case.type]($case, Preset.s4);

                _.js += _.newline;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols;
                else
                    _.col += _.newlineNumCols;
            }
        }

        // default case
        _.js += _.indent;
        _.col += _.indent.length;

        StmtGen[$defaultCase.type]($defaultCase, Preset.s4(!$postDefaultCases));

        _.js += _.newline;
        _.line += _.newlineNumLines;
        if (_.newlineResetsCol)
            _.col = _.newlineNumCols;
        else
            _.col += _.newlineNumCols;

        // post-default cases
        if ($postDefaultCases)
        {
            var caseCount = $postDefaultCases.length,
                lastCaseIdx = caseCount - 1;

            for (var i = 0; i < caseCount; ++i) 
            {
                var $case = $postDefaultCases[i];

                _.js += _.indent;
                _.col += _.indent.length;

                StmtGen[$case.type]($case, Preset.s4(i === lastCaseIdx));

                _.js += _.newline;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols;
                else
                    _.col += _.newlineNumCols;
            }
        }

        _.js += _.indent + '}';
        _.col += _.indent.length + 1;

        addCommentAfter($stmt);
    },

    SwitchCase: function generateSwitchCase($stmt, settings)
    {
        var oldLine = _.line,
            $conseqs = $stmt.consequent,
            $firstConseq = $conseqs[0],
            $test = $stmt.test,
            i = 0,
            conseqSemicolonOptional = !semicolons && settings.semicolonOptional,
            conseqCount = $conseqs.length,
            lastConseqIdx = conseqCount - 1,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.col += 4;
        _.js += join('case', exprToJs($test, Preset.e5), oldLine) + ':';
        ++_.col;

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
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols + _.indent.length;
            else
                _.col += _.newlineNumCols + _.indent.length;

            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));
        }

        _.indent = prevIndent;

        addCommentAfter($stmt);
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

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'default:';
        _.col += 8;

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
            _.line += _.newlineNumLines;
            if (_.newlineResetsCol)
                _.col = _.newlineNumCols + _.indent.length;
            else
                _.col += _.newlineNumCols + _.indent.length;

            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));
        }

        _.indent = prevIndent;

        addCommentAfter($stmt);
    },

    IfStatement: function generateIfStatement($stmt, settings)
    {
        var $conseq = $stmt.consequent,
            $test = $stmt.test,
            prevIndent = shiftIndent(),
            semicolonOptional = !semicolons && settings.semicolonOptional;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'if' + _.optSpace + '(';
        _.col += 3 + _.optSpaceLength;

        ExprGen[$test.type]($test, Preset.e5);

        _.js += ')';
        ++_.col;

        _.indent = prevIndent;
        _.js += adoptionPrefix($conseq);

        if ($stmt.alternate)
        {
            var oldLine1 = _.line,
                conseq = stmtToJs($conseq, Preset.s7) + adoptionSuffix($conseq),
                alt;

            if ($stmt.alternate.type === Syntax.IfStatement)
            {
                _.col += 5;
                alt = 'else ' + stmtToJs($stmt.alternate, Preset.s4(semicolonOptional));
            }
            else
            {
                var oldLine2 = _.line;
                _.col += 4;

                alt = join(
                    'else',
                    adoptionPrefix($stmt.alternate) + stmtToJs($stmt.alternate, Preset.s4(semicolonOptional)),
                    oldLine2
                );
            }

            _.js += join(conseq, alt, oldLine1);
        }
        else
            StmtGen[$conseq.type]($conseq, Preset.s4(semicolonOptional));

        addCommentAfter($stmt);
    },

    ForStatement: function generateForStatement($stmt, settings)
    {
        var $init = $stmt.init,
            $test = $stmt.test,
            $body = $stmt.body,
            $update = $stmt.update,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'for' + _.optSpace + '(';
        _.col += 4 + _.optSpaceLength;

        if ($init)
        {
            if ($init.type === Syntax.VariableDeclaration)
                StmtGen[$init.type]($init, Preset.s6);
            else
            {
                ExprGen[$init.type]($init, Preset.e14);

                _.js += ';';
                ++_.col;
            }
        }
        else
        {
            _.js += ';';
            ++_.col;
        }

        if ($test)
        {
            _.js += _.optSpace;
            _.col += _.optSpaceLength;

            ExprGen[$test.type]($test, Preset.e5);
        }

        _.js += ';';
        ++_.col;

        if ($update)
        {
            _.js += _.optSpace;
            _.col += _.optSpaceLength;

            ExprGen[$update.type]($update, Preset.e5);
        }

        _.js += ')';
        ++_.col;

        _.indent = prevIndent;
        _.js += adoptionPrefix($body);

        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));

        addCommentAfter($stmt);
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

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.col += $stmt.label.length + 1;
        _.js += $stmt.label + ':' + adoptionPrefix($body);

        if ($body.type !== Syntax.BlockStatement)
            prevIndent = shiftIndent();

        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));

        _.indent = prevIndent;

        addCommentAfter($stmt);
    },

    Module: function generateModule($stmt)
    {
        var $items = $stmt.items,
            $directives = $stmt.directives,
            len = $items.length,
            lenDirectives = ($directives && $directives.length) || 0,
            lastIdx = len - 1;

        addCommentBefore($stmt);

        if (safeConcatenation && (len > 0 || lenDirectives > 0))
        {
            _.js += '\n';
            ++_.line;
            _.col = 0;
        }

        for (var i = 0; i < lenDirectives; ++i)
        {
            var $directive = $directives[i];
            StmtGen[$directive.type]($directive);
        }

        for (var i = 0; i < len; ++i)
        {
            var $item = $items[i];

            _.js += _.indent;
            _.col += _.indent.length;

            StmtGen[$item.type]($item, Preset.s5(!safeConcatenation && i === lastIdx));

            if (i !== lastIdx)
            {
                _.js += _.newline;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols;
                else
                    _.col += _.newlineNumCols;
            }
        }

        addCommentAfter($stmt);
    },    

    Script: function generateScript($stmt)
    {
        var $body = $stmt.statements,
            $directives = $stmt.directives,
            len = $body.length,
            lenDirectives = ($directives && $directives.length) || 0,
            lastIdx = len - 1;

        addCommentBefore($stmt);

        if (safeConcatenation && (len > 0 || lenDirectives > 0))
        {
            _.js += '\n';
            ++_.line;
            _.col = 0;
        }

        for (var i = 0; i < lenDirectives; ++i)
        {
            var $directive = $directives[i];
            StmtGen[$directive.type]($directive);
        }

        if (len === 0)
            addCommentIn($stmt);

        for (var i = 0; i < len; ++i)
        {
            var $item = $body[i];

            _.js += _.indent;
            _.col += _.indent.length;

            StmtGen[$item.type]($item, Preset.s5(!safeConcatenation && i === lastIdx));

            if (i !== lastIdx)
            {
                _.js += _.newline;
                _.line += _.newlineNumLines;
                if (_.newlineResetsCol)
                    _.col = _.newlineNumCols;
                else
                    _.col += _.newlineNumCols;
            }
        }

        addCommentAfter($stmt);
    },

    FunctionDeclaration: function generateFunctionDeclaration($stmt)
    {
        var name = $stmt.name.name,
            isGenerator = !!$stmt.isGenerator;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += isGenerator ? ('function*' + _.optSpace) : ('function' + _.space);
        _.col += isGenerator ? (9 + _.optSpaceLength) : (8 + _.spaceLength);

        if (name !== '*default*')
        {
            _.js += name;
            _.col += name.length;
        }

        generateFunction($stmt);
    },

    ReturnStatement: function generateReturnStatement($stmt, settings)
    {
        var $arg = $stmt.expression;

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        if ($arg)
        {
            var oldLine = _.line;
            _.col += 6;
            var argJs = join('return', exprToJs($arg, Preset.e5), oldLine);
            _.js += argJs;
        }
        else
        {
            _.js += 'return';
            _.col += 6;
        }

        if (semicolons || !settings.semicolonOptional)
        {
            _.js += ';';
            ++_.col;
        }

        addCommentAfter($stmt);
    },

    WhileStatement: function generateWhileStatement($stmt, settings)
    {
        var $body = $stmt.body,
            $test = $stmt.test,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'while' + _.optSpace + '(';
        _.col += 6 + _.optSpaceLength;

        ExprGen[$test.type]($test, Preset.e5);

        _.js += ')';
        ++_.col;
        _.indent = prevIndent;

        _.js += adoptionPrefix($body);
        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));

        addCommentAfter($stmt);
    },

    WithStatement: function generateWithStatement($stmt, settings)
    {
        var $body = $stmt.body,
            $obj = $stmt.object,
            bodySemicolonOptional = !semicolons && settings.semicolonOptional,
            prevIndent = shiftIndent();

        if (sourcemap)
            addMapping($stmt);

        addCommentBefore($stmt);

        _.js += 'with' + _.optSpace + '(';
        _.col += 5 + _.optSpaceLength;

        ExprGen[$obj.type]($obj, Preset.e5);

        _.js += ')';
        ++_.col;

        _.indent = prevIndent;
        _.js += adoptionPrefix($body);

        StmtGen[$body.type]($body, Preset.s4(bodySemicolonOptional));

        addCommentAfter($stmt);
    }
};


///////////////////////////////////////////////////////////////////////////////
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
    _.line = 0;
    _.col = 0;

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
    line: 0,
    col: 0,

    commentIdx: null,
    prevCommentNode: null,

    newline: '\n',
    optSpace: ' ',
    space: ' ',
    indentUnit: '    ',
    indent: '',

    optSpaceLength: 1,
    spaceLength: 1,
    newlineNumLines: 1,
    newlineNumCols: 0,
    newlineResetsCol: true
};


// Generators
var ExprGen = undefined,
    StmtGen = StmtRawGen;


function findCodeCoveredRanges($node, locations, ranges)
{
    var loc = locations.get($node);
    if (!loc)
        return;

    var isLeaf = true;
    for (var k in $node)
    {
        var $n = $node[k];
        if (!$n)
            continue;

        if (Array.isArray($n))
        {
            var len = $n.length;
            for (var i = 0; i < len; i++)
            {
                if ($n[i].type)
                {
                    findCodeCoveredRanges($n[i], locations, ranges);
                    isLeaf = false;
                }
            }
        }
        else if ($n.type)
        {
            findCodeCoveredRanges($n, locations, ranges);
            isLeaf = false;
        }
    }

    if (isLeaf)
        ranges.push([ loc.start.offset, loc.end.offset ]);
}

function isNotInCoveredRange(ranges, start, end, options)
{
    var len = ranges.length;
    var isNotInRange = false;
    var prevRange = null;

    for (var i = (options && options.startSearchIdx) || 0; i < len; i++)
    {
        var range = ranges[i];

        if ((prevRange === null || prevRange[1] <= start) && end <= range[0])
        {
            isNotInRange = true;
            break;
        }

        if (range[0] > end)
            break;

        prevRange = range;
    }

    if (options)
        options.startSearchIdx = i;

    return isNotInRange;
}

function collapseComments($node, locations, comments)
{
    if (!comments || !comments[0])
        return [];
    if (!comments[1])
        return [ comments[0] ];

    var ranges = [];
    findCodeCoveredRanges($node, locations, ranges);

    var ret = [];
    var prevComment = null;

    var findRangeOptions = {
        startSearchIdx: 0
    };

    for (var i = 0; ; i++)
    {
        var comment = comments[i];
        if (!comment)
            break;

        if (prevComment && isNotInCoveredRange(ranges, prevComment.end.offset, comment.start.offset, findRangeOptions))
        {
            // no code between the end of the previous comment and the start of the current one:
            // collapse the previous comment and the current one
            prevComment.text += '*//*' + comment.text;
            prevComment.end.offset = comment.end.offset;
        }
        else
        {
            ret.push(comment);
            prevComment = comment;
        }
    }

    return ret;
}

function assignComments($node, locations, comments, parentStart, parentEnd, level)
{
    if (_.commentIdx === null)
        return;

    if (!level)
        level = 0;

    var loc = locations.get($node);
    var start = loc ? loc.start.offset : undefined;
    var end = loc ? loc.end.offset : undefined;
    var commentStart = comments[_.commentIdx].start.offset;

    if (start !== undefined)
    {
        // if there is a comment between the start of the parent and the start of this node,
        // set it as *before* this node
        if (parentStart <= commentStart && commentStart <= start)
        {
            if (_.prevCommentNode)
                _.prevCommentNode.commentAfter = undefined;
            $node.commentBefore = _.commentIdx;
            _.prevCommentNode = $node;
        }

        // if the start of this node is beyond the comment start, switch to the next comment
        if (level > 0 && start >= commentStart)
        {
            ++_.commentIdx;
            if (_.commentIdx >= comments.length)
                _.commentIdx = null;
        }
    }

    // recursively assign comments to the children of this node
    var isLeaf = true;
    for (var k in $node)
    {
        var $n = $node[k];
        if (!$n)
            continue;

        if (Array.isArray($n))
        {
            var len = $n.length;
            for (var i = 0; i < len; i++)
            {
                if ($n[i].type)
                {
                    assignComments(
                        $n[i],
                        locations,
                        comments,
                        start === undefined ? parentStart : start,
                        end === undefined ? parentEnd : end,
                        level + 1
                    );
                    isLeaf = false;
                }
            }
        }
        else if ($n.type)
        {
            assignComments(
                $n,
                locations,
                comments,
                start === undefined ? parentStart : start,
                end === undefined ? parentEnd : end,
                level + 1
            );
            isLeaf = false;
        }
    }

    if (start !== undefined)
    {
        // if this node is a leaf and there is a comment between the node's start and end,
        // set the comment as *in* the node
        if (isLeaf && _.commentIdx !== null && start <= comments[_.commentIdx].start.offset && comments[_.commentIdx].end.offset <= end)
        {
            if (_.prevCommentNode)
                _.prevCommentNode.commentAfter = undefined;
            $node.commentIn = _.commentIdx;
            _.prevCommentNode = $node;
        }

        // if the end of this node is beyond the comment's end, switch to the next comment
        if (_.commentIdx !== null && end > comments[_.commentIdx].end.offset)
        {
            ++_.commentIdx;
            _.prevCommentNode = null;
            if (_.commentIdx >= comments.length)
                _.commentIdx = null;
        }

        // if there is a comment between the end of this node and the end of the parent,
        // set it as *after* this node
        if (_.commentIdx !== null)
        {
            var commentStart = comments[_.commentIdx].start.offset;
            if (end <= commentStart && commentStart <= parentEnd)
            {
                if (_.prevCommentNode)
                    _.prevCommentNode.commentAfter = undefined;
                $node.commentAfter = _.commentIdx;
                _.prevCommentNode = $node;
            }
        }
    }
}


function generate($node, options)
{
    var defaultOptions = getDefaultOptions();

    if (options)
    {
        options = updateDeeply(defaultOptions, options);
        _.indentUnit = options.format.indent.style;
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

    // check optSpace and indent for newlines
    if (_.optSpace.indexOf('\n') >= 0)
        throw 'options.format.space may not contain the newline character';
    if (_.indent.indexOf('\n') >= 0)
        throw 'options.format.indent.style may not contain the newline character';

    // compute lengths for spaces and newlines
    _.optSpaceLength = _.optSpace.length;
    _.spaceLength = _.space.length;
    _.newlineNumLines = 0;
    _.newlineResetsCol = false;
    var newlineLength = _.newline.length;
    var lastNewline = -1;
    for (var i = 0; i < newlineLength; ++i)
    {
        if (_.newline.charAt(i) === '\n')
        {
            ++_.newlineNumLines;
            _.newlineResetsCol = true;
            lastNewline = i;
        }
    }
    _.newlineNumCols = newlineLength - lastNewline - 1;

    parentheses = options.format.parentheses;
    semicolons = options.format.semicolons;
    safeConcatenation = options.format.safeConcatenation;
    directive = options.directive;
    locations = options.locations || undefined;
    comments = undefined;
    sourcemap = ($node.loc || locations) ? options.sourcemap : undefined;
    filename = options.filename || 'unnamed.js';
    sourcemapLineOffset = options.sourcemapLineOffset || 0;
    inputSourcemap = options.inputSourcemap || undefined;
    pureSourcemap = options.pureSourcemap || undefined;
    extra = options;

    // assign comments to AST nodes if comments and locations are defined in the options
    if (locations && options.comments)
    {
        comments = collapseComments($node, locations, options.comments);
        _.commentIdx = comments && comments.length > 0 ? 0 : null;
        _.prevCommentNode = null;
        assignComments($node, locations, comments);
    }

    if (extra.verbatim)
        ExprGen = createExprGenWithExtras();
    else
        ExprGen = ExprRawGen;

    return run($node);
}

module.exports.generate = generate;
module.exports.assignComments = assignComments;
module.exports.findCodeCoveredRanges = findCodeCoveredRanges;
module.exports.isNotInCoveredRange = isNotInCoveredRange;
module.exports.collapseComments = collapseComments;

})();
