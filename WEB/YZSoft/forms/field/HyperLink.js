
Ext.define('YZSoft.forms.field.HyperLink', {
    extend: 'YZSoft.forms.field.Element',
    eleSelector: '.yz-xform-field-hyperlink',
    onClick: Ext.emptyFn,

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            link: me.down(me.eleSelector, true)
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            link: Ext.get(dom.link)
        });

        ctrls.link.on({
            scope: me,
            click: 'onClick'
        });
    },

    getEleTypeConfig: function () {
        var me = this,
            ctrls = me.controls;

        return {
            sDataBind: me.getDataBind(),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp(),
            defaultText: ctrls.dom.link.innerText || 'HyperLink'
        };
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.link.getAttribute('href') || '';
    },

    setValue: function (value) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls;

        if (Ext.isObject(value)) {
            me.setHref(value.url || '');
            ctrls.dom.link.innerText = value.text || et.defaultText;
        }
        else {
            me.setHref(value || '');
        }
    },

    setHref: function (url) {
        var me = this,
            ctrls = me.controls;

        if (!url) {
            ctrls.dom.link.removeAttribute('href');
            me.addCls('yz-xform-field-notaviliable');
            ctrls.dom.link.disabled = true;
        }
        else {
            ctrls.dom.link.setAttribute('href', url);
            me.removeCls('yz-xform-field-notaviliable');
            ctrls.dom.link.disabled = false;
        }
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        ctrls.dom.link.disabled = disable;
    },

    onClick: function (e) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (me.hasCls(disableCssCls)) {
            e.stopEvent();
        }
    }
});