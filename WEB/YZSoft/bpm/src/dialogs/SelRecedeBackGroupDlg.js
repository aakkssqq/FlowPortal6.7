
/*
groups
*/

Ext.define('YZSoft.bpm.src.dialogs.SelRecedeBackGroupDlg', {
    extend: 'Ext.window.Window', //111111
    layout: 'fit',
    width: 512,
    height: 460,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['groupName', 'checked', 'myGroup', 'disabled'],
            data: [],
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            trackMouseOver: false,
            disableSelection: true,
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_RecedebackGroup'), dataIndex: 'groupName', flex: 1, renderer: YZSoft.Render.renderString },
                    { xtype: 'checkcolumn', text: RS.$('All_CanRecedeBack'), dataIndex: 'checked', disableDataIndex: 'disabled', width: 100 }
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
            buttons: [me.btnCancel,me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getSelection: function () {
        var me = this,
            rv = [];

        me.store.each(function (rec) {
            if (!rec.data.myGroup && rec.data.checked)
                rv.push(rec.data.groupName);
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