/*
config
series
*/

Ext.define('YZSoft.src.designer.dialogs.NewSeriesDialog', {
    extend: 'Ext.window.Window',
    requires: [
        'YZSoft.src.model.ChartSeries'
    ],
    layout: 'fit',
    width: 869,
    height: 560,
    modal: true,
    resizable: false,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            series = config.series,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.ChartSeries',
            data: series
        });

        me.view = Ext.create('Ext.view.View',{
            scrollable: true,
            cls: 'yz-dataview-reportseriestemplate',
            store: me.store,
            tpl: [
                '<tpl for=".">',
                    '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-reportseriestemplate">',
                        '<div class="inner">',
                            '<img class="img" src="{url}">',
                        '</div>',
                        '<div class="txt">',
                            '{desc}',
                        '</div>',
                    '</div>',
                '</tpl>'
            ],
            overItemCls: 'yz-dataview-item-over',
            selectedItemCls: 'yz-dataview-item-selected',
            itemSelector: '.yz-dataview-item-reportseriestemplate',
            listeners: {
                scope: me,
                selectionchange: 'updateStatus',
                itemdblclick: 'onTemplateDblClick'
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: true,
            handler: function () {
                var recs = me.getSelection();

                if (recs.length == 1)
                    me.closeDialog(recs[0]);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.view],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    getSelection: function () {
        var me = this,
            view = me.view,
            sm = view && view.getSelectionModel(),
            recs = sm && sm.getSelection();

        return recs || [];
    },

    onTemplateDblClick: function (view, record, item, index, e, eOpts) {
        this.closeDialog(record);
    },

    updateStatus: function () {
        var me = this,
            recs = me.getSelection();

        me.btnOK.setDisabled(recs.length != 1);
    }
});