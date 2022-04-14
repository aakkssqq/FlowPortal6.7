//config

Ext.define('YZSoft.bpm.src.dialogs.SelLeaderTitleDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.Name'
    ],
    title: RS.$('All_SellectLeaderTitle'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.Name',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetLeaderTitles' }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            border:true,
            store: me.store,
            selModel: { mode: 'SINGLE' },
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SINGLE' }),
            viewConfig: {
                stripeRows:false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_LeaderTitle'), dataIndex: 'name', flex: 1, formatter:'text' }
                ]
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.closeDialog(record.data.name);
                },
                selectionchange: function (grid, selected, eOpts) {
                    if (selected.length != 0)
                        me.edtLeaderTitle.setValue(selected[0].data.name);

                    me.updateStatus();
                }
            }
        });

        me.edtLeaderTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_LeaderTitle'),
            labelAlign: 'top',
            margin: '5 0 0 0',
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.store,
            handler: function () {
                var leaderTitle = Ext.String.trim(me.edtLeaderTitle.getValue());
                if (leaderTitle)
                    me.closeDialog(leaderTitle);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.grid, me.edtLeaderTitle],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.load({ loadMask: false });
    },

    show: function (config) {
        config = config || {};

        if (config.title)
            this.setTitle(config.title);

        if (config.fn) {
            this.fn = config.fn;
            this.scope = config.scope;
        }

        this.callParent();
    },

    updateStatus: function () {
        var me = this,
            leaderTitle = Ext.String.trim(me.edtLeaderTitle.getValue());

        me.btnOK.setDisabled(!leaderTitle);
    }
});
