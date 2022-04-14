/*
config
processName
version
record
*/
Ext.define('YZSoft.mobile.form.Editor', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.mobile.model.FormField',
        'YZSoft.mobile.model.FormRender',
        'YZSoft.mobile.model.FormSettingItem'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.gridSrc = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            border: false,
            trackMouseOver: true,
            tablePanelConfig: {
                isRepeatableTableConfig: {
                    disabled: true
                },
                allowAddRecordConfig: {
                    hidden: true
                },
                createRecordConfig: {
                    hidden: true
                },
                advBtnConfig: {
                    hidden: true
                }
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('Process_ProcessData'), dataIndex: 'ColumnName', flex: 1, formatter: 'text' },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', flex: 1, formatter: 'dataType' },
                    { xtype: 'checkcolumn', text: RS.$('All_MobileFormSetting_MobileApprove'), dataIndex: 'AllowRead', flex: 1, listeners: { scope: me, checkchange: 'onSrcGridCheckChange'} }
                ]
            }
        });

        me.pnlSrc = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_MobileFormSetting_Caption_ProcessData'),
            ui:'light',
            header: {
                cls: 'yz-header-submodule'
            },
            region: 'center',
            layout: 'fit',
            items: [me.gridSrc],
            border: false
        });

        me.storeFormFields = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.mobile.model.FormField',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/Mobile/Form.ashx'),
                extraParams: { method: 'GetFormFields' }
            }
        });
        me.storeFormFields.load();

        me.storeMobileFormRenders = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.mobile.model.FormRender',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/Mobile/Form.ashx'),
                extraParams: { method: 'GetFormRenders' }
            }
        });
        me.storeMobileFormRenders.load();

        me.gridTag = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            border: false,
            trackMouseOver: true,
            store: {
                model: 'YZSoft.mobile.model.FormSettingItem'
            },
            tablePanelConfig: {
                isRepeatableTableConfig: {
                    disabled: true
                },
                allowAddRecordConfig: {
                    hidden: true
                },
                createRecordConfig: {
                    hidden: true
                },
                advBtnConfig: {
                    hidden: true
                },
                moveUpBtnConfig: {
                    hidden: false
                },
                moveDownBtnConfig: {
                    hidden: false
                }
            },
            editPlugin: {
                listeners: {
                    scope: me,
                    edit: 'onAfterCellEdit'
                }
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('Process_ProcessData'), dataIndex: 'ColumnName', width: 120, formatter: 'text' },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Order'),
                        width: 60,
                        align: 'center',
                        items: [{
                            icon: YZSoft.$url('YZSoft/theme/images/action/moveup.png'),
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return !view.grid.canMoveUp(record);
                            },
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                view.grid.moveUp(record);
                                me.fireEvent('settingChanged', me.save());
                            }
                        }, {
                            icon: YZSoft.$url('YZSoft/theme/images/action/movedown.png'),
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return !view.grid.canMoveDown(record);
                            },
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                view.grid.moveDown(record);
                                me.fireEvent('settingChanged', me.save());
                            }
                        }]
                    },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 120, formatter: 'dataType' },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Delete'),
                        width: 60,
                        align: 'center',
                        items: [{
                            glyph: 0xe62b,
                            iconCls: 'yz-action-delete',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.deleteRecord(record);
                                me.fireEvent('settingChanged', me.save());
                            }
                        }]
                    },
                    { text: RS.$('All_MobileFormSetting_FieldName'), dataIndex: 'DisplayName', flex: 2, formatter: 'text', editor: {allowBlank: true}},
                    { text: RS.$('All_MobileFormSetting_FieldXClass'), dataIndex: 'MapTo', flex: 3, formatter: 'text', editor: {
                        xtype: 'combobox',
                        matchFieldWidth: false,
                        tpl: Ext.create('Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                                '<li role="option" class="x-boundlist-item">{[this.renderItem1(values)]}</li>', //****** 模板使用record
                            '</tpl></ul>', {
                                renderDisplayName: function (value) {
                                    return value ? (value + ' - ') : null;
                                },
                                renderItem1: function (value) {
                                    var fmt = value.DisplayName ? '<span style="width:190px;display:inline-block;">{0}</span><span style="color:green;margin-left:10px;margin-right:10px;font-family:arial">{1}</span>' : '{0}';
                                    return Ext.String.format(fmt, value.XClass, value.DisplayName);
                                }
                            }
                        ),
                        store: me.storeFormFields,
                        queryMode: 'local',
                        displayField: 'XClass',
                        valueField: 'XClass',
                        editable: true,
                        forceSelection: false,
                        listeners: {
                            select: function (combo, record, eOpts) {
                                me.gridTag.cellEditing.context.record.set('MapTo', record.data.XClass);
                                me.fireEvent('settingChanged', me.save());
                            }
                        }
                    }},
                    { text: RS.$('All_MobileFormSetting_FieldRender'), dataIndex: 'SParam1', flex: 3, formatter: 'text', editor: {
                        xtype: 'combobox',
                        matchFieldWidth: false,
                        tpl: Ext.create('Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                                '<li role="option" class="x-boundlist-item">{[this.renderItem1(values)]}</li>', //****** 模板使用record
                            '</tpl></ul>', {
                                renderDisplayName: function (value) {
                                    return value ? (value + ' - ') : null;
                                },
                                renderItem1: function (value) {
                                    var fmt = value.Sample ? '<span style="width:100px;display:inline-block;">{0}</span><span style="color:green;margin-left:10px;margin-right:10px;font-family:arial">{1}</span>' : '{0}';
                                    return Ext.String.format(fmt, value.Render, value.Sample);
                                }
                            }
                        ),
                        store: me.storeMobileFormRenders,
                        queryMode: 'local',
                        displayField: 'Render',
                        valueField: 'Render',
                        editable: true,
                        forceSelection: false,
                        listeners: {
                            select: function (combo, record, eOpts) {
                                me.gridTag.cellEditing.context.record.set('SParam1', record.data.Render);
                                me.fireEvent('settingChanged', me.save());
                            }
                        }
                    }},
                    { xtype: 'checkcolumn', text: RS.$('All_Display'), dataIndex: 'AllowRead', width: 80, listeners: { scope: me, checkchange: 'onTagGridCheckChange'} },
                    { xtype: 'checkcolumn', text: RS.$('All_MobileFormSetting_AllowWrite'), dataIndex: 'AllowWrite', disableDataIndex: 'WriteColumnDisabled', width: 80, listeners: { scope: me, checkchange: 'onTagGridCheckChange'} },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Advanced'),
                        width: 60,
                        align: 'center',
                        items: [{
                            icon: YZSoft.$url('YZSoft/theme/images/action/edit.png'),
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                Ext.create('YZSoft.src.dialogs.JsonDlg', {
                                    title: Ext.String.format(RS.$('All_MobileFormSetting_JsonCfg_Title'), record.data.DisplayName || record.data.ColumnName),
                                    caption: RS.$('All_MobileFormSetting_JsonCfg_Caption'),
                                    value: record.data.SParam2,
                                    autoShow: true,
                                    fn: function (json) {
                                        record.set('SParam2', json);
                                        me.fireEvent('settingChanged', me.save());
                                    }
                                });
                            }
                        }]
                    }
                ]
            }
        });

        me.pnlTag = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_MobileFormSetting_Caption_FormData'),
            ui: 'light',
            header: {
                cls: 'yz-header-submodule'
            },
            region: 'south',
            height: '40%',
            border: false,
            split: {
                cls: 'yz-spliter',
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            layout: 'fit',
            items: [me.gridTag]
        });

        cfg = {
            layout: 'border',
            items: [me.pnlTag, me.pnlSrc]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.gridTag.on({
            moveUpClick: function () {
                me.fireEvent('settingChanged', me.save());
            },
            moveDownClick: function () {
                me.fireEvent('settingChanged', me.save());
            }
        });
    },

    load: function (config) {
        var me = this;

        config = config || {};
        me.version = config.version || me.version;

        me.storeFormFields.load();
        me.storeMobileFormRenders.load();

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/Mobile/Form.ashx'),
            params: {
                method: 'GetMobileFormSetting',
                processName: me.processName,
                version: me.version
            },
            success: function (action) {
                me.fill(action.result);
            }
        }, config));
    },

    fill: function (data) {
        var me = this,
            controlDataSet = data.mobileFormSetting.ControlDataSet;

        me.gridSrc.addTable({
            tables: data.tables,
            clear: true,
            fn: function (item) {
                if (item.isTable) {
                }
                else {
                    var column = me.gridSrc.findColumn(controlDataSet, item);
                    if (column) {
                        Ext.apply(item, {
                            AllowRead: true
                        });
                    }
                }
            },
            callback: function (dataset) {
                dataset = me.gridTag.reorder(dataset, controlDataSet);
                me.gridTag.addTableWithSchema({
                    tables: dataset.Tables,
                    clear: true,
                    fn: function (item) {
                        if (item.isTable) {
                            var table = me.gridTag.findTable(controlDataSet, item);
                            if (!table || table.Columns.length == 0)
                                return false;
                        }
                        else {
                            var column = me.gridTag.findColumn(controlDataSet, item);
                            if (!column)
                                return false;

                            Ext.copyTo(item, column, 'DisplayName,MapTo,AllowRead,AllowWrite,SParam1,SParam2');
                        }
                    }
                });

                me.fireEvent('settingChanged', me.save());
            }
        });
    },

    save: function () {
        var me = this,
            rv;

        rv = {
            ControlDataSet: {
                Tables: me.gridTag.save([
                'DataSourceName',
                'TableName'
                ], [
                'ColumnName',
                'DisplayName',
                'MapTo',
                'AllowRead',
                'AllowWrite',
                'SParam1',
                'SParam2'
            ], function (table) {
                return false;
            }, function (column) {
                return false;
            }, true)
            }
        };

        return rv;
    },

    onSrcGridCheckChange: function (cloumn, rowIndex, checked, eOpts) {
        var me = this,
            srcGrid = me.gridSrc,
            tagGrid = me.gridTag,
            srcStore = srcGrid.getStore(),
            tagStore = tagGrid.getStore(),
            rec = srcStore.getAt(rowIndex),
            recTag;

        if (checked) {
            var recTableSrc = srcGrid.findParentRecord(rec),
                srcTableIdentity = srcGrid.getTableIdentity(recTableSrc),
                recTableTag = tagGrid.findTableRecord(srcTableIdentity),
                rv = [];

            if (!recTableTag) {
                rv.push({
                    isTable: true,
                    DataSourceName: srcTableIdentity.DataSourceName,
                    TableName: srcTableIdentity.TableName,
                    IsRepeatableTable: srcTableIdentity.IsRepeatableTable
                });
            }
            else {
                recTag = tagGrid.findChildColumnRecord(recTableTag, rec.data.ColumnName);
            }

            if (!recTag) {
                rv.push(Ext.apply({
                    isColumn: true,
                    TableName: srcTableIdentity.TableName,
                    DisplayName: rec.data.ColumnName,
                    AllowRead: true,
                    AllowWrite: false,
                    SParam1: 'Default',
                    MapTo: 'Ext.field.Text'
                }, rec.data));
            }

            if (rv.length != 0) {
                if (!recTableTag)
                    tagStore.add(rv);
                else
                    tagGrid.insertAtEndOfTable(recTableTag, rv);
            }
        }
        else {
            var recTableSrc = srcGrid.findParentRecord(rec),
                srcTableIdentity = srcGrid.getTableIdentity(recTableSrc),
                recTableTag = tagGrid.findTableRecord(srcTableIdentity);

            if (recTableTag)
                recTag = tagGrid.findChildColumnRecord(recTableTag, rec.data.ColumnName);

            if (recTag) {
                tagStore.remove(recTag);
                var childColumnRecs = tagGrid.getChildColumnRecords(recTableTag);
                if (childColumnRecs.length == 0)
                    tagStore.remove(recTableTag);
            }
        }

        tagGrid.getView().refresh();
        me.fireEvent('settingChanged', me.save());
    },

    deleteRecord: function (rec) {
        var me = this,
            srcGrid = me.gridSrc,
            tagGrid = me.gridTag,
            srcStore = srcGrid.getStore(),
            tagStore = tagGrid.getStore(),
            recTable = tagGrid.findParentRecord(rec),
            tableIdentity = srcGrid.getTableIdentity(recTable);

        tagStore.remove(rec);
        var childColumnRecs = tagGrid.getChildColumnRecords(recTable);
        if (childColumnRecs.length == 0)
            tagStore.remove(recTable);

        var recTableSrc = srcGrid.findTableRecord(tableIdentity),
            recSrc = srcGrid.findChildColumnRecord(recTableSrc, rec.data.ColumnName);

        if (recSrc)
            recSrc.set('AllowRead', false);

        tagGrid.getView().refresh();
    },

    onTagGridCheckChange: function (column, rowIndex, checked, eOpts) {
        var me = this,
            grid = me.gridTag,
            rec = grid.getStore().getAt(rowIndex);

        if (column.dataIndex == 'AllowRead' && !checked) {
            rec.set('AllowWrite', false);
        }

        if (column.dataIndex == 'AllowWrite' && checked) {
            rec.set('AllowRead', true);
        }

        me.fireEvent('settingChanged', me.save());
    },

    onAfterCellEdit: function (editor, e) {
        this.fireEvent('settingChanged', this.save());
    }
});