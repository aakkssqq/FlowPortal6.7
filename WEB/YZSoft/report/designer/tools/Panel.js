
Ext.define('YZSoft.report.designer.tools.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.report.model.DSNode',
        'Ext.dd.StatusProxy'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            root: {
                text: RS.$('All_DataSource'),
                expanded: true
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: false,
            listeners: {
                scope: me,
                validateedit: 'onValidateEdit'
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            flex: 1,
            plugins: [me.cellEditing],
            cls: ['yz-tree-transparent', 'yz-tree-reportdesigner-datasource'],
            store: me.store,
            rootVisible: false,
            useArrows: true,
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                margin: '0 20 0 0',
                editor: { xtype: 'textfield' },
                renderer: function (v, metaData, record) {
                    if (record.data.isColumn)
                        return Ext.String.format('{0}<span class="yz-treeitem-column-datatype">({1})</span>', v, record.data.tag.DataType.name);
                    else if (record.data.isParam) {
                        return Ext.String.format('{0}<span class="yz-treeitem-column-datatype">({1})</span>', v, (record.data.tag.dataType && record.data.tag.dataType.name) || 'String');
                    }
                    else
                        return v;
                }
            }],
            viewConfig: {
                padding: '20 0',
            },
            listeners: {
                scope: me,
                itemcontextmenu: 'onItemContextMenu',
                beforeselect: function (sm, record, index, eOpts) {
                }
            }
        });

        me.btnAddDataSource = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_AddDataSource'),
            cls: 'yz-btn-submit yz-btn-round3',
            glyph: 0xeaf1,
            padding: '9 10',
            handler: function () {
                me.doAddDataSource();
            }
        });

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                me.tree, {
                    xtype: 'container',
                    padding: '15 20',
                    layout: 'fit',
                    items: [me.btnAddDataSource]
                }
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        //me.addDataSource({
        //    dsid: me.nextid(RS.$('All_DataSource')),
        //    ds: {
        //        datasourceName: 'Default',
        //        query: 'SELECT Location,UserName,sum(Sales1) Sales1,sum(Sales2) Sales2,sum(Sales3) Sales3,max(Date) Date FROM Table1 WHERE @UserName IS NULL OR UserName=@UserName group by Location,UserName ORDER BY Location',
        //        queryParams: [{
        //            Name: '@UserName',
        //            DataType: null,
        //            DisplayName: null,
        //            Description: null,
        //            ParameterUIBindType: 'Normal'
        //        }]
        //    }
        //});

        //me.addDataSource({
        //    dsid: me.nextid(RS.$('All_DataSource')),
        //    ds: {
        //        datasourceName: 'Default',
        //        tableName: 'A'
        //    }
        //});

        me.tree.on({
            single: true,
            afterRender: function () {
                me.ddel1 = document.createElement('div');
                me.ddel1.className = 'yz-dd-wrap';
                me.drag1 = Ext.create('Ext.dd.DragZone', me.tree.el.dom, {
                    ddGroup: 'report_ds_resultcolumn',
                    proxy: new Ext.dd.StatusProxy({
                        animRepair: false
                    }),
                    getDragData: function (e) {
                        var target = e.getTarget('.x-tree-node-text', null, true),
                            node = target && target.up('.x-grid-item'),
                            record = node && me.tree.getView().getRecord(node),
                            isColumn = record && record.data.isColumn,
                            dsNode = isColumn && record.parentNode.parentNode;

                        if (isColumn) {
                            return {
                                event: e,
                                ddel: me.ddel1,
                                fromToolbar: true,
                                dsNode: dsNode,
                                record: record
                            };
                        }
                    },
                    onInitDrag: function (x, y) {
                        Ext.fly(me.ddel1).setHtml(Ext.String.format('<div class="yz-dd-report-ds-resultcolumn">{0}</div>', this.dragData.record.data.text));
                        this.proxy.update(me.ddel1);
                        this.onStartDrag(10, 10);
                    }
                });

                me.ddel2 = document.createElement('div');
                me.ddel2.className = 'yz-dd-wrap';
                me.drag2 = Ext.create('Ext.dd.DragZone', me.tree.el.dom, {
                    ddGroup: 'report_ds_param',
                    proxy: new Ext.dd.StatusProxy({
                        animRepair: false
                    }),
                    getDragData: function (e) {
                        var target = e.getTarget('.x-tree-node-text', null, true),
                            node = target && target.up('.x-grid-item'),
                            record = node && me.tree.getView().getRecord(node),
                            isParam = record && record.data.isParam,
                            dsNode = isParam && record.parentNode.parentNode;

                        if (isParam) {
                            return {
                                event: e,
                                ddel: me.ddel2,
                                fromToolbar: true,
                                dsNode: dsNode,
                                record: record,
                                ctype: 'report.search.field.text',
                                height: 67,
                                width: 180
                            };
                        }
                    },
                    onInitDrag: function (x, y) {
                        Ext.fly(me.ddel2).setHtml(Ext.String.format('<div class="yz-dd-report-ds-param">{0}</div>', this.dragData.record.data.text));
                        this.proxy.update(me.ddel2);
                        this.onStartDrag(10, 10);
                    }
                });
            }
        });
    },

    addDataSource: function (ds) {
        var me = this,
            root = me.tree.getRootNode(),
            dsNode, columnsNode, paramsNode;

        dsNode = YZSoft.report.model.DSNode.create({
            text: ds.dsid,
            isDataSource: true,
            expanded: true,
            glyph: 0xeaf1
        });
        root.appendChild(dsNode);

        columnsNode = dsNode.columnsNode = dsNode.appendChild({
            text: RS.$('ReportDesigner_Columns'),
            isColumnsRoot: true,
            expanded: true,
            glyph: 0xeae7
        });

        paramsNode = dsNode.paramsNode = dsNode.appendChild({
            text: RS.$('Designer_Params'),
            isParamsRoot: true,
            expanded: true,
            glyph: 0xeada
        });

        me.refreshDSNode(dsNode, ds);
    },

    refreshDSNode: function (dsNode, ds) {
        var me = this,
            ods = Ext.create('YZSoft.src.datasource.DataSource', ds.ds),
            columnNode,
            store;

        dsNode.set('text', ds.dsid)
        dsNode.ds = ods;

        ods.getSchema({
            async: false
        }, function (schemaColumns) {
            if (me.destroyed)
                return;

            dsNode.columnsNode.removeAll();
            dsNode.schemaColumns = schemaColumns;

            Ext.each(schemaColumns, function (column) {
                columnNode = dsNode.columnsNode.appendChild({
                    text: column.ColumnName,
                    isColumn: true,
                    tag: column,
                    leaf: true,
                    glyph: 0xeaf8,
                    cls: 'yz-tree-node-column'
                });
            });

            ods.getParams({}, function (queryParams) {
                if (me.destroyed)
                    return;

                dsNode.paramsNode.removeAll();
                Ext.each(queryParams, function (param) {
                    dsNode.paramsNode.appendChild({
                        text: param.name,
                        isParam: true,
                        tag: param,
                        leaf: true,
                        glyph: 0xead9,
                        cls: 'yz-tree-node-param'
                    });
                });

                store = ods.createStore({
                });
                store.loadPage(1);
                dsNode.setStore(store);
            });
        });
    },

    onItemContextMenu: function (view, record, item, index, e) {
        var me = this,
            isDataSource = record.data.isDataSource,
            dsNode = record,
            menu, ds;

        e.preventDefault();

        if (isDataSource) {
            menu = Ext.create('Ext.menu.Menu', {
                margin: '0 0 10 0',
                items: [{
                    glyph: 0xe615,
                    text: RS.$('All_Edit'),
                    handler: function () {
                        me.doEditDataSource(record);
                    }
                }, {
                    text: RS.$('All_Rename'),
                    iconCls: 'yz-glyph yz-glyph-rename',
                    handler: function () {
                        me.cellEditing.startEdit(record, 0);
                    }
                }, {
                    glyph: 0xe60f,
                    text: RS.$('All_Refresh'),
                    handler: function () {
                        ds = dsNode.ds.archive();
                        me.refreshDSNode(dsNode, {
                            dsid: dsNode.get('text'),
                            ds: ds
                        });
                    }
                }, {
                    xtype: 'menuseparator'
                }, {
                    glyph: 0xe64d,
                    text: RS.$('All_Delete'),
                    handler: function () {
                        Ext.Msg.show({
                            msg: Ext.String.format(RS.$('ReportX_Msg_DeleteDataSource'), record.data.text),
                            buttons: Ext.Msg.OKCANCEL,
                            defaultButton: 'cancel',
                            icon: Ext.Msg.INFO,
                            fn: function (btn, text) {
                                if (btn != 'ok')
                                    return;

                                record.remove(true);
                            }
                        });
                    }
                }]
            });

            menu.showAt(e.getXY());
            menu.focus();
        }
    },

    nextid: function (perfix, seed) {
        var me = this,
            seed = seed || 1,
            i, id;

        for (i = seed; ; i++) {
            id = perfix + i;
            if (!me.getDSNode(id))
                return id;
        }
    },

    save: function () {
        var me = this,
            root = me.tree.getRootNode(),
            rv = {},
            dsid, ds;

        Ext.each(root.childNodes, function (dsNode) {
            dsid = dsNode.data.text;
            ds = rv[dsid] = {
                ds: dsNode.ds.archive()
            };

            ds.paramNames = [];
            Ext.each(dsNode.paramsNode.childNodes, function (paramNode) {
                ds.paramNames.push(paramNode.get('text'));
            });
        });

        return rv;
    },

    fill: function (datasources) {
        var me = this,
            items = [], part;

        Ext.Object.each(datasources, function (dsid, ds) {
            ds.dsid = dsid;
            me.addDataSource(ds);
        });
    },

    getDSNode: function (dsid) {
        var me = this,
            root = me.tree.getRootNode(),
            dsNode;

        return Ext.Array.findBy(root.childNodes, function (node) {
            return node.get('text') == dsid;
        });
    },

    getDSNodes: function () {
        var me = this,
            root = me.tree.getRootNode();

        return root.childNodes;
    },

    isDsidExist: function (dsid, exceptDSNode) {
        var me = this,
            root = me.tree.getRootNode(),
            dsNode;

        return Ext.Array.findBy(root.childNodes, function (node) {
            return node.get('text') == dsid && node !== exceptDSNode;
        });
    },

    doAddDataSource: function () {
        var me = this,
            dlg;

        dlg = Ext.create('YZSoft.src.datasource.query.ReportDSDialog', {
            autoShow: true,
            autoClose: false,
            value: {
                dsid: me.nextid(RS.$('All_DataSource'))
            },
            fn: function (ds) {
                me.validateds(dlg, null, ds, function () {
                    me.addDataSource(ds);
                    dlg.close();
                });
            }
        });
    },

    doEditDataSource: function (dsNode) {
        var me = this,
            dlg;

        dlg = Ext.create('YZSoft.src.datasource.query.ReportDSDialog', {
            autoShow: true,
            autoClose: false,
            value: {
                dsid: dsNode.data.text,
                ds: dsNode.ds.archive()
            },
            fn: function (ds) {
                me.validateds(dlg, dsNode, ds, function () {
                    me.refreshDSNode(dsNode, ds);
                    dlg.close();
                });
            }
        });
    },

    validateds: function (dlg, dsNode, ds, success, fail) {
        var me = this,
            ods;

        if (!ds.ds.query) {
            YZSoft.alert(RS.$('ReportDesigner_Warn_Query_Empty'), function () {
                dlg.pnlQuery.edtQuery.focus();
                fail && fail();
            });
            return;
        }

        if (me.isDsidExist(ds.dsid, dsNode)) {
            YZSoft.alert(Ext.String.format(RS.$('ReportDesigner_Warn_DSID_Exist'), ds.dsid), function () {
                dlg.edtName.focus();
                fail && fail();
            });
            return;
        }

        ods = Ext.create('YZSoft.src.datasource.DataSource', ds.ds);
        ods.getSchema({}, function (schemaColumns) {
            success && success();
        }, function (action) {
            YZSoft.alert(Ext.String.format('{0}', action.result.errorMessage), function () {
                dlg.pnlQuery.edtQuery.focus();
                fail && fail();
            });
        });
    },

    onValidateEdit: function (editor, context, eOpts) {
        var me = this,
            rec = context.record;

        context.value = Ext.String.trim(context.value);

        if (context.originalValue == context.value)
            return;

        if (!context.value) {
            context.cancel = true;
            return;
        }

        var err = $objname(context.value);
        if (err !== true) {
            YZSoft.alert(err);
            context.cancel = true;
            return;
        }

        if (me.isDsidExist(context.value, rec)) {
            YZSoft.alert(Ext.String.format(RS.$('ReportDesigner_Warn_DSID_Exist'), context.value));
            context.cancel = true;
            return;
        }
    },

    destroy: function () {
        var me = this,
            dsNodes = me.getDSNodes(),
            store;

        Ext.each(dsNodes, function (dsNode) {
            store = dsNode.getStore();
            store && store.destroy();
        });

        me.callParent(arguments);
    }
});