/*
config:
    dlgConfig
*/

Ext.define('YZSoft.forms.field.AspxBrowserButton', {
    extend: 'YZSoft.forms.field.CustomBrowserButton',

    onClick: function (e) {
        var me = this,
            filters = me.getCurrentFilters(),
            params = {};

        for (var columnName in filters) {
            if (filters.hasOwnProperty(columnName)) {
                params[columnName] = filters[columnName].value;
                params[columnName+'op'] = filters[columnName].op;
            }
        }

        me.pnlIFrame = Ext.create('YZSoft.src.panel.IFramePanel', {
            url: me.url,
            params: params,
            listeners: {
                close: function (data) {
                    if (data.dialogResult == 'ok') {
                        me.dlg.closeDialog(data.returnValue);
                    }
                }
            }
        });

        me.dlg = Ext.create('Ext.window.Window', Ext.apply({ //666666
            title: RS.$('All_DataBrowserWindowTitle'),
            autoShow: true,
            layout: 'fit',
            maximizable: true,
            bodyPadding: 5,
            items: [me.pnlIFrame],
            fn: function (data) {
                me.mapvalues = data;
                me.agent.onDataAvailable(me);
            }
        }, me.dlgConfig));
    }
});