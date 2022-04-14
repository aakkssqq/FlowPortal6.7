
Ext.Loader.loadScriptsSync([
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/lib/codemirror.css'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/lib/codemirror.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/edit/matchbrackets.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/comment/continuecomment.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/comment/comment.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/mode/javascript/javascript.js')
]);

Ext.define('YZSoft.src.form.field.JsonEditor', {
    extend: 'YZSoft.src.form.field.codemirror.Abstract',
    codeMirror: {
        lineNumbers: true,
        mode: "application/ld+json",
        matchBrackets: true,
        continueComments: 'Enter',
        indentUnit: 4
    }
});