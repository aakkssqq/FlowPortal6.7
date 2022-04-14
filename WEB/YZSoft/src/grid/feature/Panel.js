/*
config
panels: 定义什么样的行，需要创建panel,以及创建什么panel,例如：
    panels: [{
        showAsPanel: function (record) {
            return record.data.isTable;
        },
        createPanel: function (record, renderTo) {
            return Ext.create('Ext.panel.Panel', {
                height: 30,
                renderTo: renderTo
            });
        }
    }]
*/
Ext.define('YZSoft.src.grid.feature.Panel', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.panelrow',
    eventSelector: '.yz-datasetschemagrid-cell-type',
    panels: [],

    rowTpl: [
        '{%',
            'var me = this.feature,',
                'colspan = "colspan=" + values.columns.length;',

            'me.setupRowData(values.record, values.rowIndex, values);',
        '%}',
        '<tpl if="showAsPanel">',
            '<tr><td {[colspan]} class="yz-datasetschemagrid-cell-type"></td></tr>',
        '<tpl else>',
            '{%this.nextTpl.applyOut(values, out, parent);%}',
        '</tpl>', {
            priority: 100
        }
    ],

    init: function (grid) {
        var me = this,
            view = me.view,
            store = view.getStore();

        me.callParent(arguments);
        view.addRowTpl(Ext.XTemplate.getTpl(me, 'rowTpl')).feature = me;

        view.on({
            scope: me,
            refresh: function () {
                Ext.each(me.panels, function (paneldef) {
                    store.each(function (rec) {
                        if (paneldef.showAsPanel(rec) && !rec.customPanel) {
                            var node = Ext.fly(view.getNode(rec));
                            if (node) {
                                var renderTo = node.down('.yz-datasetschemagrid-cell-type');
                                rec.customPanel = paneldef.createPanel(rec, renderTo);
                                rec.customPanel.record = rec;
                            }
                        }
                    });
                });
            },
            itemadd: function (records, index, node, eOpts) {
                Ext.each(me.panels, function (paneldef) {
                    Ext.each(records, function (rec) {
                        if (paneldef.showAsPanel(rec) && !rec.customPanel) {
                            var node = Ext.fly(view.getNode(rec));
                            if (node) {
                                var renderTo = node.down('.yz-datasetschemagrid-cell-type');
                                rec.customPanel = paneldef.createPanel(rec, renderTo);
                                rec.customPanel.record = rec;
                            }
                        }
                    });
                });
            },
            itemremove: function (records, index, item, view, eOpts) {
                Ext.each(records, function (rec) {
                    //66166 ExtJS6 BUG itemremove 事件中records集合中均为null
                    if (rec && rec.customPanel) {
                        rec.customPanel.destroy();
                        delete rec.customPanel;
                    }
                });
            },
            beforedestroy: function (comp, eOpts) {
                grid.getStore().each(function (rec) {
                    if (rec.customPanel) {
                        rec.customPanel.destroy();
                        delete rec.customPanel;
                    }
                });
            },
            resize: me.onSizeChanged
        });

        grid.on({
            scope: me,
            columnresize: me.onSizeChanged
        });
    },

    setupRowData: function (record, idx, rowValues) {
        var me = this,
            data = record.data;

        rowValues.showAsPanel = false;
        Ext.each(me.panels, function (paneldef) {
            if (paneldef.showAsPanel(record)) {
                rowValues.showAsPanel = true;
                return false;
            }
        });
    },

    onSizeChanged: function () {
        var me = this,
            view = me.view,
            store = view.getStore();

        store.each(function (rec) {
            if (rec.customPanel) {
                rec.customPanel.setWidth(view.body.getWidth());
                rec.customPanel.updateLayout();
            }
        });
    }
});