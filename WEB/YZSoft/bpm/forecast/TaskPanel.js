/*
config
    TaskID
    data
*/

Ext.define('YZSoft.bpm.forecast.TaskPanel', {
    extend: 'Ext.panel.Panel',
    title: RS.$('All_Title_Forecast'),
    layout: 'fit',
    border: false,

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('YZSoft.bpm.forecast.TaskStore', {
            proxy: {
                actionMethods: { read: 'POST' },
                type: 'ajax',
                extraParams: {
                    TaskID: config.TaskID,
                    xmlData: config.data && Ext.util.Base64.encode(YZSoft.util.xml.encode('XForm', config.data))
                }
            }
        });

        me.grid = Ext.create('YZSoft.bpm.forecast.Grid', {
            store: me.store,
            title: {
                text: RS.$('All_Caption_Forecast'),
                style: {
                    fontSize:'13px'
                }
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.store.reload({
                        loadMask: {
                            msg: RS.$('All_Forecast_LoadMask'),
                            target: me,
                            start: 0
                        }
                    });
                }
            }]
        });

        var cfg = {
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setFormData: function (xmlData) {
        var me = this,
            params = me.store.getProxy().getExtraParams();

        params.xmlData = xmlData && Ext.util.Base64.encode(YZSoft.util.xml.encode('XForm', xmlData));
        if (me.store.isLoaded()) {
            me.store.load({
                loadMask: false
            });
        }
    }
});