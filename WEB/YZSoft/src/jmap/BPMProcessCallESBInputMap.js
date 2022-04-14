/*
config:
tables
*/
Ext.define('YZSoft.src.jmap.BPMProcessCallESBInputMap', {
    extend: 'YZSoft.src.jmap.MapAbstract',
    referenceHolder: true,
    title: RS.$('Process_CallESB_InputPropertyPage_Title'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    srcTreeXClass:'YZSoft.src.jschema.tree.BPMProcessOutputTree',
    tagTreeXClass: 'YZSoft.src.jschema.tree.ESBFlowInputTree',

    constructor: function (config) {
        var me = this,
            tables = config.tables;

        me.srcTreeConfig = {
            header: {
                padding:'14 10 2 16',
                title: RS.$('Process_CallESB_ProcessOutputTree_Title')
            },
            width: 260,
            tables: tables
        };

        me.tagTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: RS.$('Process_CallESB_ESBInputTree_Title')
            },
            width: 260
        };

        me.callParent(arguments);
    },

    fill: function (data) {
        var me = this;

        me.setJsmCode(data.InputCode);
    },

    save: function () {
        var me = this;

        return {
            InputCode: me.getJsmCode()
        };
    }
});