/*
config:
*/
Ext.define('YZSoft.src.dialogs.CallWebService.InputMap', {
    extend: 'YZSoft.src.jmap.MapAbstract',
    referenceHolder: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    srcTreeXClass: 'YZSoft.src.jschema.tree.SpecificSchemaOutputTree',
    tagTreeXClass: 'YZSoft.src.jschema.tree.SpecificSchemaInputTree',
    config: {
        wsdl: null,
        soapVersion: null,
        operationName: null,
        messageName: null
    },

    constructor: function (config) {
        var me = this;

        me.srcTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: config.srcTreeTitle
            },
            decodable: false,
            width: 260
        };

        me.tagTreeConfig = {
            header: {
                padding: '14 10 2 16',
                title: config.tagTreeTitle,
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
            },
            decodable: false,
            width: 260
        };

        me.callParent(arguments);

        me.tagTree.on({
            fieldreset: function () {
                me.$refresh();
            }
        });
    },

    updateWsdl: function (newValue) {
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
            wsdl = me.getWsdl(),
            soapVersion = me.getSoapVersion(),
            operationName = me.getOperationName(),
            messageName = me.getMessageName(),
            curSchema = me.tagTree.saveSchema(),
            schame;

        if (!wsdl || Ext.isEmpty(soapVersion) || !operationName)
            return;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/WebService.ashx'),
            params: {
                method: 'GetInputSchemaWSDL',
                wsdl: wsdl,
                soapVersion: soapVersion,
                operationName: operationName,
                messageName: messageName
            },
            success: function (action) {
                schame = action.result;

                me.mergeSchema(schame, curSchema, function (obj) {
                    return obj.yzext && obj.yzext.encode && obj.yzext.encode.enabled;
                });

                me.setTagSchema(schame);
                cfg && cfg.fn && cfg.fn();
            }
        }, cfg));
    },

    fill: function (data) {
        var me = this;

        me.setJsmCode(data.inputCode);
    },

    save: function () {
        var me = this;

        return {
            inputSchema: me.tagTree.saveSchema(),
            inputCode: me.getJsmCode()
        };
    }
});