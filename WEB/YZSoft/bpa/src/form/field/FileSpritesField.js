
/*
config
    fileid
*/
Ext.define('YZSoft.bpa.src.form.field.FileSpritesField', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'YZSoft.bpa.src.model.Sprite'
    ],
    margin: 0,
    emptyItem:{
        type: 'label',
        border: false,
        html: Ext.String.format('<div style="color:#ccc;height:32px;line-height:32px;margin-bottom:5px;">{0}</div>', RS.$('BPA_FileSpritesField_SelectModule'))
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpa.src.model.Sprite',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                extraParams: {
                    method: 'GetFileSprites',
                    fileid: config.fileid
                }
            }
        });

        cfg = {
            items: [me.emptyItem]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.on({
            load: function (store, records, successful, operation, eOpts) {
                if (!successful)
                    return;

                me.fileid = operation.getRequest().getParams().fileid;
            },
            datachanged: function (store) {
                var btnDatas = [],
                    records = store.getData().items;

                Ext.each(records, function (rec) {
                    btnDatas.push({
                        spriteid: rec.data.SpriteID,
                        text: rec.data.SpriteName,
                        pressed: false
                    })
                });

                var btns = [];
                Ext.each(btnDatas, function (data) {
                    btn = Ext.create('Ext.button.Button', {
                        text: data.text,
                        cls: 'yz-btn-segment',
                        group: data.group,
                        pressed: data.pressed,
                        enableToggle: true,
                        spriteid: data.spriteid,
                        margin: '0 5 5 0'
                    });

                    me.relayEvents(btn, ['toggle'], 'btn');
                    btns.push(btn);
                });
                me.removeAll(true);
                me.add(btns);

                if (btns.length == 0)
                    me.add(me.emptyItem);
            }
        });

        if (config.fileid)
            me.store.load();
    },

    setFileID: function (value) {
        if (!value) {
            delete this.fileid;
            this.store.removeAll(false);
        }
        else {
            this.store.load({
                params: {
                    fileid: value
                }
            });
        }
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.items.each(function (btn) {
            if (btn.pressed) {
                rv.push(btn.spriteid);
            }
        });

        return rv;
    }
});