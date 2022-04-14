
Ext.Loader.loadScriptsSync([
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/lib/codemirror.css'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/lib/codemirror.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/edit/matchbrackets.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/comment/continuecomment.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/comment/comment.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/mode/sql/sql.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/hint/show-hint.css'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/hint/show-hint.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/hint/sql-hint.js')
]);

Ext.define('YZSoft.src.form.field.codemirror.SqlAbstract', {
    extend: 'YZSoft.src.form.field.codemirror.Abstract'
});