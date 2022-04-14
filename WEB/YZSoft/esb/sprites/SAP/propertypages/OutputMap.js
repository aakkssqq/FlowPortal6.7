
Ext.define('YZSoft.esb.sprites.SAP.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass:'YZSoft.esb.sprites.SAP.tree.OutputTree',
    config: {
        connectionName: null,
        bapiName: null
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_SAP_OutputTree_Title'),
            tools: [{
                type: 'refresh',
                handler: function () {
                    me.$refresh({
                        waitMsg: {
                            target: me.srcTree,
                            msg: RS.$('ESB_LoadMask_RefreshSchema'),
                            start: 0
                        }
                    });
                }
            }]
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_TreeTitle_Response')
        };

        Ext.apply(config, {
            connectionName: properties.connectionName,
            bapiName: properties.bapiName
        });

        me.callParent(arguments);
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateBapiName: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            bapiName = me.getBapiName();

        if (!connectionName || !bapiName)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/SAP.ashx'),
            params: {
                method: 'GetOutputSchema',
                connectionName: connectionName,
                bapiName: bapiName
            },
            success: function (action) {
                me.setSrcSchema(action.result);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});