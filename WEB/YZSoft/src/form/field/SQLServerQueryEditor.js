
Ext.define('YZSoft.src.form.field.SQLServerQueryEditor', {
    extend: 'YZSoft.src.form.field.codemirror.SqlAbstract',
    codeMirror: {
        lineNumbers: true,
        mode: "text/x-mssql",
        matchBrackets: true,
        continueComments: 'Enter',
        indentUnit: 4
    }
});