
Ext.define('YZSoft.esb.sprites.AliSMS.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.AliSMS.tree.InputTree',
    config: {
        connectionName: null,
        templateCode: null
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_AliSMS_InputTree_Title'),
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
            templateCode: properties.TemplateCode
        });

        me.callParent(arguments);
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateTemplateCode: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            templateCode = me.getTemplateCode(),
            newSchema = {};

        if (!connectionName || !templateCode)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/Aliyun.ashx'),
            params: {
                method: 'ParseSMSTemplateParamsSchema',
                connectionName: connectionName,
                templateCode: templateCode
            },
            success: function(action) {
                newSchema = {
                    PhoneNumbers: {
                        type: 'string'
                    },
                    TemplateParams: {
                        type: 'object',
                        properties: action.result
                    }
                }
                me.setTagSchema(newSchema);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});