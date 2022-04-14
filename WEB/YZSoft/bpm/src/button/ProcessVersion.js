
Ext.define('YZSoft.bpm.src.button.ProcessVersion', {
    extend: 'YZSoft.src.button.Button',
    requires: [
        'YZSoft.bpm.src.model.ProcessVersion'
    ],
    config: {
        processName: null,
        version: null
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            text: Ext.String.format(RS.$('All_Process_Version'), config.version),
            menu: {
                items: []
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/ProcessAdmin.ashx'),
            params: {
                method: 'GetProcessVersions',
                ProcessName: config.processName
            },
            success: function (action) {
                var versions = action.result,
                    items = [];

                Ext.each(versions, function (version) {
                    items.push({
                        text: Ext.String.format(RS.$('All_Process_Version_Short'), version.ProcessVersion),
                        version: version,
                        scope: me,
                        handler: 'onItemClick'
                    });
                });

                me.setMenu({
                    minWidth: 100,
                    showSeparator: false,
                    shadow: false,
                    items: items
                });
            }
        });
    },

    onItemClick: function (item) {
        var me = this,
            rec = item.version,
            version = rec.ProcessVersion;

        me.setText(Ext.String.format(RS.$('All_Process_Version'), version));
        me.fireEvent('itemClick', version, rec);
    }
});