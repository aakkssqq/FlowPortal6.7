/*
config:
*/
Ext.define('YZSoft.src.dialogs.CallRESTful.OutputMap', {
    extend: 'YZSoft.src.jmap.MapAbstract',
    referenceHolder: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    srcTreeXClass: 'YZSoft.src.jschema.tree.FreeSchemaOutputTree',
    tagTreeXClass: 'YZSoft.src.jschema.tree.SpecificSchemaInputTree',

    constructor: function (config) {
        var me = this;

        me.srcTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: config.srcTreeTitle
            },
            width: 260
        };

        me.tagTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: config.tagTreeTitle
            },
            decodable: false,
            width: 260
        };

        me.callParent(arguments);
    },

    fill: function (data) {
        var me = this;

        me.setJsmCode(data.outputCode);
    },

    save: function () {
        var me = this;

        return {
            outputSchema: me.srcTree.saveSchema(),
            outputCode: me.getJsmCode()
        };
    }
});