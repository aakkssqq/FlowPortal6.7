
Ext.define('YZSoft.bpm.km.panel.Documents', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.File'
    ],
    cls: 'yz-pnl-bpakm',
    ui:'light',
    header: {
        cls:'yz-header-bpakm'
    },
    title: RS.$('KM_ReportAndDocument'),

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['FileID', 'Name', 'Size', 'LastUpdate'],
            data: []
        });

        me.view = Ext.create('Ext.view.View', {
            tpl: [
                '<tpl for=".">',
                '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpakm yz-dataview-item-bpakm-doc">',
                    '<img src="{Ext:this.rederIcon}"/>',
                    '<div class="wrap">',
                        '<div class="name">{Name:text}</div>',
                    '</div>',
                '</div>',
                '</tpl>', {
                    rederIcon: function (value) {
                        return YZSoft.src.ux.File.getIconByExt(value, 32);
                    }
                }
            ],
            overItemCls: 'yz-dataview-item-bpakm-over',
            selectedItemCls: '',
            itemSelector: '.yz-dataview-item-bpakm',
            store: me.store
        });

        cfg = {
            items: [me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.view.on({
            itemclick: function (view, record, item, index, e, eOpts) {
                YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                    method: 'Download',
                    fileid: record.data.FileID
                });
            }
        });
    },

    setData: function (documents) {
        this.store.setData(documents || []);
    }
});