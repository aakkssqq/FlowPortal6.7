/*
config
requestSchema,
responseSchema,
inputSchema,
outputSchema
*/

Ext.define('YZSoft.src.dialogs.CallWebService', {
    extend: 'Ext.window.Window',
    requires: [
        'YZSoft.src.dialogs.CallWebService.General',
        'YZSoft.src.dialogs.CallWebService.InputMap',
        'YZSoft.src.dialogs.CallWebService.OutputMap',
        'YZSoft.src.dialogs.CallWebService.Exception'
    ],
    layout: 'fit',
    cls: 'yz-window-size-s',
    width: 950,
    height: 608,
    modal: true,
    maximizable: true,
    bodyPadding: 0,
    referenceHolder: true,
    defaultRequestSchema: {
        Payload: {
            type: 'object',
            yzext: {
                isPayload: true
            },
            properties: {
            }
        }
    },
    defaultResponseSchema: {
        Response: {
            type: 'object',
            yzext: {
                isPayload: true
            },
            properties: {
                strReturnValue: {
                    type: 'string'
                },
                iReturnValue: {
                    type: 'integer'
                },
                fReturnValue: {
                    type: 'number'
                }
            }
        }
    },
    defaultInputSchema: {
        Payload: {
            type: 'object',
            yzext: {
                isPayload: true
            },
            properties: {
            }
        }
    },
    defaultOutputSchema: {
        Response: {
            type: 'object',
            yzext: {
                isResponse: true
            },
            properties: {
            }
        }
    },
    defaultData: {
        requestDataFormat: 'JSON',
        requestDataEncoding: 65001,
        responseDataFormat: 'JSON',
        responseDataEncoding: 65001,
        method:'GET'
    },
    generalPageTitle: RS.$('All_General'),
    inputMapPageTitle: RS.$('All_CallWebService_inputMapPageTitle'),
    outputMapPageTitle: RS.$('All_CallWebService_outputMapPageTitle'),
    exceptionPageTitle: RS.$('All_CallWebService_exceptionPageTitle'),
    labelWsdl: RS.$('All_CallWebService_labelWsdl'),
    requestTreeTitle: RS.$('All_CallWebService_requestTreeTitle'),
    webServiceInputTreeTitle: RS.$('All_CallWebService_webServiceInputTreeTitle'),
    webServiceOutputTreeTitle: RS.$('All_CallWebService_webServiceOutputTreeTitle'),
    responseTreeTitle: RS.$('All_CallWebService_responseTreeTitle'),

    constructor: function (config) {
        var me = this,
            data = config.data,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.src.dialogs.CallWebService.General', {
            title: me.generalPageTitle,
            padding: '20 26 0 26',
            labelWsdl: me.labelWsdl,
            listeners: {
                wsdlchange: function (wsdl) {
                    me.pnlInputMap.setWsdl(wsdl);
                    me.pnlOutputMap.setWsdl(wsdl);
                },
                portselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setSoapVersion(record.data.soapVersion);
                    me.pnlOutputMap.setSoapVersion(record.data.soapVersion);
                },
                opselect: function (combo, record, eOpts) {
                    me.pnlInputMap.setOperationName(record.data.name);
                    me.pnlInputMap.setMessageName(record.data.messageName);
                    me.pnlOutputMap.setOperationName(record.data.name);
                    me.pnlOutputMap.setMessageName(record.data.messageName);
                }
            }
        });

        me.pnlInputMap = Ext.create('YZSoft.src.dialogs.CallWebService.InputMap', {
            title: me.inputMapPageTitle,
            padding: '0 0 5 0',
            srcTreeTitle: me.requestTreeTitle,
            tagTreeTitle: me.webServiceInputTreeTitle,
            wsdl: data && data.wsdl,
            soapVersion: data && data.soapVersion,
            operationName: data && data.operationName,
            messageName: data && data.messageName,
            srcSchema: config.requestSchema || me.defaultRequestSchema,
            tagSchema: (data && data.inputSchema) || Ext.clone(me.defaultInputSchema)
        });

        me.pnlOutputMap = Ext.create('YZSoft.src.dialogs.CallWebService.OutputMap', {
            title: me.outputMapPageTitle,
            padding: '0 0 5 0',
            srcTreeTitle: me.webServiceOutputTreeTitle,
            tagTreeTitle: me.responseTreeTitle,
            wsdl: data && data.wsdl,
            soapVersion: data && data.soapVersion,
            operationName: data && data.operationName,
            messageName: data && data.messageName,
            srcSchema: (data && data.outputSchema) || Ext.clone(me.defaultOutputSchema),
            tagSchema: config.responseSchema || me.defaultResponseSchema
        });

        me.pnlException = Ext.create('YZSoft.src.dialogs.CallWebService.Exception', {
            title: me.exceptionPageTitle,
            padding: '25 26 5 26'
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlInputMap,
                me.pnlOutputMap,
                me.pnlException
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (data)
            me.fill(data);
        else
            me.fill(Ext.clone(me.defaultData));
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'wsdl,service,port,soapVersion,location,operationName,messageName'));
        me.pnlInputMap.fill(Ext.copyTo({}, data, 'inputCode,wsdl,soapVersion,operationName,messageName'));
        me.pnlOutputMap.fill(Ext.copyTo({}, data, 'outputCode,wsdl,soapVersion,operationName,messageName'));
        me.pnlException.fill(Ext.copyTo({}, data, 'exceptionExpress,errorCode,errorMessage'));
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        Ext.apply(data, me.pnlInputMap.save());
        Ext.apply(data, me.pnlOutputMap.save());
        Ext.apply(data, me.pnlException.save());

        if (data.wsdl) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/DesignTime/WebService.ashx'),
                params: {
                    method: 'GetHashCodeWSDL',
                    wsdl: data.wsdl
                },
                success: function (action) {
                    data.version = action.result;
                }
            });
        }

        return data;
    }
});