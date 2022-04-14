/*
*/

Ext.define('YZSoft.report.designer.dialogs.SelDSNodeDialog', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    width: 395,
    height: 465,
    minWidth: 395,
    minHeight: 465,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            dsNodes = config.dsNodes,
            data = [],
            cfg;

        Ext.each(dsNodes, function (dsNode) {
            data.push({
                dsid: dsNode.data.text,
                tag: dsNode
            });
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            border: true,
            store: {
                fields:['dsid','tag'],
                data: data
            },
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SINGLE' }),
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_DataSource'), dataIndex: 'dsid', flex: 1, formatter: 'text' }
                ]
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.closeDialog(record.data);
                }
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, null, 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.closeDialog(recs[0].data.tag);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.grid],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});