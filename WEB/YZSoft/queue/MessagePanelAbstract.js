
Ext.define('YZSoft.queue.MessagePanelAbstract', {
    extend: 'Ext.panel.Panel',
    messageHandlers: {
        "BPM.Server.ESB.ESBFlow, BPM.Server": { //99199
            ESBOutputProcess: function (params) {
                return Ext.String.format('ESB/{0}', params[0].value);
            }
        }
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    renderMessageType: function (value, metaData, record) {
        var me = this,
            handlerType = me.messageHandlers[record.data.HandlerType],
            handler = handlerType && handlerType[record.data.HandlerMethod];

        if (handler)
            return handler(record.data.Params);

        return value;
    },

    renderTime: function (value, metaData, record) {
        return Ext.String.format('<span data-qtip="{1}">{0}</span >',
            Ext.Date.format(value,'H:i:s'),
            Ext.Date.format(value, RS.$('All_Date_Format_s'))
        );
    },

    renderRetryCount: function (value, metaData, record) {
        return value == 0 ? '':value;
    },

    renderErr: function (value, metaData, record) {
        return Ext.String.format('<span data-qtip="{0}">{0}</span >',
            Ext.util.Format.text(value)
        );
    },

    renderTicks: function (value) {
        return value;
    }
});
