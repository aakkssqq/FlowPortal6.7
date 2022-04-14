﻿
Ext.define('YZSoft.esb.sprites.MySQLProcedure.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass: 'YZSoft.esb.sprites.MySQLProcedure.tree.InputTree',
    config: {
        connectionName: null,
        procedure: null
    },

    constructor: function (config) {
        var me = this,
            designer = config.designer,
            listenerSprite = designer.getListenerSprite(),
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        if (listenerSprite.isDSListener) {
            Ext.apply(me.srcTreeConfig, {
                copySchemaButton: {
                    scope: me,
                    handler: 'copyDSListenerSchema'
                }
            });
        }

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
            procedure: properties.procedure
        });

        me.callParent(arguments);
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateProcedure: function (newValue) {
        this.dirty = true;
    },

    copyDSListenerSchema: function () {
        var me = this,
            srcTree = me.srcTree,
            tagTree = me.tagTree,
            srcRecord = srcTree.getRootNode().getChildByPath('Parameters'),
            tagRecord = tagTree.getRootNode().getChildByPath('QueryParams'),
            srcSchema = srcRecord && srcRecord.save(),
            tagSchema = tagRecord && tagRecord.save(),
            schame;

        if (!srcSchema || !tagSchema)
            return;

        srcSchema.properties = tagSchema.properties;
        srcTree.replaceSchema(srcRecord, {
            Parameters: srcSchema
        });
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            procedure = me.getProcedure();

        if (!connectionName || !procedure)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/MySQL.ashx'),
            params: {
                method: 'GetProcedureInputSchema',
                connectionName: connectionName,
                procedure: procedure
            },
            success: function (action) {
                me.setTagSchema(action.result);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});