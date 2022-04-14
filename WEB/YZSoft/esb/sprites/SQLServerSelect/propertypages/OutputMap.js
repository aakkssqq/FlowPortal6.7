
Ext.define('YZSoft.esb.sprites.SQLServerSelect.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass: 'YZSoft.esb.sprites.SQLServerSelect.tree.OutputTree',
    config: {
        connectionName: null,
        query: null
    },

    constructor: function (config) {
        var me = this,
            designer = config.designer,
            responseSprite = designer.getResponseSprite(),
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_DB_OutputTree_Title'),
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

        if (responseSprite.isDSResponse) {
            Ext.apply(me.tagTreeConfig, {
                copySchemaButton: {
                    scope: me,
                    handler: 'copyDSResponseSchema'
                }
            });
        }

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

    copyDSResponseSchema: function () {
        var me = this,
            srcTree = me.srcTree,
            tagTree = me.tagTree,
            srcRecord = srcTree.getRootNode().getChildByPath('Result.rows'),
            tagRecord = tagTree.getRootNode().getChildByPath('Response.rows'),
            srcSchema = srcRecord && srcRecord.save(),
            tagSchema = tagRecord && tagRecord.save(),
            schame;

        if (!srcSchema || !tagSchema)
            return;

        tagSchema.items = srcSchema.items;
        tagTree.replaceSchema(tagRecord, {
            rows: tagSchema
        });
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
                method: 'GetQueryOutputSchema',
                connectionName: connectionName,
                query: query
            },
            success: function (action) {
                me.setSrcSchema(action.result);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});