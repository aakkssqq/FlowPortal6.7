
Ext.Loader.loadScriptsSync([
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/lib/codemirror.css'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/lib/codemirror.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/edit/matchbrackets.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/comment/continuecomment.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/addon/comment/comment.js'),
    YZSoft.$url('YZSoft/src/form/field/codemirror/source/mode/javascript/javascript.js')
]);

Ext.define('YZSoft.src.form.field.JMapEditor', {
    extend: 'YZSoft.src.form.field.codemirror.Abstract',
    requires: [
        'YZSoft.src.ast.JSM.Parser'
    ],
    codeMirror: {
        lineNumbers: true,
        mode: "application/ld+json",
        matchBrackets: true,
        continueComments: 'Enter',
        indentUnit: 4
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            linkdrop: 'onLinkDrop',
            tagtreeclearlink: function (record) {
                me.deleteProperty(record.getMemberPath(), function () {
                    me.fireEvent('clearmapdone');
                });
            }
        });
    },

    onLinkDrop: function (fromTree, fromRecord, toTree, toRecord, e) {
        var me = this,
            js = me.getValue(),
            from = fromRecord.getTypeDescriptsPath(),
            to = toRecord.getTypeDescriptsPath(),
            writer;

        YZSoft.src.ast.JSM.Parser.parse(js, function (ast) {
            writer = Ext.create('YZSoft.src.ast.JSM.JsonMappingWrite', {
                js: js,
                ast: ast,
                rootNode: toTree.getRootNode()
            });

            writer.addMap(from, to, e.ctrlKey, function (newcode) {
                me.setValue(newcode);
                me.fireEvent('linkdropdone');
            });
        });
    },

    deleteProperty: function (path, fn) {
        var me = this,
            js = me.getValue(),
            writer;

        YZSoft.src.ast.JSM.Parser.parse(js, function (ast) {
            writer = Ext.create('YZSoft.src.ast.JSM.JsonMappingWrite', {
                js: js,
                ast: ast
            });

            writer.deleteProperty(path, function (newcode) {
                me.setValue(newcode);
                fn && fn();
            });
        });
    }
});