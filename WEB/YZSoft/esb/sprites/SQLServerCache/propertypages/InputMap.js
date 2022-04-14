
Ext.define('YZSoft.esb.sprites.SQLServerCache.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass: 'YZSoft.esb.sprites.SQLServerCache.tree.InputTree',
    config: {
        connectionName: null,
        table: null
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_DBCache_InputTreeTitle'),
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
            table: properties.table
        });

        me.callParent(arguments);
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateTable: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            table = me.getTable();

        if (!connectionName || !table)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/SQLServer.ashx'),
            params: {
                method: 'GetTableSchema',
                connectionName: connectionName,
                table: table
            },
            success: function(action) {
                me.setTagSchema(action.result);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});