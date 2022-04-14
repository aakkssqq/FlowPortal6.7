
Ext.define('YZSoft.esb.sprites.K3WISE.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.K3WISE.tree.InputTree',
    config: {
        connectionName: null,
        api: null,
        method: null
    },
    schemas: {
        GetList: {
            Payload: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    Data: {
                        type: 'object',
                        properties: {
                            Top: {
                                type: 'string'
                            },
                            PageSize: {
                                type: 'string'
                            },
                            PageIndex: {
                                type: 'string'
                            },
                            Filter: {
                                type: 'string'
                            },
                            OrderBy: {
                                type: 'string'
                            },
                            SelectPage: {
                                type: 'string'
                            },
                            Fields: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        GetDetail: {
            Payload: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    Data: {
                        type: 'object',
                        properties: {
                            FBillNo: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        Save: {
            Payload: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                }
            }
        },
        Update: {
            Payload: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    FBillNo: {
                        type: 'string'
                    }
                }
            }
        },
        Delete: {
            Payload: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    Data: {
                        type: 'object',
                        properties: {
                            FBillNo: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        CheckBill: {
            Payload: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    Data: {
                        type: 'object',
                        properties: {
                            FBillNo: {
                                type: 'string'
                            },
                            FChecker: {
                                type: 'string'
                            },
                            FCheckDirection: {
                                type: 'string'
                            },
                            FDealComment: {
                                type: 'string'
                            }
                        }
                    }
                }
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
            title: RS.$('ESB_K3WISE_InputTree_Title'),
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
            api: properties.api,
            method: properties.method
        });

        me.callParent(arguments);
    },

    updateConnectionName: function (newValue) {
        this.dirty = true;
    },

    updateApi: function (newValue) {
        this.dirty = true;
    },

    updateMethod: function (newValue) {
        this.dirty = true;
    },

    $refresh: function (cfg) {
        var me = this,
            connectionName = me.getConnectionName(),
            api = me.getApi(),
            method = me.getMethod(),
            root = me.tagTree.getRootNode(),
            schema = root && root.save(),
            payload = schema && schema.properties && schema.properties.Payload,
            curParams = payload && payload.yzext && payload.yzext.curParams;

        if (!connectionName || !api || !method)
            return;

        if (curParams &&
            //curParams.connectionName == connectionName && 换连接不刷新架构
            curParams.api == api &&
            curParams.method == method)
            return;

        var applyParams = function (schema) {
            curParams = {
                connectionName: connectionName,
                api: api,
                method: method
            };

            schema.Payload.yzext = schema.Payload.yzext || {};
            schema.Payload.yzext.curParams = curParams;
        };

        switch (method) {
            case 'GetList':
                schema = Ext.clone(me.schemas.GetList);
                applyParams(schema);
                me.setTagSchema(schema);
                cfg && cfg.fn && cfg.fn();
                break;
            case 'GetDetail':
                schema = Ext.clone(me.schemas.GetDetail);
                applyParams(schema);
                me.setTagSchema(schema);
                cfg && cfg.fn && cfg.fn();
                break;
            case 'Save':
                YZSoft.Ajax.request(Ext.apply({
                    url: YZSoft.$url('YZSoft.Services.REST/DesignTime/K3WISE.ashx'),
                    params: {
                        method: 'GetTemplate',
                        connectionName: connectionName,
                        api: api
                    },
                    success: function (action) {
                        schema = Ext.clone(me.schemas.Save);
                        schema.Payload.properties = action.result.properties;
                        applyParams(schema);
                        me.setTagSchema(schema);
                        cfg && cfg.fn && cfg.fn();
                    }
                }, cfg));
                break;
            case 'Update':
                YZSoft.Ajax.request(Ext.apply({
                    url: YZSoft.$url('YZSoft.Services.REST/DesignTime/K3WISE.ashx'),
                    params: {
                        method: 'GetTemplate',
                        connectionName: connectionName,
                        api: api
                    },
                    success: function (action) {
                        schema = Ext.clone(me.schemas.Update);
                        schema.Payload.properties = action.result.properties;
                        applyParams(schema);
                        me.setTagSchema(schema);
                        cfg && cfg.fn && cfg.fn();
                    }
                }, cfg));
                break;
            case 'Delete':
                schema = Ext.clone(me.schemas.Delete);
                applyParams(schema);
                me.setTagSchema(schema);
                cfg && cfg.fn && cfg.fn();
                break;
            case 'CheckBill':
                schema = Ext.clone(me.schemas.CheckBill);
                applyParams(schema);
                me.setTagSchema(schema);
                cfg && cfg.fn && cfg.fn();
                break;
        }
    }
});