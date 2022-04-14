
Ext.define('YZSoft.src.form.field.MySQLQueryEditor', {
    extend: 'YZSoft.src.form.field.codemirror.SqlAbstract',
    codeMirror: {
        lineNumbers: true,
        mode: "text/x-mysql",
        matchBrackets: true,
        continueComments: 'Enter',
        indentUnit: 4
    }
});