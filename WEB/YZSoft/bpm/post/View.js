
Ext.define('YZSoft.bpm.post.View', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.ProcessInfo'
    ],
    config: {
        path: null
    },
    tpl: Ext.create('Ext.XTemplate',
        '<tpl for=".">',
            '<div class="d-flex flex-row yz-dataview-item  {[xindex % 2 === 0 ? "yz-dataview-item-alt" : ""]} yz-dataview-item-processlist">',
                '<div class="flex-fill d-flex flex-column align-items-start leftcol">',
                    '<div class="yz-link processname">{ProcessName:text}</div>',
                    '<div class="desc">{Description}</div>',
                '</div>',
                '<div class="d-flex flex-column align-items-end rightcol">',
                    '<div class="d-flex flex-row align-items-center verrow">',
                        '<div class="ver">v{ProcessVersion}</div>',
                        '<div class="sp">|</div>',
                        '<div class="yz-nowrap favorite {[values.Favorited ? "favorited":""]}">' + RS.$('All_Post_AddFavorite') + '</div>',
                    '</div>',
                    '<div class="d-flex flex-row optrow">',
                        '<tpl if="YZSoft.modules.BPA !== false && RelatedFile">',
                        '<div class="yz-nowrap opt bpa">' + RS.$('All_SOP') + '</div>',
                        '</tpl>',
                        '<div class="yz-nowrap opt flowchart">' + RS.$('All_ProcessChart') + '</div>',
                        '<div class="yz-nowrap opt delegate">' + RS.$('All_Post_Delegate') + '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</tpl>'
    ),

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.ProcessInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetProcessesInFolder',
                    perm: 'Execute',
                    favorite: true
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                scope: me,
                load: function (store, records, successful, eOpts) {
                    var params = me.store.getProxy().getExtraParams(),
                        searchType = params.searchType,
                        kwd = params.kwd,
                        path = params.path,
                        total = store.getTotalCount(),
                        title;

                    if (searchType == 'QuickSearch' && kwd) {
                        title = Ext.String.format(RS.$('All_Post_Search_Result'), total, Ext.util.Format.text(kwd));
                    }
                    else {
                        path = path || RS.$('All_Root');
                        title = Ext.String.format(RS.$('All_Post_ProcessGrid_Title'), '<span style="color:#44bf8d;">' + path + '</span>')
                    }

                    me.setTitle(title);
                }
            }
        });

        me.view = Ext.create('Ext.view.View', {
            store: me.store,
            style: 'border-top:solid 2px #f0f0f0;',
            overItemCls: 'yz-dataview-item-over',
            itemSelector: 'div.yz-dataview-item',
            tpl: me.tpl,
            scrollable: true,
            listeners: {
                itemclick: function (view, record, item, index, e, eOpts) {
                    var target = me.getTarget(e);

                    if (target) {
                        e.stopEvent();
                        me.fireEvent(target + 'click', record, view, e);
                    }
                },
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    var target = me.getTarget(e);

                    if (target)
                        return;

                    me.fireEvent('itemdblclick', view, record, item, index, e, eOpts);
                }
            }
        });

        cfg = {
            store: me.store,
            ui:'light',
            header: {
                title: RS.$('All_Post_Tree_Title'),
                cls: 'yz-header-font-size-s'
            },
            tools: [{
                type: 'refresh',
                tooltip: RS.$('All_Refresh_Tip'),
                handler: function (event, toolEl, panel) {
                    me.store.reload({
                        loadMask: true
                    });
                }
            }],
            layout: 'fit',
            items: [me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getTarget: function (e) {
        var targets, rv;

        targets = {
            processname: e.getTarget('.processname'),
            flowchart: e.getTarget('.flowchart'),
            delegate: e.getTarget('.delegate'),
            favorite: e.getTarget('.favorite'),
            bpa: e.getTarget('.bpa')
        };

        Ext.Object.each(targets, function (name, value) {
            if (value) {
                rv = name;
                return false;
            }
        });

        return rv;
    },

    updatePath: function (value) {
        var me = this,
            extParams = me.store.getProxy().getExtraParams();

        Ext.apply(extParams, {
            path: value,
            searchType: '',
            kwd: '',
            start: 0
        });

        me.store.load();
    }
});
