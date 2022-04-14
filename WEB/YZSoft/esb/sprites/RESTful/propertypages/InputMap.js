
Ext.define('YZSoft.esb.sprites.RESTful.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.RESTful.tree.InputTree',
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
        QueryParams: {
            type: 'object',
            yzext: {
                isQueryParams: true
            },
            properties: {
            }
        },
        Form: {
            type: 'object',
            yzext: {
                isForm: true
            },
            properties: {
            }
        },
        Payload: {
            type: 'object',
            yzext: {
                isPayload: true
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
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_RESTful_InputTree_Title'),
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

    dirtyRefresh: function () {
        this.srcTree.updateLocalVariables();
        this.$refresh();
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            method = me.getMethod(),
            curSchema = me.getTagSchema() || {},
            newSchema = {};

        if (!connectionName || !method)
            return;

        me.mergeSection(newSchema, curSchema, me.defaultSchema, 'Headers');
        if (method == 'GET') {
            me.mergeSection(newSchema, curSchema, me.defaultSchema, 'QueryParams');
        }
        else {
            me.mergeSection(newSchema, curSchema, me.defaultSchema, 'QueryParams');
            me.mergeSection(newSchema, curSchema, me.defaultSchema, 'Form');
            me.mergeSection(newSchema, curSchema, me.defaultSchema, 'Payload');
        }

        me.setTagSchema(newSchema);
        cfg && cfg.fn && cfg.fn();
    }
});