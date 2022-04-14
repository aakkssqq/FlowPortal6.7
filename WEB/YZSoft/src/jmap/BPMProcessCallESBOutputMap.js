/*
config:
tables
*/
Ext.define('YZSoft.src.jmap.BPMProcessCallESBOutputMap', {
    extend: 'YZSoft.src.jmap.MapAbstract',
    referenceHolder: true,
    title: RS.$('Process_Title_Return'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    srcTreeXClass:'YZSoft.src.jschema.tree.ESBFlowOutputTree',
    tagTreeXClass: 'YZSoft.src.jschema.tree.BPMProcessInputTree',

    constructor: function (config) {
        var me = this,
            tables = config.tables;

        me.srcTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: RS.$('Process_CallESB_ESBOutputTree_Title')
            },
            width: 260
        };

        me.tagTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: RS.$('Process_CallESB_ProcessInputTree_Title')
            },
            width: 260,
            tables: tables
        };

        me.callParent(arguments);
    },

    fill: function (data) {
        var me = this;

        me.setJsmCode(data.OutputCode);
    },

    save: function () {
        var me = this;

        return {
            OutputCode: me.getJsmCode()
        };
    }
});