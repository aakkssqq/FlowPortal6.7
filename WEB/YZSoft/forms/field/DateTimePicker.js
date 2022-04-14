
Ext.define('YZSoft.forms.field.DateTimePicker', {
    extend: 'YZSoft.forms.field.Element',
    dateEleSelector: '.yz-xform-field-ele-date',
    triggerEleSelector: '.yz-xform-field-trigger-date',
    timeEleSelector: '.yz-xform-field-ele-time',
    hourEleSelector: '.yz-xform-field-ele-hour',
    minutesEleSelector: '.yz-xform-field-ele-minutes',
    focusCls: 'yz-xform-field-focus',
    dateFieldformat: 'Y-m-d',
    supportSpoor: true,

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            date: me.down(me.dateEleSelector, true),
            trigger: me.down(me.triggerEleSelector, true),
            time: me.down(me.timeEleSelector, true),
            hour: me.down(me.hourEleSelector, true),
            minutes: me.down(me.minutesEleSelector, true)
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            trigger: Ext.get(dom.trigger),
            time: Ext.get(dom.time),
            hour: Ext.get(dom.hour),
            minutes: Ext.get(dom.minutes)
        });

        if (ctrls.trigger) {
            ctrls.trigger.on({
                scope: me,
                mousedown: 'onTriggerMouseDown'
            });
        }

        Ext.each([ctrls.time, ctrls.hour, ctrls.minutes], function (el) {
            if (el) {
                el.on({
                    scope: me,
                    change: 'onInputChenged'
                });
            }
        });
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            sDataBind: me.getDataBind(),
            type: me.getAttribute('Type'),
            displayOnly: me.getAttributeBool('DisplayOnly'),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp(),
            step: me.getAttributeNumber('step', 1),
            defaultDataType: YZSoft.XForm.DataType.String //???
        };
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls,
            strDate = ctrls.dom.date.value;

        if (!strDate)
            return '';

        if (ctrls.dom.time)
            strDate = Ext.String.format('{0} {1}', strDate, ctrls.dom.time.value || '00:00');

        if (ctrls.dom.hour && ctrls.dom.minutes)
            strDate = Ext.String.format('{0} {1}:{2}', strDate, ctrls.dom.hour.value || '00', ctrls.dom.minutes.value || '00');

        var date = me.parseDate(strDate);
        return date ? Ext.Date.format(date, 'Y-m-d H:i:s') : '';
    },

    parseDate: function (strDate) {
        if (!strDate)
            return null;

        if (strDate.length == 10)
            strDate += ' 00:00:00';
        else if (strDate.length == 13)
            strDate += ':00:00';
        else if (strDate.length == 16)
            strDate += ':00';

        return Ext.Date.parse(strDate, 'Y-m-d H:i:s', true);
    },

    setValue: function (value) {
        var me = this,
            et = me.getEleType(),
            step = et.step,
            ctrls = me.controls,
            date = me.parseDate(value),
            strDate, strHour, strMinutes;

        if (!date) {
            strDate = '';
            strHour = '00';
            strMinutes = '00';
        }
        else {
            strDate = Ext.Date.format(date, 'Y-m-d');
            strHour = Ext.Date.format(date, 'H');
            strMinutes = Ext.Date.format(date, 'i');

            if (step > 1) { //step 大于1时，需要将分钟部分整数化
                var minutes = Number(strMinutes);
                minutes = Math.floor((minutes / step)) * step;
                strMinutes = Ext.String.leftPad(minutes, 2, '0');
            }
        }

        if (et.displayOnly) {
            if (strDate) {
                switch (et.type) {
                    case 'Date':
                        break;
                    case 'TimeHour':
                        strDate = strDate + ' ' + strHour + ':00';
                        break;
                    default:
                        strDate = strDate + ' ' + strHour + ':' + strMinutes;
                        break;
                }
            }

            ctrls.dom.date.value = strDate || '';
        }
        else {
            ctrls.dom.date.value = strDate;

            if (ctrls.dom.time) {
                ctrls.dom.time.value = strHour + ':' + strMinutes;
            }

            if (ctrls.dom.hour && ctrls.dom.minutes) {
                ctrls.dom.hour.value = strHour;
                ctrls.dom.minutes.value = strMinutes;
            }
        }
    },

    setDisabled: function (disable) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        //ctrls.dom.date.readOnly = disable; 明细表中的日历控件readonly设置为true后 IE11变为能输入，不需要设置，因为日期控件本来就是readonly
        Ext.each([ctrls.dom.time, ctrls.dom.hour, ctrls.dom.minutes], function (el) {
            if (el) {
                el.disabled = disable;
            }
        });
    },

    onTriggerMouseDown: function (e) {
        var me = this,
            et = me.getEleType(),
            disableCssCls = et.DisableCssClass || me.defauleDisableCls,
            ctrls = me.controls,
            value = ctrls.dom.date.value;

        value = value ? Ext.Date.parse(value, me.dateFieldformat) : new Date();

        e.stopEvent();

        if (me.hasCls(disableCssCls))
            return;

        if (!me.picker) {
            me.picker = Ext.create('Ext.menu.DatePicker', {
                format: me.dateFieldformat,
                showToday: true,
                minHeight: 342,
                listeners: {
                    scope: me,
                    select: function (m, d) {
                        ctrls.dom.date.value = Ext.Date.format(d, me.dateFieldformat);
                        me.picker.hide();
                        me.onInputChenged();
                    }
                }
            });
        }

        me.picker.picker.setValue(value);
        me.picker.showBy(ctrls.trigger, 'tr-br?');
        me.picker.picker.focus();
    },

    onInputChenged: function () {
        this.agent.fireEvent('inputChange', this);
    }
});