/*
config
messageCats
tables
*/

Ext.define('YZSoft.bpm.propertypages.MessageGroups', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('All_Title_MessageGroups'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            storeData = [],
            cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: { method: 'GetNotifyProviders' },
            success: function (action) {
                me.providers = action.result;
            }
        });

        Ext.each(config.messageCats, function (catName) {
            storeData.push({
                MessageCat: catName,
                DisplayName: RS.$('All_Enum_MessageCat_' + catName, catName),
                MessageItems: []
            });
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['MessageCat', 'DisplayName', 'MessageItems'],
            data: storeData
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            border: true,
            store: me.store,
            flex: 1,
            selModel: {
                mode: 'SINGLE'
            },
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_MessageType'), dataIndex: 'DisplayName', width: 245 },
                    { text: RS.$('All_MessageContent'), dataIndex: 'MessageItems', flex: 1, scope: me, renderer: 'renderContent' },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Edit'),
                        width: 68,
                        align: 'center',
                        sortable: false,
                        draggable: false,
                        menuDisabled: true,
                        items: [{
                            glyph: 0xeab4,
                            iconCls: 'yz-size-icon-13',
                            handler: function (grid, rowIndex, colIndex, item, e, record) {
                                me.edit(record);
                            }
                        }]
                    }
                ]
            },
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.edit(record);
                }
            }
        }, config.gridConfig));

        cfg = {
            items: [Ext.apply({
                xtype: 'label',
                region: 'north',
                text: RS.$('Process_MessageGroups_Title'),
                style: 'display:block',
                margin: '0 0 6 0'
            }, config.caption), me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderContent: function (value, metaData, rec) {
        var me = this;

        value = value || [];
        if (me.inheriable) {
            var data = [],
                modified = false;

            Ext.each(me.providers, function (provider) {
                var customMessage = Ext.Array.findBy(value, function (messageItem) {
                    if (messageItem.ProviderName == provider.Name)
                        return true;
                });

                if (customMessage && customMessage.Inheri === false) {
                    modified = true;
                    if (customMessage.Enabled === false)
                        data.push('<font color="#999">' + provider.Name + '</font>');
                    else
                        data.push('<font color="#ff0000">' + provider.Name + '</font>');
                }
                else {
                    //data.push(provider.Name);
                }
            });

            return modified ? data.join(',') : RS.$('Process_Message_AllDefault');
        }
        else {
            var data = [];

            Ext.each(me.providers, function (provider) {
                var customMessage = Ext.Array.findBy(value, function (messageItem) {
                    if (messageItem.ProviderName == provider.Name)
                        return true;
                });

                if (customMessage && customMessage.Enabled && (customMessage.Title || customMessage.Message))
                    data.push('<font color="#000">' + provider.Name + '</font>');
                else
                    data.push('<font color="#999">' + provider.Name + '</font>');
            });

            return data.join(',');
        }
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.MessageSettingDlg', {
            autoShow: true,
            autoClose: false,
            title: rec.data.DisplayName,
            messageItems: rec.data.MessageItems,
            messageCatFieldConfig: {
                inheriable: me.inheriable,
                messageFieldConfig: {
                    messageCat: rec.data.MessageCat,
                    tables: me.tables,
                    inheriable: me.inheriable,
                    inheri: me.inheri
                }
            },
            fn: function (data) {
                var dlg = this;

                if (me.inheriable) {
                    dlg.close();
                    rec.set('MessageItems', data);
                }
                else {
                    YZSoft.Ajax.request({
                        method: 'POST',
                        url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
                        params: {
                            method: 'SaveServerNotifyMessageCat',
                            messageCat: rec.data.MessageCat
                        },
                        jsonData: data,
                        waitMsg: {
                            msg: RS.$('All_Saving'),
                            target: dlg,
                            start: 0
                        },
                        success: function (action) {
                            me.load({
                                waitMsg: {
                                    msg: RS.$('All_Save_Succeed'),
                                    msgCls: 'yz-mask-msg-success',
                                    target: dlg,
                                    start: 0,
                                    fn: function () {
                                        dlg.close();
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    },

    load: function (config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: { method: 'GetServerNotifyMessages' },
            success: function (action) {
                me.fill(action.result);
            }
        },config));
    },

    fill: function (value) {
        var me = this;

        me.store.each(function (rec) {
            var findItem = Ext.Array.findBy(value, function (item) {
                if (item.MessageCat == rec.data.MessageCat)
                    return true;
            });

            if (findItem)
                rec.set('MessageItems', findItem.MessageItems);
        });
    },

    save: function () {
        var me = this,
            value = [];

        me.store.each(function (rec) {
            value.push(Ext.copyTo({}, rec.data, [
                'MessageCat',
                'MessageItems'
            ]));
        });

        return value;
    }
});