/*
config:
*/
Ext.define('YZSoft.src.datasource.query.ReportDSDialog', {
    extend: 'Ext.window.Window',
    title: RS.$('Designer_DataSource_Query'),
    layout: {
        type: 'vbox',
        align:'stretch'
    },
    width: 1180,
    height: 690,
    minWidth: 960,
    minHeight: 560,
    modal: true,
    maximizable: true,
    buttonAlign: 'right',
    bodyPadding: '0 20',

    constructor: function (config) {
        var me = this,
            config = config || {},
            value = config.value,
            cfg;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Name'),
            cls: 'yz-field-required',
            width: '50%',
            value: value.dsid,
            listeners: {
                scope:me,
                change:'updateStatus'
            }
        });

        me.paging = Ext.create('Ext.button.Segmented', {
            items: [{
                value: 'Enable',
                text: RS.$('All_YZPagingType_Enable')
            }, {
                value: 'Disable',
                text: RS.$('All_YZPagingType_Disable')
            }, {
                value: 'Client',
                text: RS.$('All_YZPagingType_Client')
            }],
            value: (value.ds && value.ds.paging) || 'Enable',
            listeners: {
                change: function () {
                    //var value = this.getValue();
                }
            }
        });

        me.pageSize = Ext.create('Ext.form.field.Number', {
            //fieldLabel: RS.$('All_PageSize'),
            //labelWidth: 40,
            margin:'0 0 0 8',
            width: 90,
            minValue: 1,
            maxValue: 9999,
            value: (value.ds && value.ds.pageSize) || 100
        });

        me.pnlQuery = Ext.create('YZSoft.src.datasource.query.panel.ReportDSSettingPanel', {
            flex: 1,
            width: '100%',
            value: value.ds,
            listeners: {
                beforerun: function (ds) {
                    var pageSize = me.pageSize.getValue(),
                        paging = me.paging.getValue();

                    ds.pageSize = pageSize;
                    ds.paging = paging;
                }
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                me.save(function (rv) {
                    me.closeDialog(rv);
                });
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                margin:'10 0 16 0',
                items: [me.edtName, { xtype: 'tbfill' }, me.paging, me.pageSize]
            },me.pnlQuery],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();

        me.pnlQuery.edtQuery.focus();
    },

    save: function (fn) {
        var me = this,
            dsid = Ext.String.trim(me.edtName.getValue()),
            pageSize = me.pageSize.getValue(),
            paging = me.paging.getValue();

        me.pnlQuery.save(function (ds) {
            ds.pageSize = pageSize;
            ds.paging = paging;
            fn && fn({
                dsid: dsid,
                ds:ds
            });
        });
    },

    updateStatus: function () {
        var me = this,
            dsid = Ext.String.trim(me.edtName.getValue());

        me.btnOK.setDisabled(!dsid);
    }
});