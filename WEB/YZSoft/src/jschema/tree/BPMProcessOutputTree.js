
Ext.define('YZSoft.src.jschema.tree.BPMProcessOutputTree', {
    extend: 'YZSoft.src.jschema.tree.BPMProcessTreeAbstract',
    schameTemplate: {
        Context: {
            type: 'object',
            properties: {
                LoginUser: {
                    type: 'object',
                    properties: {
                        Account: {
                            type:'string'
                        },
                        CostCenter: {
                            type: 'string'
                        },
                        DisplayName: {
                            type: 'string'
                        },
                        HRID: {
                            type: 'string'
                        }
                    }
                },
                Task: {
                    type: 'object',
                    properties: {
                        TaskID: {
                            type: 'integer'
                        },
                        ProcessName: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        Payload: {
            type: 'object',
            properties: {
            }
        }
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            menu;

        e.stopEvent();
    }
});