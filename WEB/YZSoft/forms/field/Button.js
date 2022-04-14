
Ext.define('YZSoft.forms.field.Button', {
    extend: 'YZSoft.forms.field.Element',
    onClick: Ext.emptyFn,

    getEleTypeConfig: function () {
        var me = this;

        return {
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp()
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls = me.controls || {};

        me.dom.id = Ext.id();
        Ext.apply(ctrls, {
            button: Ext.get(me.dom)
        });

        ctrls.button.on({
            scope: me,
            click: function (e) {
                if (!me.dom.disabled) { //IE10 bug 按钮disable 还能触发click事件
                    Ext.defer(function () { //IE10 bug 处理程序中存在错误，会导致click事件不断发送
                        me.onClick(e);
                    }, 1);
                }
            }
        });
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        me.dom.disabled = disable;

        if (readForm) {
            me.addCls(disableCssCls);
            return;
        }

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);
    }
});