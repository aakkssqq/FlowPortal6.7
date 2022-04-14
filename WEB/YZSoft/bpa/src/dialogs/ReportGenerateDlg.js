/*
config:
groupid
*/

Ext.define('YZSoft.bpa.src.dialogs.ReportGenerateDlg', {
    extend: 'Ext.window.Window', //未使用
    requires: [
        'YZSoft.bpa.src.model.Folder',
        'YZSoft.bpa.src.model.Sprite'
    ],
    title: RS.$('BPA__ReportGenerator'),
    padding: '6 6 3 6',
    width: 740,
    height: 450,
    minWidth: 740,
    minHeight: 450,
    plain: true,
    modal: true,
    //bodyStyle: 'padding:15px;',
    buttonAlign: 'right',
    border: false,
    langs: RS.$('All_Languages').split(','),
    docTypes: [{
        text: RS.$('BPA__ReportType_RiskControl'),
        expandable: true,
        expanded: true,
        children: [
            { text: RS.$('BPA__ReportType_RiskControl_Manual'), leaf: true, xclass: 'YZSoft.bpa.processreport.RiskPanel' }
        ]
    }, {
        text: RS.$('BPA_PositionManual'),
        expandable: true,
        expanded: true,
        children: [
            { text: RS.$('BPA__ReportType_PositionManual_Horiz'), leaf: true, xclass: 'YZSoft.bpa.processreport.RiskPanel' },
            { text: RS.$('BPA__ReportType_PositionManual_Vert'), leaf: true }
        ]
    }, {
        text: RS.$('BPA__ReportType_RACI'),
        expandable: true,
        expanded: true,
        children: [
            { text: RS.$('BPA__ReportType_RACI_Process'), leaf: true },
            { text: RS.$('BPA__ReportType_RACI_OrgAndProcess'), leaf: true },
            { text: RS.$('BPA__ReportType_RACI_OrgAndActivity'), leaf: true }
        ]
    }, {
        text: RS.$('All_SOP'),
        expandable: true,
        expanded: true,
        children: [
            { text: RS.$('BPA__ReportType_SOP_SOP'), leaf: true, xclass: 'YZSoft.bpa.processreport.SOPPanel' },
        ]
    }],

    constructor: function (config) {
        var me = this,
            langs = config.langs || me.langs,
            langItems = [];

        config = config || {};

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'Ext.data.TreeModel',
            root: {
                expanded: true,
                children: me.docTypes
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', Ext.apply({
            region: 'west',
            width: 250,
            store: me.store,
            rootVisible: true,
            useArrows: true,
            border: true,
            hideHeaders: true,
            split: { size: 4 },
            viewConfig: {
                loadMask: false,
                rootVisible: false
            },
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1
            }]
        }, config.treeConfig));

        Ext.each(langs, function (lang) {
            langItems.push({
                value: lang,
                text: RS.$('All_Languages_' + lang)
            });
        });

        me.chkLang = Ext.create('Ext.button.Segmented', {
            defaults: {
                minWidth: 80
            },
            value: langs[0],
            items: langItems,
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        });

        me.edtName = Ext.create('Ext.form.field.Text', {
            flex: 1,
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        });

        me.pnlGeneral = Ext.create('Ext.container.Container', {
            region: 'north',
            margin: 0,
            padding: 0,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                border: false
            },
            items: [{
                items: [{ xtype: 'displayfield', value: RS.$('BPA__ReportName'), width: 100 }, me.edtName]
            }, {
                margin: '1 0 0 0',
                hidden: true,
                items: [{ xtype: 'displayfield', value: RS.$('All_Language'), width: 100 }, me.chkLang]
            }]
        });

        me.pnlContainer = Ext.create('Ext.container.Container', {
            region: 'center',
            layout: 'card'
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            padding: '4 20',
            disabled: true,
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            padding: '4 20',
            handler: function () {
                me.close();
            }
        });

        var cfg = {
            layout: 'border',
            items: [me.tree, {
                xtype: 'panel',
                bodyStyle: 'background-color:white',
                bodyPadding: '15',
                border: true,
                region: 'center',
                layout: 'border',
                items: [me.pnlGeneral, me.pnlContainer]
            }],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.tree.on({
            scope: me,
            selectionchange: 'onSelectionChange'
        });
    },

    onSelectionChange: function (sm, selected, eOpts) {
        var me = this;

        if (selected.length == 1) {
            var rec = selected[0];

            if (rec.data.leaf && rec.data.xclass) {
                if (!rec.panel) {
                    rec.panel = Ext.create(rec.data.xclass, Ext.apply({
                        groupid: me.groupid,
                        border: false,
                        labelWidth: 95,
                        padding: '3 0 0 0',
                        style: 'background-color:white',
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, rec.data.pnlConfig));

                    me.pnlContainer.add(rec.panel);
                }

                me.pnlContainer.setActiveItem(rec.panel);
            }
        }
    },

    updateStatus: function () {
        var me = this,
            pnl = me.pnlContainer.getLayout().getActiveItem(),
            data = me.save();

        me.btnOK.setDisabled(!data.name || !pnl || !pnl.isValid(data));
    },

    save: function () {
        var me = this,
            pnl = me.pnlContainer.getLayout().getActiveItem(),
            data = pnl && pnl.save();

        data = data || {};

        Ext.apply(data, {
            name: me.edtName.getValue()
        });

        if (data.processRange) {
            data.isFile = data.processRange.isFile;
            if (data.processRange.isFile)
                data.fileid = data.processRange.fileid
            else
                data.folderid = data.processRange.folderid

            delete data.processRange;
        }

        return data;
    }
});