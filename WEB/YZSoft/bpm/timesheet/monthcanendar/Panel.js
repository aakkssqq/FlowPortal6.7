/*
config:
sheetName  timesheet name,
readOnly
*/
Ext.define('YZSoft.bpm.timesheet.monthcanendar.Panel', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.labCaption = Ext.create('Ext.toolbar.TextItem', {
            text: '',
            style: 'font-size:1.8em;font-weight:bold'
        });

        me.periodPicker = Ext.create('YZSoft.src.form.field.PeriodPicker', {
            types: ['month'],
            margin: '0 3',
            listeners: {
                change: function () {
                    var value = me.periodPicker.getPeriod().Define;
                    me.setMonth(value.Year, value.Month);
                }
            }
        });

        me.btnPrev = Ext.create('Ext.button.Button', {
            text: Ext.String.format('< {0}', RS.$('All_PrevMonth')),
            margin: 0,
            handler: function (item) {
                var value = me.periodPicker.getPeriod().Define,
                    date = new Date(value.Year, value.Month, 1),
                    prev = Ext.Date.add(date, Ext.Date.MONTH, -1);

                Ext.apply(value, {
                    Year: prev.getFullYear(),
                    Month: prev.getMonth()
                });

                me.periodPicker.setPeriod(value);
            }
        });

        me.btnNext = Ext.create('Ext.button.Button', {
            text: Ext.String.format('{0} >', RS.$('All_NextMonth')),
            margin: 0,
            handler: function (item) {
                var value = me.periodPicker.getPeriod().Define,
                    date = new Date(value.Year, value.Month, 1),
                    next = Ext.Date.add(date, Ext.Date.MONTH, 1);

                Ext.apply(value, {
                    Year: next.getFullYear(),
                    Month: next.getMonth()
                });

                me.periodPicker.setPeriod(value);
            }
        });

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('All_SaveModify'),
            glyph: 0xe616,
            cls: 'yz-btn-submit yz-btn-round3',
            margin: '0 0 0 8',
            disabled: config.readOnly,
            handler: function (item) {
                me.editor.submit(function () {
                    me.editor.ownerCt.mask({
                        msg: RS.$('All_Save_Succeed'),
                        msgCls: 'yz-mask-msg-success',
                        autoClose: true
                    });
                });
            }
        });

        me.xaxis = Ext.create('YZSoft.bpm.timesheet.monthcanendar.XAxis', {
            region: 'north',
            height: 60,
            border: false
        });

        me.yaxis = Ext.create('YZSoft.bpm.timesheet.monthcanendar.YAxis', {
            width: 50
        });

        me.editor = Ext.create('YZSoft.bpm.timesheet.monthcanendar.Editor', {
            flex: 1,
            border: false,
            sheetName: config.sheetName
        });

        cfg = {
            layout: 'border',
            border: false,
            tbar: {
                padding:'10 6 10 8',
                items: [
                    me.labCaption,
                    '->',
                    me.btnPrev,
                    me.periodPicker,
                    me.btnNext,
                    me.btnSave
                ]
            },
            items: [
                me.xaxis, {
                    xtype: 'panel',
                    region: 'center',
                    reference: 'cntXAxis',
                    overflowY: 'scroll',
                    layout: 'hbox',
                    border: false,
                    items: [me.yaxis, me.editor]
                }
            ],
            listeners: {
                afterrender: function () {
                    Ext.defer(function () {
                        me.setMonth(value.Year, value.Month,true)
                    }, 10);
                }
            }
        };

        Ext.apply(config, cfg);
        me.callParent([config]);

        var value = me.periodPicker.getPeriod().Define;
    },

    setMonth: function (year, month, scroll) {
        var me = this,
            refs = me.getReferences();

        me.labCaption.setText(Ext.String.format(RS.$('All_MonthIdentityFormat'), year, month + 1));

        if (scroll)
            refs.cntXAxis.setScrollY(12 * 20); //setScrollY后调用setText会是滚动条归位

        me.xaxis.setMonth(year, month);
        me.editor.setMonth(year, month);
    }
});
