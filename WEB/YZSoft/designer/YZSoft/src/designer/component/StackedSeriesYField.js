
Ext.define('YZSoft.designer.YZSoft.src.designer.component.StackedSeriesYField', {
    extend: 'YZSoft.designer.ChartAbstract',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            chart = part.getChart(),
            series = part.getSeries();

        me.edtTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_SeriesName'),
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue()),
                    index = part.ownerCt.items.indexOf(part),
                    titles = Ext.Array.clone(series.getTitle());

                titles[index] = value;
                series.setTitle(titles);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.chkAutoColor = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_AutoColor'),
            listeners: {
                scope:me,
                change: 'onColorSettingChanged'
            }
        });

        me.fillStyle = Ext.create('YZSoft.src.button.ColorPickerTextBox', {
            flex: 1,
            listeners: {
                scope: me,
                picked: function (color) {
                    me.chkAutoColor.suspendEvent('change');
                    me.chkAutoColor.setValue(false);
                    me.chkAutoColor.resumeEvent('change');
                    me.onColorSettingChanged();
                }
            }
        });

        me.segColor = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Seg_Color'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.chkAutoColor, {
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('ReportDesigner_SpecialColor'),
                    layout: {
                        type: 'hbox',
                        align:'center'
                    },
                    items: [me.fillStyle]
                }
            ]
        });

        me.items = [
            me.edtTitle,
            me.segColor
        ];

        me.callParent();

        me.fill();

        me.on({
            activate: function () {
                me.fill();
            }
        });

        part.on({
            indexChanged: function () {
                me.fill();
            }
        });
    },

    fill: function () {
        var me = this,
            part = me.part,
            chart = part.getChart(),
            series = part.getSeries(),
            theme = series.getThemeStyle(),
            fillColors = theme.subStyle.fillStyle,
            yFieldsColors = series.getYFieldsColors(),
            index = part.ownerCt.items.indexOf(part);

        me.edtTitle.setValue(series.getTitle()[index]);
        me.chkAutoColor.suspendEvent('change');
        me.chkAutoColor.setValue(!yFieldsColors[index]);
        me.chkAutoColor.resumeEvent('change');
        me.fillStyle.setColor(fillColors[index]);
    },

    onColorSettingChanged: function () {
        var me = this,
            part = me.part,
            series = part.getSeries(),
            yFieldsColors = series.getYFieldsColors(),
            index = part.ownerCt.items.indexOf(part),
            color = me.fillStyle.color,
            checked = me.chkAutoColor.getValue();

        yFieldsColors[index] = checked ? null:color;
        series.setYFieldsColors(yFieldsColors);
    }
});