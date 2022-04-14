
Ext.define('YZSoft.report.rpt.editor.ReportLinkField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.report.rpt.model.ResultColumn'],
    linkTypes: [
        { name: RS.$('All_None'), value: 'None' },
        { name: RS.$('All_Report'), value: 'Report' },
        { name: RS.$('All_TaskForm'), value: 'Task' },
        { name: RS.$('All_FormApplication'), value: 'FormApplication' }
    ],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.report.rpt.model.ResultColumn',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        me.editorLinkTo = {
            xclass: 'YZSoft.report.rpt.field.LinkToField',
            listeners: {
                beforeedit: function (context) {
                    var linkType = context.record.data.LinkType;

                    if (!linkType || linkType == 'None' || linkType == 'Task')
                        return false;

                    this.context = context;
                    this.setLinkType(context.record.data.LinkType);
                },
                selected: function (value) {
                    me.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.cellEditing.startEdit(this.context.record, this.context.column);
                }
            }
        };

        me.editorParams = {
            xclass: 'YZSoft.report.rpt.field.ParamsFillField',
            listeners: {
                beforeedit: function (context) {
                    var linkType = context.record.data.LinkType;

                    if (!linkType || linkType == 'None')
                        return false;

                    if ((linkType == 'Report' || linkType == 'FormApplication') &&
                        !context.record.data.LinkTo)
                        return false;

                    this.context = context;
                    this.tagType = context.record.data.LinkType;
                    this.tagIdentity = context.record.data.LinkTo;
                    this.columns = me.columns;
                    this.srcParams = me.srcParams;
                },
                selected: function (value) {
                    me.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.cellEditing.startEdit(this.context.record, this.context.column);
                }
            }
        };

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            viewConfig: {
                markDirty: false
            },
            flex: 1,
            height: 238,
            plugins: [me.cellEditing],
            defaults: {
                renderer: YZSoft.Render.renderString
            },
            columns: [
                { xtype: 'rownumberer' },
                { text: RS.$('All_TableColumn'), dataIndex: 'ColumnName', width: 140 },
                { text: RS.$('Report_Link'), dataIndex: 'LinkType', width: 100, scope: me, renderer: me.renderLinkType, editor: {
                    xtype: 'combobox',
                    store: {
                        fields: ['name', 'value'],
                        data: me.linkTypes
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true
                }
                },
                { text: RS.$('Report_LinkTarget'), dataIndex: 'LinkTo', flex: 2, scope: me, renderer: me.renderLinkTo, editor: me.editorLinkTo },
                { text: RS.$('All_ParamsTranslate'), dataIndex: 'ParametersFill', flex: 3, scope: me, renderer: me.renderParametersFill, editor: me.editorParams }
            ]
        });

        var cfg = {
            layout: 'fit',
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderLinkType: function (value) {
        var me = this;

        var linkType = Ext.Array.findBy(me.linkTypes, function (linkType) {
            return linkType.value == value;
        });

        return linkType ? linkType.name : value;
    },

    renderLinkTo: function (value, metaData, record) {
        if (record.data.LinkType == 'None')
            return null;

        return record.data.LinkType == 'Task' ? Ext.String.format('<span style="color:#ccc">{0}</span>', RS.$('All_Ignore')) : value;
    },

    renderParametersFill: function (value, metaData, record) {
        if (record.data.LinkType == 'None')
            return null;

        var rv = [];
        Ext.each(value, function (fill) {
            rv.push(Ext.String.format('{0}={1}', fill.Name, fill.FillWith));
        });

        return rv.join(';');
    },

    setColumns: function (columns,srcParams) {
        var me = this,
            datas = [];

        me.columns = columns;
        Ext.each(columns, function (column) {
            var rec = me.store.getById(column.ColumnName),
                data = Ext.copyTo({ LinkType: 'None' }, column, 'ColumnName,DataType');

            datas.push(data);
            if (rec)
                Ext.copyTo(data, rec.data, 'LinkType,LinkTo,ParametersFill');
        });

        me.store.setData(datas);
        me.srcParams = srcParams;
    },

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.copyTo({}, rec.data, 'ColumnName,LinkType,LinkTo,ParametersFill');
            if (v.LinkType && v.LinkType != 'None')
                rv.push(v);
        });
        return rv;
    }
});