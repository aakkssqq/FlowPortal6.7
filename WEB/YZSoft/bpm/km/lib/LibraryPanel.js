
/*
config
    libid
*/
Ext.define('YZSoft.bpm.km.lib.LibraryPanel', {
    extend: 'YZSoft.bpa.src.panel.LibraryPanel',
    readOnly: true,
    split: {
        cls: 'yz-splitter-light-l',
        size: 4,
        collapsible: false
    },

    constructor: function (config) {
        var me = this,
            cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
            params: {
                method: 'GetLibrary',
                libid: config.libid
            },
            success: function (action) {
                me.libInfo = action.result;
            }
        });

        cfg = {
            storeConfig: {
                root: {
                    text: me.libInfo.Name,
                    path: me.libInfo.FolderID,
                    FolderType: 'BPALibrary'
                }
            }
        };

        cfg = Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getXClass: function () {
        return 'YZSoft.bpm.km.lib.FolderViewer';
    },

    getViewConfig: function (record) {
        var me = this;

        return {
            padding: '0 0 0 40'
        };
    },
});