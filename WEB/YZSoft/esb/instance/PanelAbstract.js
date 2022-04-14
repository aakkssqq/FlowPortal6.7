
Ext.define('YZSoft.esb.instance.PanelAbstract', {
    extend: 'Ext.panel.Panel',
    rowClses: {
        Succeed: '',
        Running: 'yz-grid-row-running',
        Interrupted: 'yz-grid-row-warn'
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    renderTime: function (value, metaData, record) {
        return Ext.String.format('<span data-qtip="{1}">{0}</span >',
            Ext.Date.format(value,'H:i:s'),
            Ext.Date.format(value, RS.$('All_Date_Format_s'))
        );
    },

    renderUser: function (value, metaData, record) {
        if (value == 'sa')
            return RS.$('ESB_Instance_SaDisplayName');

        var me = this,
            data = record.data;

        return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="l50-r50">{1}</span>',
            Ext.util.Format.text(value),
            Ext.util.Format.text(data.UserDisplayName || value));
    },

    renderStatus: function (value) {
        return value;
    },

    renderAsync: function (value, metaData, record) {
        return value ? 'Y' : '';
    },

    openTask: function (taskId, config) {
        config = config || {};

        var me = this,
            panel;

        panel = YZSoft.ViewManager.addView(this, 'YZSoft.esb.trace.TracePanel', {
            title: config.title,
            id: 'ESBTask_' + taskId,
            taskId: taskId,
            listeners: {
                afterrun: function () {
                    me.store.reload({
                        loadMask: false
                    });
                }
            }
        });
    },

    openTaskByRecord: function (record) {
        var me = this;

        me.openTask(record.data.TaskID, {
            title: Ext.String.format('{0} - {1}', record.data.FlowName, record.data.TaskID)
        });
    },

    onItemDblClick: function (view, record, item, index, e, eOpts) {
        var me = this;

        me.openTaskByRecord(record);
    }
});
