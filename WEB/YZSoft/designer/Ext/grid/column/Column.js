

Ext.define('YZSoft.designer.Ext.grid.column.Column', {
    extend: 'Ext.panel.Panel',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            column = me.tag,
            grid = part.getComp();

        me.edtTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_Grid_ColumnName'),
            labelAlign:'top',
            value: column.text,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                column.setText(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.align = Ext.create('Ext.button.Segmented', {
            items: [{
                value: 'start',
                glyph: 0xe930
            }, {
                value: 'center',
                glyph: 0xe92e
            }, {
                value: 'end',
                glyph: 0xe92f
            }],
            value: column.align,
            listeners: {
                change: function () {
                    var value = this.getValue();
                    me.setAlign(column, value);
                    grid.getView().refresh();
                }
            }
        });

        me.btnCurrency1 = Ext.create('Ext.button.Button', {
            text: RS.$('All_DefaultCurrency') + '1,234',
            textAlign: 'right',
            toggleGroup: 'template',
            handler: function () {
                me.align.suspendEvent('change');
                me.align.setValue('end');
                me.align.resumeEvent('change');

                me.setAlign(column, 'end');

                column.dataFormat = {
                    type: 'number',
                    prefix: RS.$('All_DefaultCurrency'),
                    thousands: true,
                    decimal: false
                };

                grid.getView().refresh();
            }
        });

        me.btnCurrency2 = Ext.create('Ext.button.Button', {
            text: RS.$('All_DefaultCurrency') + '1,234.00',
            textAlign: 'right',
            toggleGroup: 'template',
            handler: function () {
                me.align.suspendEvent('change');
                me.align.setValue('end');
                me.align.resumeEvent('change');

                me.setAlign(column, 'end');

                column.dataFormat = {
                    type: 'number',
                    prefix: RS.$('All_DefaultCurrency'),
                    thousands: true,
                    decimal: 2
                };

                grid.getView().refresh();
            }
        });

        me.btnQty1 = Ext.create('Ext.button.Button', {
            text: '1,234',
            textAlign: 'right',
            toggleGroup: 'template',
            handler: function () {
                me.align.suspendEvent('change');
                me.align.setValue('end');
                me.align.resumeEvent('change');

                me.setAlign(column, 'end');

                column.dataFormat = {
                    type: 'number',
                    prefix: false,
                    thousands: true,
                    decimal: false
                };

                grid.getView().refresh();
            }
        });

        me.btnQty2 = Ext.create('Ext.button.Button', {
            text: '1,234.00',
            textAlign: 'right',
            toggleGroup: 'template',
            handler: function () {
                me.align.suspendEvent('change');
                me.align.setValue('end');
                me.align.resumeEvent('change');

                me.setAlign(column, 'end');

                column.dataFormat = {
                    type: 'number',
                    prefix: false,
                    thousands: true,
                    decimal: 2
                };

                grid.getView().refresh();
            }
        });

        me.btnDate1 = Ext.create('Ext.button.Button', {
            text: Ext.Date.format(new Date(),'Y-m-d'),
            textAlign: 'left',
            toggleGroup: 'template',
            handler: function () {
                column.dataFormat = {
                    type: 'date',
                    format: 'Y-m-d'
                };

                grid.getView().refresh();
            }
        });

        me.btnDate2 = Ext.create('Ext.button.Button', {
            text: Ext.Date.format(new Date(), 'Y-m-d H:i'),
            textAlign: 'left',
            toggleGroup: 'template',
            handler: function () {
                column.dataFormat = {
                    type: 'date',
                    format: 'Y-m-d H:i'
                };

                grid.getView().refresh();
            }
        });

        me.btnNormal = Ext.create('Ext.button.Button', {
            text: RS.$('ReportDesigner_Grid_Text'),
            textAlign: 'left',
            toggleGroup: 'template',
            handler: function () {
                column.dataFormat = {
                    type: 'default'
                };

                grid.getView().refresh();
            }
        });

        me.fieldsetTemplate = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Grid_Seg_Template'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: 0
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel:RS.$('ReportDesigner_Grid_Currency'),
                layout: {
                    type: 'vbox',
                    align: 'end'
                },
                defaults: {
                    cls: ['yz-font-size-13', 'yz-btn-segment'],
                    padding: '6 3',
                    margin: '3 0',
                    width: 140
                },
                items: [
                    me.btnCurrency1,
                    me.btnCurrency2
                ]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_Grid_Qty'),
                layout: {
                    type: 'vbox',
                    align: 'end'
                },
                defaults: {
                    cls: ['yz-font-size-13', 'yz-btn-segment'],
                    padding: '6 3',
                    margin: '3 0',
                    width: 140
                },
                items: [
                    me.btnQty1,
                    me.btnQty2
                ]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_Grid_Date'),
                layout: {
                    type: 'vbox',
                    align: 'end'
                },
                defaults: {
                    cls: ['yz-font-size-13', 'yz-btn-segment'],
                    padding: '6 3',
                    margin: '3 0',
                    width: 140
                },
                items: [
                    me.btnDate1,
                    me.btnDate2
                ]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_Grid_Text'),
                margin: '0 0 7 0',
                layout: {
                    type: 'vbox',
                    align: 'end'
                },
                defaults: {
                    cls: ['yz-font-size-13', 'yz-btn-segment'],
                    padding: '6 3',
                    margin: '3 0',
                    width: 140
                },
                items: [
                    me.btnNormal
                ]
            }]
        });

        me.chkFlex = Ext.create('Ext.form.field.Radio', {
            boxLabel: RS.$('ReportDesigner_Grid_ColumnWidth_Flex'),
            name: me.id + 'width',
            checked: !!column.flex,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    if (value) {
                        delete column.width;
                        column.flex = 1;
                        column.updateLayout();
                    }
                }
            }
        });

        me.chkWidth = Ext.create('Ext.form.field.Radio', {
            boxLabel: RS.$('ReportDesigner_Grid_ColumnWidth_Special'),
            flex: 1,
            name: me.id + 'width',
            checked: !column.flex,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    if (value) {
                        delete column.flex;
                        column.width = me.edtWidth.getValue() || 100;
                        column.updateLayout();
                    }
                }
            }
        });

        me.edtWidth = Ext.create('Ext.form.field.Number', {
            fieldLabel: '',
            width:120,
            hideTrigger: true,
            value: column.width || 100,
            minValue: 0,
            maxValue: 1000,
            allowDecimals: false,
            enableKeyEvents: true,
            applySetting: function () {
                var value = this.getValue();

                me.chkFlex.suspendEvent('change');
                me.chkWidth.suspendEvent('change');
                me.chkWidth.setValue(true);
                me.chkFlex.resumeEvent('change');
                me.chkWidth.resumeEvent('change');

                delete column.flex;
                column.suspendEvent('resize');
                column.width = me.edtWidth.getValue() || 100;
                column.updateLayout();
                column.resumeEvent('resize');
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.fieldsetWidth = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Seg_Width'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.chkFlex, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    items:[
                        me.chkWidth,
                        me.edtWidth
                    ]
                }
            ]
        });

        me.chkGroup = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_Grid_Group'),
            checked: !!column.group,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    column.group = value;
                    grid.getView().refresh();
                }
            }
        });

        me.fieldsetGroup = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Grid_Group'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.chkGroup
            ]
        });

        me.items = [
            me.edtTitle,{
            xtype: 'fieldcontainer',
            fieldLabel: RS.$('All_Align'),
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [me.align]
            },
            me.fieldsetTemplate,
            me.fieldsetWidth,
            me.fieldsetGroup
        ];

        me.callParent();

        column.on({
            resize: function (column, width, height, oldWidth, oldHeight, eOpts) {
                if (!column.flex)
                    me.edtWidth.setValue(width);
            }
        });
    },

    setAlign: function (column,align) {
        column.removeCls('x-column-header-align-' + column.getMappedAlignment(column.align));
        column.addCls('x-column-header-align-' + column.getMappedAlignment(align));

        column.setAlign(align);
    }
});