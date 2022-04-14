/*
config
requestSchema,
responseSchema,
inputSchema,
outputSchema
*/

Ext.define('YZSoft.src.dialogs.CallRESTful', {
    extend: 'Ext.window.Window',
    requires: [
        'YZSoft.src.dialogs.CallRESTful.General',
        'YZSoft.src.dialogs.CallRESTful.InputMap',
        'YZSoft.src.dialogs.CallRESTful.OutputMap',
        'YZSoft.src.dialogs.CallRESTful.Exception'
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
    inputMapPageTitle: RS.$('All_CallRESTful_inputMapPageTitle'),
    outputMapPageTitle: RS.$('All_CallRESTful_outputMapPageTitle'),
    exceptionPageTitle: RS.$('All_CallRESTful_exceptionPageTitle'),
    labelUrl: RS.$('All_CallRESTful_labelUrl'),
    requestTreeTitle: RS.$('All_CallRESTful_requestTreeTitle'),
    RESTfulInputTreeTitle: RS.$('All_CallRESTful_RESTfulInputTreeTitle'),
    RESTfulOutputTreeTitle: RS.$('All_CallRESTful_RESTfulOutputTreeTitle'),
    responseTreeTitle: RS.$('All_CallRESTful_responseTreeTitle'),

    constructor: function (config) {
        var me = this,
            data = config.data,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.src.dialogs.CallRESTful.General', {
            title: me.generalPageTitle,
            padding: '20 26 0 26',
            labelUrl: me.labelUrl
        });

        me.pnlInputMap = Ext.create('YZSoft.src.dialogs.CallRESTful.InputMap', {
            title: me.inputMapPageTitle,
            padding: '0 0 5 0',
            srcTreeTitle: me.requestTreeTitle,
            tagTreeTitle: me.RESTfulInputTreeTitle,
            srcSchema: config.requestSchema || me.defaultRequestSchema,
            tagSchema: (data && data.inputSchema) || Ext.clone(me.defaultInputSchema)
        });

        me.pnlOutputMap = Ext.create('YZSoft.src.dialogs.CallRESTful.OutputMap', {
            title: me.outputMapPageTitle,
            padding: '0 0 5 0',
            srcTreeTitle: me.RESTfulOutputTreeTitle,
            tagTreeTitle: me.responseTreeTitle,
            srcSchema: (data && data.outputSchema) || Ext.clone(me.defaultOutputSchema),
            tagSchema: config.responseSchema || me.defaultResponseSchema
        });

        me.pnlException = Ext.create('YZSoft.src.dialogs.CallRESTful.Exception', {
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

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'url,method,requestDataFormat,requestDataEncoding,responseDataFormat,responseDataEncoding'));
        me.pnlInputMap.fill(Ext.copyTo({}, data, 'inputCode'));
        me.pnlOutputMap.fill(Ext.copyTo({}, data, 'outputCode'));
        me.pnlException.fill(Ext.copyTo({}, data, 'exceptionExpress,errorCode,errorMessage'));
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        Ext.apply(data, me.pnlInputMap.save());
        Ext.apply(data, me.pnlOutputMap.save());
        Ext.apply(data, me.pnlException.save());

        return data;
    }
});