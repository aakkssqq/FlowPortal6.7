
Ext.define('YZSoft.esb.sprites.SQLServerCommand.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass: 'YZSoft.esb.sprites.SQLServerCommand.tree.InputTree',
    config: {
        connectionName: null,
        query: null
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_DB_InputTree_Title'),
            tools: [{
                type: 'refresh',
                handler: function () {
                    me.$refresh({
                        waitMsg: {
                            target: me.tagTree,
                            msg: RS.$('ESB_LoadMask_RefreshSchema'),
                            start: 0
                        }
                    });
                }
            }]
        };

        Ext.apply(config, {
            connectionName: properties.connectionName,
            query: properties.query
        });

        me.callParent(arguments);
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateQuery: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            query = me.getQuery();

        if (!connectionName || !query)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/SQLServer.ashx'),
            params: {
                method: 'GetQueryInputSchema',
                connectionName: connectionName,
                query: query,
                paging: false
            },
            success: function(action) {
                me.setTagSchema(action.result);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});