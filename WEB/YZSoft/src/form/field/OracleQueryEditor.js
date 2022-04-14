
Ext.define('YZSoft.src.form.field.OracleQueryEditor', {
    extend: 'YZSoft.src.form.field.codemirror.SqlAbstract',
    codeMirror: {
        lineNumbers: true,
        mode: "text/x-plsql",
        matchBrackets: true,
        continueComments: 'Enter',
        indentUnit: 4
    }
});