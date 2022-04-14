/*
config:
    types: [] //'all', 'month', 'quator', 'year', 'day', 'period',
    MonthOffset,
    MonthDay,
    showType 强制显示类型
method:
    getPeriod
event:
    change
*/

Ext.define('YZSoft.src.form.field.PeriodPicker', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'YZPeriodPicker',
    MonthOffset: 0,
    MonthDay: 1,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    periodTypes: {
        all: RS.$('All_PeriodType_All'),
        month: RS.$('All_PeriodType_Month'),
        quator: RS.$('All_PeriodType_Quator'),
        year: RS.$('All_PeriodType_Year'),
        day: RS.$('All_PeriodType_Day'),
        period: RS.$('All_PeriodType_Period')
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.idDateEnd = Ext.id(),
        me.idDateSt = Ext.id();

        var curDate = Ext.Date.clearTime(new Date()),
            curYear = curDate.getFullYear(),
            curMonth = curDate.getMonth(),
            curQuator = Math.floor(curMonth / 3),
            ts = config.types || ['all', 'month', 'quator', 'year', 'day', 'period'],
            b = [];

        for (var i = 0; i < ts.length; i++) {
            var type = ts[i],
                itm = me.periodTypes[type];

            if (itm)
                b.push({ name: itm, value: type });
        }

        config.value = config.value || {};
        config.value.Type = config.value.Type || b[0].value;
        config.value.Year = config.value.Year || curYear;
        config.value.Quator = config.value.Quator || curQuator;
        config.value.Month = config.value.Month || curMonth;
        config.value.Date = config.value.Date || curDate;
        config.value.Date1 = config.value.Date1 || curDate;
        config.value.Date2 = config.value.Date2 || curDate;

        me.periodTypeStore = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'value'],
            data: b
        });

        me.quatorStore = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'value'],
            data: [
                { name: RS.$('All_Quator1'), value: 0 },
                { name: RS.$('All_Quator2'), value: 1 },
                { name: RS.$('All_Quator3'), value: 2 },
                { name: RS.$('All_Quator4'), value: 3}]
        });

        me.monthStore = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'value'],
            data: [
                { name: RS.$('All_Month1'), value: 0 },
                { name: RS.$('All_Month2'), value: 1 },
                { name: RS.$('All_Month3'), value: 2 },
                { name: RS.$('All_Month4'), value: 3 },
                { name: RS.$('All_Month5'), value: 4 },
                { name: RS.$('All_Month6'), value: 5 },
                { name: RS.$('All_Month7'), value: 6 },
                { name: RS.$('All_Month8'), value: 7 },
                { name: RS.$('All_Month9'), value: 8 },
                { name: RS.$('All_Month10'), value: 9 },
                { name: RS.$('All_Month11'), value: 10 },
                { name: RS.$('All_Month12'), value: 11}]
        });

        me.cmbPeriodType = Ext.create('Ext.form.field.ComboBox', {
            queryMode: 'local',
            margin: '0 0 0 0',
            store: me.periodTypeStore,
            displayField: 'name',
            valueField: 'value',
            value: config.value.Type,
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            width: 106,
            hidden: (b.length == 1 && config.showType !== true),
            listeners: {
                scope: me,
                select: me.dateTypeChanged
            }
        });

        me.edtYear = Ext.create('Ext.form.field.Number', {
            hidden: true,
            margin: me.cmbPeriodType.hidden ? 0 : '0 0 0 2',
            minValue: 1753,
            maxValue: 9999,
            allowDecimals: false,
            value: config.value.Year,
            width: 84
        });

        me.cmdQuator = Ext.create('Ext.form.field.ComboBox', {
            hidden: true,
            margin: '0 0 0 2',
            queryMode: 'local',
            store: me.quatorStore,
            displayField: 'name',
            valueField: 'value',
            value: config.value.Quator,
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            width: 120
        });

        me.cmdMonth = Ext.create('Ext.form.field.ComboBox', {
            hidden: true,
            margin: '0 0 0 2',
            queryMode: 'local',
            store: me.monthStore,
            displayField: 'name',
            valueField: 'value',
            value: config.value.Month,
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            width: 92
        });

        me.edtDate = Ext.create('Ext.form.field.Date', {
            hidden: true,
            margin: '0 0 0 2',
            width: 130,
            editable: false,
            value: config.value.Date,
            format: 'Y-m-d',
            allowBlank: true
        });

        me.edtDateSt = Ext.create('Ext.form.field.Date', {
            id: me.idDateSt,
            hidden: true,
            margin: '0 0 0 2',
            width: 130,
            editable: false,
            value: config.value.Date1,
            format: 'Y-m-d',
            vtype: 'daterange',
            endDateField: me.idDateEnd,
            maxValue: config.value.Date2,
            allowBlank: true
        });

        me.edtDateEnd = Ext.create('Ext.form.field.Date', {
            id: me.idDateEnd,
            hidden: true,
            margin: '0 0 0 2',
            width: 130,
            editable: false,
            value: config.value.Date2,
            format: 'Y-m-d',
            vtype: 'daterange',
            startDateField: me.idDateSt,
            minValue: config.value.Date1,
            allowBlank: true
        });

        cfg = {
            items: [
                me.cmbPeriodType,
                me.edtYear,
                me.cmdQuator,
                me.cmdMonth,
                me.edtDate,
                me.edtDateSt,
                me.edtDateEnd
            ]
        };

        if (config.updateButton) {
            if (!config.updateButton.width)
                config.updateButton.width = 80;
            cfg.items.push(config.updateButton)
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.each(cfg.items, function (item) {
            item.on({
                change: function () {
                    me.onChange(this);
                }
            });
        });
    },

    initComponent: function () {
        this.callParent(arguments);
        this.dateTypeChanged();
    },

    onChange: function (field) {
        this.fireEvent('change', field);
    },

    dateTypeChanged: function () {
        var me = this,
            type = me.cmbPeriodType.getValue(),
            y = me.edtYear,
            q = me.cmdQuator,
            m = me.cmdMonth,
            d = me.edtDate,
            d1 = me.edtDateSt,
            d2 = me.edtDateEnd;

        if (type == 'month') {
            y.show();
            q.hide();
            m.show();
            d.hide();
            d1.hide();
            d2.hide();
        }
        else if (type == 'quator') {
            y.show();
            q.show();
            m.hide();
            d.hide();
            d1.hide();
            d2.hide();
        }
        else if (type == 'year') {
            y.show();
            q.hide();
            m.hide();
            d.hide();
            d1.hide();
            d2.hide();
        }
        else if (type == 'day') {
            y.hide();
            q.hide();
            m.hide();
            d.show();
            d1.hide();
            d2.hide();
        }
        else if (type == 'period') {
            y.hide();
            q.hide();
            m.hide();
            d.hide();
            d1.show();
            d2.show();
        }
        else {
            y.hide();
            q.hide();
            m.hide();
            d.hide();
            d1.hide();
            d2.hide();
        }
    },

    setYear: function (v) {
        if (!v)
            return;

        var me = this,
            y = me.edtYear,
            d = me.edtDate,
            d1 = me.edtDateSt,
            d2 = me.edtDateEnd,
            minDate = me.getMinDate(),
            maxDate = me.getMaxDate(),
            t;

        d.setMinValue(minDate);
        d.setMaxValue(maxDate);
        d1.setMinValue(minDate);
        d1.setMaxValue(maxDate);
        d2.setMinValue(minDate);
        d2.setMaxValue(maxDate);

        y.setValue(v);

        t = d.getValue();
        t.setFullYear(v);
        d.setValue(t);

        t = d1.getValue();
        t.setFullYear(v);
        d1.setValue(t);

        t = d2.getValue();
        t.setFullYear(v);
        d2.setValue(t);
    },

    getYear: function () {
        var period = this.getPeriod();
        if (period.Define.Type == 'month' ||
            period.Define.Type == 'quator' ||
            period.Define.Type == 'year')
            return period.Define.Year;

        if (period.Define.Type == 'day')
            return period.Define.Date.getFullYear();

        return '';
    },

    setPeriod: function (v) {
        var me = this,
            t = me.cmbPeriodType,
            y = me.edtYear,
            q = me.cmdQuator,
            m = me.cmdMonth,
            d = me.edtDate,
            d1 = me.edtDateSt,
            d2 = me.edtDateEnd;

        me.suspendEvent('change');

        if ('Type' in v)
            t.setValue(v.Type);

        if ('Year' in v)
            y.setValue(v.Year);

        if ('Quator' in v)
            q.setValue(v.Quator);

        if ('Month' in v)
            m.setValue(v.Month);

        if ('Date' in v)
            d.setValue(v.Date);

        if ('Date1' in v)
            d1.setValue(v.Date1);

        if ('Date2' in v)
            d2.setValue(v.Date2);

        me.resumeEvent('change');
        me.dateTypeChanged();
        me.fireEvent('change', me);
    },

    getPeriod: function () {
        var me = this,
            t = me.cmbPeriodType,
            y = me.edtYear,
            q = me.cmdQuator,
            m = me.cmdMonth,
            d = me.edtDate,
            d1 = me.edtDateSt,
            d2 = me.edtDateEnd,
            rv = {};

        rv.Define = {
            Type: t.getValue(),
            Year: y.getValue(),
            Quator: q.getValue(),
            Month: m.getValue(),
            Date: d.getValue(),
            Date1: d1.getValue(),
            Date2: d2.getValue()
        };

        rv.RawValue = { Type: rv.Define.Type };

        if (rv.Define.Type == 'all') {
            rv.PeriodType = 'all';
            rv.Date1 = me.getMinDate();
            rv.Date2 = me.getMaxDate();
        }
        else if (rv.Define.Type == 'day') {
            rv.PeriodType = 'day';
            rv.RawValue.Date = rv.Date1 = rv.Define.Date;
            rv.Date2 = Ext.Date.add(rv.Date1, Ext.Date.DAY, 1);
        }
        else if (rv.Define.Type == 'period') {
            rv.PeriodType = 'period';
            rv.RawValue.Date1 = rv.Date1 = rv.Define.Date1;
            rv.RawValue.Date2 = rv.Date2 = Ext.Date.add(rv.Define.Date2, Ext.Date.DAY, 1);
        }
        else {
            rv.PeriodType = 'period';
            rv.RawValue.Year = rv.Define.Year;

            var baseDate = new Date(2000, 0, 1, 0, 0, 0);
            baseDate.setFullYear(rv.Define.Year, me.MonthOffset, me.MonthDay);

            if (rv.Define.Type == 'month') {
                rv.Date1 = Ext.Date.add(baseDate, Ext.Date.MONTH, rv.Define.Month);
                rv.Date2 = Ext.Date.add(rv.Date1, Ext.Date.MONTH, 1);
                rv.RawValue.Month = rv.Define.Month;
            }
            else if (rv.Define.Type == 'quator') {
                rv.Date1 = Ext.Date.add(baseDate, Ext.Date.MONTH, rv.Define.Quator * 3);
                rv.Date2 = Ext.Date.add(rv.Date1, Ext.Date.MONTH, 3);
                rv.RawValue.Quator = rv.Define.Quator;
            }
            else {
                rv.Date1 = baseDate;
                rv.Date2 = Ext.Date.add(rv.Date1, Ext.Date.YEAR, 1);
            }
        }

        return rv;
    },

    getMinDate: function () {
        var date = new Date(1753, 0, 1); //SQL Server日期最小值
        //date.setFullYear(0);
        return date;
    },

    getMaxDate: function () {
        return new Date(9999, 11, 31, 23, 59, 59);
    },

    getDisplayText: function () {
        var period = this.getPeriod();

        switch (period.Define.Type) {
            case 'year':
            case 'month':
            case 'quator':
                return Ext.String.format(RS.$('All_DateRangeSimple'), 
                    Ext.Date.format(period.Date1,'Y-m-d'),
                    Ext.Date.format(period.Date2, 'Y-m-d'));
        }
    },

    regularPeriod: function (date1, date2) {
        var me = this,
            rv = {};

        if (!date1 && !date2) {
            return {
            };
        }

        if (date1 && !date2) {
            return {
                Type: 'day',
                Date: date1
            };
        }

        if (date2 && !date1) {
            return {
                Type: 'day',
                Date: date2
            };
        }

        if (Ext.Date.isEqual(date1, me.getMinDate()) &&
            Ext.Date.isEqual(date2, me.getMaxDate())) {
            return {
                Type: 'all'
            };
        }

        if (Ext.Date.isEqual(date2, Ext.Date.add(date1, Ext.Date.DAY, 1))) {
            return {
                Type: 'day',
                Date: date1
            };
        }

        if (date1.getDate() == date2.getDate() &&
            date1.getDate() == me.MonthDay) {

            var baseDate = Ext.Date.clone(date1);
            baseDate = Ext.Date.add(baseDate, Ext.Date.MONTH, -me.MonthOffset)
            baseDate = Ext.Date.add(baseDate, Ext.Date.DAY, -(me.MonthDay - 1))

            var year = baseDate.getFullYear(),
                month = baseDate.getMonth(),
                months = Ext.Date.diff(date1, date2, Ext.Date.MONTH);

            if (months < 12) {
                if (months == 1) {
                    return {
                        Type: 'month',
                        Year: year,
                        Month: month
                    }
                }

                if (months == 3 && month % 3 == 0) {
                    return {
                        Type: 'quator',
                        Year: year,
                        Quator: month / 3
                    }
                }
            }
            else if (months == 12 && month == 0) {
                return {
                    Type: 'year',
                    Year: year
                }
            }
        }

        return {
            Type: 'period',
            Date1: date1,
            Date2: Ext.Date.add(date2, Ext.Date.DAY, -1)
        }
    }
});
