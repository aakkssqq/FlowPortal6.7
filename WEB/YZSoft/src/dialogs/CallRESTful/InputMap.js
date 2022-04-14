/*
config:
*/
Ext.define('YZSoft.src.dialogs.CallRESTful.InputMap', {
    extend: 'YZSoft.src.jmap.MapAbstract',
    referenceHolder: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    srcTreeXClass: 'YZSoft.src.jschema.tree.SpecificSchemaOutputTree',
    tagTreeXClass: 'YZSoft.src.jschema.tree.FreeSchemaInputTree',

    constructor: function (config) {
        var me = this;

        me.srcTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: config.srcTreeTitle
            },
            decodable: false,
            width: 260
        };

        me.tagTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: config.tagTreeTitle
            },
            width: 260
        };

        me.callParent(arguments);
    },

    fill: function (data) {
        var me = this;

        me.setJsmCode(data.inputCode);
    },

    save: function () {
        var me = this;

        return {
            inputSchema: me.tagTree.saveSchema(),
            inputCode: me.getJsmCode()
        };
    }
});