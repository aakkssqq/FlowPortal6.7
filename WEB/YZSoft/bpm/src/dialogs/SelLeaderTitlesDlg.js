
/*
initSelection
*/

Ext.define('YZSoft.bpm.src.dialogs.SelLeaderTitlesDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.Name'
    ],
    layout: 'fit',
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
            autoLoad: true,
            model: 'YZSoft.bpm.src.model.Name',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetLeaderTitles' }
            },
            listeners: {
                load: function () {
                    if (me.initSelection) {
                        var selRecs = [];
                        me.store.each(function (rec) {
                            if (Ext.Array.contains(me.initSelection, rec.data.name))
                                selRecs.push(rec);
                        });
                        me.grid.getSelectionModel().select(selRecs);
                        delete me.initSelection;
                    }
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            trackMouseOver: false,
            selModel: {
                selType: 'checkboxmodel'
            },
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_LeaderTitle'), dataIndex: 'name', flex: 1, renderer: YZSoft.Render.renderString }
                ]
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: config.btnText || RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.getSelection());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            scope: this,
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
    },

    getSelection: function () {
        var me = this,
            selRecs = me.grid.getSelectionModel().getSelection(),
            rv = [];

        Ext.each(selRecs, function (rec) {
            rv.push(rec.data.name);
        });

        return rv;
    },

    show: function (config) {
        var me = this,
            config = config || {},
            myGroupName = config.myGroupName,
            value = config.value;

        me.store.removeAll();

        if (myGroupName) {
            me.store.add({
                groupName: myGroupName,
                myGroup: true,
                disabled: true,
                checked: true
            })
        }

        //转换数据
        Ext.each(me.groups, function (groupName) {
            if (groupName != myGroupName) {
                me.store.add({
                    groupName: groupName,
                    myGroup: false,
                    checked: Ext.Array.contains(value, groupName)
                });
            }
        });

        me.callParent();
    }
});