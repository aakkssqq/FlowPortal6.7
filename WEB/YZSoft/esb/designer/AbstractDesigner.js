/*
config
designMode, //new,edit
folder,
designMode = edit
flowName
*/

Ext.define('YZSoft.esb.designer.AbstractDesigner', {
    extend: 'YZSoft.esb.flowchart.AbstractPanel',

    constructor: function (config) {
        var me = this,
            config = config || {},
            mode = config.designMode;

        me.callParent(arguments);

        me.pnlProperty.relayEvents(me.drawContainer, ['selectionchange']);

        me.on({
            single: true,
            afterLayout: function () {
                if (mode == 'edit') {
                    me.openFlow(me.folder, me.flowName);
                }
                else {
                    me.loadNewDoc();
                }
            }
        });

        me.lastFlow = me.save(false);
    },

    isDirty: function () {
        var me = this,
            lastFlow = me.lastFlow,
            curFlow = me.save(false);

        delete lastFlow.Name;
        delete curFlow.Name;

        return Ext.encode(lastFlow) != Ext.encode(curFlow);
    },

    archiveNode: function (sprite, final) {
        return Ext.applyIf({
            Type: sprite.getType(),
            Name: sprite.sprites.text.attr.text
        }, sprite.archiveNode(final));
    },

    save: function (final) {
        var me = this,
            final = final !== false,
            surface = me.drawContainer.getSurface('main'),
            sprites = surface.getItems(),
            nodes = [];

        Ext.each(sprites, function (sprite) {
            if (sprite.attr.hidden)
                return;

            nodes.push(me.archiveNode(sprite, final));
        });

        return {
            Name: me.flowName,
            Nodes: nodes,
            Variables: me.flowProperties.Variables
        };
    },

    saveNew: function (fn) {
        var me = this,
            flow = me.save(),
            dlg;

        flow.author = {
            uid: userInfo.Account,
            name: userInfo.DisplayName || userInfo.Account,
            createat: new Date()
        };

        dlg = Ext.create('YZSoft.esb.designer.dialogs.SaveNewFileDlg', {
            autoShow: true,
            autoClose: false,
            fn: function (flowName) {
                dlg.hide();
                flow.Name = flowName;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: me.serviceUrl,
                    params: {
                        method: 'SaveNewObject',
                        folder: me.folder
                    },
                    jsonData: {
                        data: flow
                    },
                    waitMsg: {
                        msg: RS.$('All_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        me.lastFlow = Ext.clone(me.save(false));
                        me.designMode = 'edit';
                        me.flowName = flowName;

                        me.mask({
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: true,
                            fn: function () {
                                me.fireEvent('saved', 'new', flowName, action.result);
                                fn && fn(flowName, action.result, flow);
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(action.result.errorMessage, function () {
                            dlg.show();
                        });
                    }
                });
            }
        });
    },

    saveEdit: function (fn) {
        var me = this,
            flow = me.save();

        flow.lastModifier = {
            uid: userInfo.Account,
            name: userInfo.DisplayName || userInfo.Account,
            date: new Date()
        };

        YZSoft.Ajax.request({
            method: 'POST',
            url: me.serviceUrl,
            params: {
                method: 'SaveObject',
                folder: me.folder,
                orgObjectName: me.flowName
            },
            jsonData: {
                data: flow
            },
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.lastFlow = Ext.clone(me.save(false));

                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: true,
                    fn: function () {
                        me.fireEvent('saved', 'edit', me.flowName, action.result);
                        fn && fn(action.result);
                    }
                });
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage, function () {
                });
            }
        });
    },

    loadNewDoc: function () {
        var me = this;

        me.loadDoc(me.newFlowTemplate);
    }
});