
Ext.define('YZSoft.bpa.admin.TemplateAdminPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: [{
                    text: RS.$('BPA_AdminMenu_ReportTemplate'), expandable: false, expanded: true, children: [
                       { text: RS.$('BPA_AdminMenu_ReportTemplate_SOP'), path: 'SOP', leaf: true, showModule: 'showReportTemplateModule' },
                       { text: RS.$('BPA_AdminMenu_ReportTemplate_PositionManual'), path: 'PositionManual', leaf: true, showModule: 'showReportTemplateModule' },
                       { text: RS.$('BPA_AdminMenu_ReportTemplate_ActivityManual'), path: 'ActivityManual', leaf: true, showModule: 'showReportTemplateModule' }
                   ]
                }, { text: RS.$('BPA_AdminMenu_ProcessTemplate'), expandable: false, expanded: true, children: [
                       { text: RS.$('BPA_FileType_BPMN'), path: 'BPMN', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_EVC'), path: 'EVC', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_FlowChart'), path: 'FlowChart', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_ORG'), path: 'Org', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_Data'), path: 'Data', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_ITSystem'), path: 'ITSystem', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_Product'), path: 'Product', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_Risk'), path: 'Risk', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: RS.$('BPA_FileType_Regulation'), path: 'Regulation', leaf: true, showModule: 'showFileTemplateModule' },
                       { text: 'KPI', path: 'KPI', leaf: true, showModule: 'showFileTemplateModule' }
                   ]
                }
                ]
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            cls: 'yz-tree-modules',
            border: false,
            store: me.store,
            rootVisible: false,
            useArrows: true,
            hideHeaders: true,
            cls:'bpa-tree-template',
            listeners: {
                scope: me,
                beforeselect: function (sm, record, index, eOpts) {
                    if (!record.data.showModule)
                        return false;
                },
                selectionchange: function (sm, selected, eOpts) {
                    var me = this,
                        cnt = me.pnlModule,
                        rec = selected[0],
                        handler = rec && rec.data.showModule;

                    if (!handler)
                        return;

                    me[handler](rec);
                }
            }
        });

        me.tree.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    sm = this.getSelectionModel();

                sm.select(root.firstChild.firstChild);
            }
        });

        me.pnlMenu = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_Navigate'),
            border: false,
            header: false,
            width: 240,
            region: 'west',
            layout: 'fit',
            split: {
                cls: 'yz-splitter-light',
                size: 4,
                collapsible: true
            },
            style: 'background-color:#fff;',
            items: [me.tree],
            listeners: {
                element: 'body',
                contextmenu: function (e, t, eOpts) {
                    e.preventDefault();
                }
            }
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlMenu, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    showReportTemplateModule: function (record) {
        var me = this,
            cnt = me.pnlModule;

        cnt.showModule({
            xclass: 'YZSoft.src.lib.viewer.OSDocumentViewer',
            config: {
                root: 'BPAReportTemplates',
                path: record.data.path
            },
            match: function (item) {
                return false;
            }
        });
    },

    showFileTemplateModule: function (record) {
        var me = this,
            cnt = me.pnlModule;

        cnt.showModule({
            xclass: 'YZSoft.bpa.admin.filetemplate.Panel',
            config: {
                path: record.data.path,
                moduleName: record.data.text
            },
            match: function (item) {
                return false;
            }
        });
    }
});