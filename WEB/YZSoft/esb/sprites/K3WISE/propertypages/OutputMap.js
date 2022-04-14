
Ext.define('YZSoft.esb.sprites.K3WISE.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass:'YZSoft.esb.sprites.K3WISE.tree.OutputTree',
    config: {
        connectionName: null,
        api: null,
        method: null
    },
    schemas: {
        GetList: {
            Response: {
                type: 'object',
                yzext: {
                    isResponse: true
                },
                properties: {
                    StatusCode: {
                        type: 'string'
                    },
                    Message: {
                        type: 'string'
                    },
                    Data: {
                        type: 'object',
                        properties: {
                            RowCount: {
                                type: 'integer'
                            },
                            PageSize: {
                                type: 'integer'
                            },
                            PageIndex: {
                                type: 'integer'
                            },
                            Data: {
                                type: 'array',
                                yzext: {
                                    isUnknowTable: true
                                },
                                items: {
                                    type: 'object',
                                    properties: {
                                    }
                                }
                            },
                            ROWCOUNT: {
                                type: 'integer'
                            },
                            PAGESIZE: {
                                type: 'integer'
                            },
                            PAGEINDEX: {
                                type: 'integer'
                            },
                            DATA: {
                                type: 'array',
                                yzext: {
                                    isUnknowTable: true
                                },
                                items: {
                                    type: 'object',
                                    properties: {
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        GetDetail: {
            Response: {
                type: 'object',
                yzext: {
                    isResponse: true
                },
                properties: {
                    StatusCode: {
                        type: 'string'
                    },
                    Message: {
                        type: 'string'
                    }
                }
            }
        },
        Save: {
            Response: {
                type: 'object',
                yzext: {
                    isResponse: true
                },
                properties: {
                    StatusCode: {
                        type: 'string'
                    },
                    Message: {
                        type: 'string'
                    }
                }
            }
        },
        Update: {
            Response: {
                type: 'object',
                yzext: {
                    isResponse: true
                },
                properties: {
                    StatusCode: {
                        type: 'string'
                    },
                    Message: {
                        type: 'string'
                    }
                }
            }
        },
        Delete: {
            Response: {
                type: 'object',
                yzext: {
                    isResponse: true
                },
                properties: {
                    StatusCode: {
                        type: 'string'
                    },
                    Message: {
                        type: 'string'
                    }
                }
            }
        },
        CheckBill: {
            Response: {
                type: 'object',
                yzext: {
                    isResponse: true
                },
                properties: {
                    StatusCode: {
                        type: 'string'
                    },
                    Message: {
                        type: 'string'
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
            title: RS.$('ESB_K3WISE_OutputTree_Title'),
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
            root = me.srcTree.getRootNode(),
            schema = root && root.save(),
            response = schema && schema.properties && schema.properties.Response,
            curParams = response && response.yzext && response.yzext.curParams;

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

            schema.Response.yzext = schema.Response.yzext || {};
            schema.Response.yzext.curParams = curParams;
        };

        switch (method) {
            case 'GetList':
                schema = Ext.clone(me.schemas.GetList);
                applyParams(schema);
                me.setSrcSchema(schema);
                cfg && cfg.fn && cfg.fn();
                break;
            case 'GetDetail':
                YZSoft.Ajax.request(Ext.apply({
                    url: YZSoft.$url('YZSoft.Services.REST/DesignTime/K3WISE.ashx'),
                    params: {
                        method: 'GetTemplate',
                        connectionName: connectionName,
                        api: api
                    },
                    success: function (action) {
                        schema = Ext.clone(me.schemas.GetDetail);
                        schema.Response.properties = action.result.properties;
                        applyParams(schema);
                        me.setSrcSchema(schema);
                        cfg && cfg.fn && cfg.fn();
                    }
                }, cfg));
                break;
            case 'Save':
                schema = Ext.clone(me.schemas.Save);
                applyParams(schema);
                me.setSrcSchema(schema);
                cfg && cfg.fn && cfg.fn();
            case 'Update':
                schema = Ext.clone(me.schemas.Update);
                applyParams(schema);
                me.setSrcSchema(schema);
                cfg && cfg.fn && cfg.fn();
            case 'Delete':
                schema = Ext.clone(me.schemas.Delete);
                applyParams(schema);
                me.setSrcSchema(schema);
                cfg && cfg.fn && cfg.fn();
            case 'CheckBill':
                schema = Ext.clone(me.schemas.CheckBill);
                applyParams(schema);
                me.setSrcSchema(schema);
                cfg && cfg.fn && cfg.fn();
        }
    }
});