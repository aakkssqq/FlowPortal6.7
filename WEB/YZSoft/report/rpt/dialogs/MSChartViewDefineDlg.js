/*
config
property
    columns
*/

Ext.define('YZSoft.report.rpt.dialogs.MSChartViewDefineDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 850,
    height: 580,
    minWidth: 850,
    minHeight: 580,
    modal: true,
    resizable: true,
    maximizable: true,
    bodyPadding: '10 26 0 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Report_ViewName'),
            name: 'ViewName',
            width: 300
        });

        me.cmbChartType = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_Report_ChartType'),
            cls:'yz-field-required',
            name: 'ChartType',
            width: 300,
            store: Ext.create('YZSoft.report.rpt.store.MSChartTypeStore'),
            queryMode: 'local',
            displayField: 'value',
            valueField: 'value',
            editable: false,
            forceSelection: true
        });

        me.edtReportTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('Report_ChartTitle'),
            name: 'ReportTitle',
            width: '100%'
        });

        me.edtWidth = Ext.create('Ext.form.field.Number', {
            fieldLabel: RS.$('Report_ChartWidth'),
            name: 'ReportWidth',
            width: 200,
            value: 800,
            minValue: 1,
            allowDecimals: false
        });

        me.edtHeight = Ext.create('Ext.form.field.Number', {
            fieldLabel: RS.$('Report_ChartHeight'),
            name: 'ReportHeight',
            width: 200,
            value: 396,
            minValue: 1,
            allowDecimals: false
        });

        me.cmbXAxis = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('Report_XAxis'),
            cls: 'yz-field-required',
            name: 'XAxisColumnName',
            width: 300,
            store: {
                fields: ['ColumnName'],
                data: config.columns
            },
            queryMode: 'local',
            displayField: 'ColumnName',
            valueField: 'ColumnName',
            editable: false,
            forceSelection: true
        });

        me.editorSeries = Ext.create('YZSoft.report.rpt.editor.MSChartViewSeriesField', {
            fieldLabel: RS.$('Report_YAxisSeries'),
            cls: 'yz-field-required',
            name: 'Series',
            labelAlign: 'top',
            columns: config.columns,
            flex: 1
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.save());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        me.form = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: [{
                xtype: 'container',
                layout: {
                    type: 'vbox'
                },
                padding:'0 68 0 0',
                items: [{
                    xtype: 'fieldcontainer',
                    width: '100%',
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [me.edtName, { xtype: 'tbfill' }, me.cmbChartType]
                }, me.edtReportTitle, {
                    xtype: 'fieldcontainer',
                    width: 500,
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [me.edtWidth, { xtype: 'tbfill' }, me.edtHeight]
                }, me.cmbXAxis
                ]
            }, me.editorSeries]
        });

        cfg = {
            items: [me.form],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);

        me.relayEvents(me.edtName, ['change'], 'item');
        me.relayEvents(me.cmbChartType, ['change'], 'item');
        me.relayEvents(me.edtWidth, ['change'], 'item');
        me.relayEvents(me.edtHeight, ['change'], 'item');
        me.relayEvents(me.cmbXAxis, ['change'], 'item');
        me.relayEvents(me.editorSeries, ['change'], 'item');

        me.on({
            scope: me,
            itemChange: 'updateStatus'
        });

        me.updateStatus();
    },

    fill: function (data) {
        this.form.getForm().setValues(data);
    },

    save: function () {
        return this.form.getValuesSubmit();
    },

    updateStatus: function () {
        var me = this,
            value = me.save();

        me.btnOK.setDisabled(
            !value.ViewName ||
            !value.ChartType ||
            !value.ReportWidth ||
            !value.ReportHeight ||
            !value.XAxisColumnName ||
            value.Series.length == 0
        );
    }
});