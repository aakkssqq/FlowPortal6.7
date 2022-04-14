﻿
Ext.define('YZSoft.esb.sprites.WebService.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass:'YZSoft.esb.sprites.WebService.tree.OutputTree',
    config: {
        connectionName: null,
        wsdlOffsetUrl: null,
        soapVersion: null,
        operationName: null,
        messageName: null
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_WebService_OutputTree_Title'),
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
            wsdlOffsetUrl: properties.wsdlOffsetUrl,
            soapVersion: properties.soapVersion,
            operationName: properties.operationName,
            messageName: properties.messageName
        });

        me.callParent(arguments);

        me.srcTree.on({
            fieldreset: function () {
                me.$refresh();
            }
        });
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateWsdlOffsetUrl: function (newValue) {
        this.dirty = true;
    },

    updateSoapVersion: function (newValue) {
        this.dirty = true;
    },

    updateOperationName: function (newValue) {
        this.dirty = true;
    },

    updateMessageName: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            wsdlOffsetUrl = me.getWsdlOffsetUrl(),
            soapVersion = me.getSoapVersion(),
            operationName = me.getOperationName(),
            messageName = me.getMessageName(),
            curSchema = me.srcTree.saveSchema(),
            schame;

        if (!wsdlOffsetUrl || Ext.isEmpty(soapVersion) || !operationName)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/WebService.ashx'),
            params: {
                method: 'GetOutputSchema',
                connectionName: connectionName,
                wsdlOffsetUrl: wsdlOffsetUrl,
                soapVersion: soapVersion,
                operationName: operationName,
                messageName: messageName
            },
            success: function (action) {
                schame = action.result;

                me.mergeSchema(schame, curSchema, function (obj) {
                    return obj.yzext && obj.yzext.decode && obj.yzext.decode.enabled ||
                        obj.yzext && obj.yzext.isDataSet;
                });

                me.setSrcSchema(schame);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    }
});