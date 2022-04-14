/*
config:
folder
objectName
*/
Ext.define('YZSoft.connection.connections.DlgAbstract', {
    extend: 'Ext.window.Window', //222222
    width: 712,
    modal: true,
    resizable: false,
    bodyPadding: '26 26 21 26',
    buttonAlign: 'right',
    referenceHolder: true,
    defaultFocus: '[defaultfocusfield=true]',
    serviceUrl: YZSoft.$url('YZSoft.Services.REST/Connections/Admin.ashx'),
    onLoad: Ext.emptyFn,

    initComponent: function () {
        var me = this,
            mode = me.mode = 'objectName' in me ? 'edit' : 'new';

        me.btnTest = me.createTestButton();
        me.btnSave = me.createSaveButton();
        me.btnReset = me.createResetButton();
        me.buttons = [me.btnTest, me.btnSave, me.btnReset];

        me.callParent(arguments);

        if (mode == 'new') {
            me.getViewModel().set(Ext.clone(me.default));
        }
        else {
            YZSoft.Ajax.request({
                url: me.serviceUrl,
                params: {
                    method: 'GetObjectDefine',
                    folder: me.folder,
                    objectName: me.objectName
                },
                success: function (action) {
                    me.default = {
                        r: action.result
                    };
                    me.getViewModel().set(Ext.clone(me.default));
                    me.onLoad(action.result);
                    me.fireEvent('loaded', action.result);
                }
            });
        }
    },

    createTestButton: function () {
        return Ext.create('Ext.button.Button', {
            text: RS.$('Connection_Testing'),
            glyph: 0xe997,
            disabled: true,
            bind: {
                disabled: '{testdisabled}'
            },
            scope: this,
            handler: 'onTestClick'
        });
    },

    createSaveButton: function () {
        return Ext.create('Ext.button.Button', {
            text: RS.$('Connection_Save'),
            cls: 'yz-btn-default',
            glyph: 0xe616,
            disabled: true,
            bind: {
                disabled: '{savedisabled}'
            },
            scope: this,
            handler: 'onSaveClick'
        });
    },

    createResetButton: function () {
        return Ext.create('Ext.button.Button', {
            text: RS.$('All_Reset'),
            glyph: 0xe60f,
            scope: this,
            handler: 'onResetClick'
        });
    },

    save: function () {
        var me = this,
            rv = me.getViewModel().getData().r,
            classNames = me.$className.split('.');

        rv.Type = classNames[classNames.length - 2];
        return rv;
    },

    submit: function (fn, scope) {
        var me = this,
            mode = me.mode,
            data = me.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: me.serviceUrl,
            params: mode == 'new' ? {
                method: 'SaveNewObject',
                folder: me.folder
            } : {
                method: 'SaveObject',
                folder: me.folder,
                orgObjectName: me.objectName
            },
            jsonData: {
                data:data
            },
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: true,
                    fn: function () {
                        fn && fn.call(scope, data);
                    }
                });
            }
        });
    },

    onTestClick: function () {
        var me = this,
            data = me.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: me.serviceUrl,
            params: {
                method: 'TestConnection'
            },
            jsonData: data,
            waitMsg: {
                msg: RS.$('Connection_LoadMask_Testing'),
                target: me,
                start: 0
            },
            success: function (action) {
                if (action.result.result)
                    YZSoft.alert(RS.$('Connection_Testing_Succeed'));
                else
                    YZSoft.alert(action.result.message);
            }
        });
    },

    onSaveClick: function () {
        var me = this;

        me.submit(function (data) {
            me.closeDialog(data);
        });
    },

    onResetClick: function () {
        var me = this;

        me.getViewModel().set(Ext.clone(me.default));
    }
});