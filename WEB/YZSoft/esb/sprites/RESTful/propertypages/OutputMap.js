
Ext.define('YZSoft.esb.sprites.RESTful.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass:'YZSoft.esb.sprites.RESTful.tree.OutputTree',
    config: {
        connectionName: null,
        method: null
    },
    defaultSchema: {
        Headers: {
            type: 'object',
            yzext: {
                isHeader: true
            },
            properties: {
            }
        },
        Response: {
            type: 'object',
            yzext: {
                isResponse: true
            },
            properties: {
            }
        }
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_RESTful_OutputTree_Title'),
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
            method: properties.method
        });

        me.callParent(arguments);
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateMethod: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            method = me.getMethod(),
            curSchema = me.getSrcSchema() || {},
            newSchema = {};

        if (!connectionName || !method)
            return;

        me.mergeSection(newSchema, curSchema, me.defaultSchema, 'Headers');
        me.mergeSection(newSchema, curSchema, me.defaultSchema, 'Response');

        me.setSrcSchema(newSchema);
        cfg && cfg.fn && cfg.fn();
    }
});