Ext.define('YZSoft.bpm.src.sparkline.StepProgress', {
    extend: 'Ext.Gadget',
    xtype: ['yzstepprogresswidget'],
    mixins: [
        'Ext.ProgressBase'
    ],
    config: {
        text: null,
        animate: false
    },
    cachedConfig: {
        textCls: 'text',
        cls: null
    },
    baseCls: 'yz-widget-progress',
    template: [{
        reference: 'backgroundEl',
        cls: 'back'
    }, {
        reference: 'barEl',
        cls: 'bar'
    }, {
        reference: 'scheduleEl',
        cls: 'schedule'
    }, {
        reference: 'textEl'
    }],
    defaultBindProperty: 'value',

    updateCls: function (cls, oldCls) {
        var el = this.element;

        if (oldCls) {
            el.removeCls(oldCls);
        }

        if (cls) {
            el.addCls(cls);
        }
    },

    updateUi: function (ui, oldUi) {
        var element = this.element,
            barEl = this.barEl,
            baseCls = this.baseCls + '-';

        this.callParent([ui, oldUi]);

        if (oldUi) {
            element.removeCls(baseCls + oldUi);
            barEl.removeCls(baseCls + 'bar-' + oldUi);
        }

        element.addCls(baseCls + ui);
        barEl.addCls(baseCls + 'bar-' + ui);
    },

    updateTextCls: function (textCls) {
        this.backgroundEl.addCls(textCls + ' ' + textCls + '-back');
        this.textEl.addCls(textCls);
    },

    updateValue: function (value, oldValue) {
        var me = this,
            textTpl = me.getTextTpl(),
            barWidth, scheduleWidth;

        if (!value && value !== 0)
            me.element.hide();
        else
            me.element.show();

        if (value > 1) {
            barWidth = 100;
            scheduleWidth = (1 / value) * 100;
            me.element.addCls('yz-widget-progress-overtime');
        }
        else {
            barWidth = value * 100;
            scheduleWidth = 100;
            me.element.removeCls('yz-widget-progress-overtime');
        }

        if (textTpl) {
            me.setText(textTpl.apply({
                value: value,
                percent: value * 100
            }));
        }

        me.scheduleEl.setStyle('width', scheduleWidth + '%');
        me.barEl.setStyle('width', barWidth + '%');
    },

    updateText: function (text) {
        this.backgroundEl.setHtml(text);
        this.textEl.setHtml(text);
    },

    doDestroy: function () {
        this.stopBarAnimation();
        this.callParent();
    },

    privates: {
        startBarAnimation: Ext.privateFn,
        stopBarAnimation: Ext.privateFn
    }
});