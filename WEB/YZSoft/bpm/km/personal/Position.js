
Ext.define('YZSoft.bpm.km.personal.Position', {
    extend: 'Ext.panel.Panel',
    cls: 'yz-pnl-bpakm',
    ui:'light',
    header: {
        cls:'yz-header-bpakm'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['FileID', 'SpriteID', 'FileName', 'SpriteName'],
            data: []
        });

        me.view = Ext.create('Ext.view.View', {
            tpl: [
                '<tpl for=".">',
                    '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-bpakm yz-dataview-item-bpakm-usedbyfiles">',
                        '{SpriteName:text}',
                    '</div>',
                '</tpl>'
            ],
            overItemCls: 'yz-dataview-item-bpakm-over',
            selectedItemCls: '',
            itemSelector: '.yz-dataview-item-bpakm',
            store: me.store
        });

        cfg = {
            items: [me.view],
            tools: [{
                type: 'plus',
                tooltip: RS.$('All_Tip_AddPosition'),
                handler: function (event, toolEl, panelHeader) {
                    var selection = [];
                    me.store.each(function (rec) {
                        selection.push(Ext.copyTo({
                        },
                        rec.data,
                        ['FileID','SpriteID','FileName','SpriteName']
                        ));
                    });

                    Ext.create('YZSoft.bpa.src.dialogs.SelSpritesDlg', {
                        autoShow: true,
                        folderType: 'BPAOU',
                        selection: selection,
                        fn: function (nodes) {
                            var values = [];
                            Ext.Array.each(nodes, function (node) {
                                values.push(Ext.copyTo({
                                }, node, ['FileID', 'SpriteID', 'FileName', 'SpriteName']));
                            });

                            me.fireEvent('positionSelected', values);
                        }
                    });
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.view, ['itemclick']);
    },

    setData: function (usedby) {
        this.store.setData(usedby || []);
    }
});