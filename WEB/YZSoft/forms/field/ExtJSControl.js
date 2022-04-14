
Ext.define('YZSoft.forms.field.ExtJSControl', {
    extend: 'YZSoft.forms.field.Element',
    wrapEleSelector: '.yz-xform-field-wrap',
    xclass: '',

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            wrap: me.down(me.wrapEleSelector, true)
        };
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            sDataBind: me.getDataBind(),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp()
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            wrap: Ext.get(dom.wrap)
        });

        me.component = me.createComponent(Ext.apply({
            width: me.getWidth(),
            height: me.getHeight(),
            value: ''
        }, me.componentConfig));

        me.component.render(ctrls.wrap);
        me.onComponentCreated(me.component);

        if (me.disabled)
            me.setComponentDisabled(me.disabled);
    },

    getValue: function () {
        if (this.component.getValue)
            return this.component.getValue();
    },

    setValue: function (value) {
        if (this.component.setValue)
            this.component.setValue(this.regularValue(value));
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm) {
            me.addCls(disableCssCls);
            return;
        }

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        if (me.component)
            me.setComponentDisabled(disable);
        else
            me.disabled = disable;
    },

    createComponent: function (config) {
        return Ext.create(this.xclass, config);
    },

    onComponentCreated: function (component) {
        var me = this;

        component.on({
            scope: me,
            change: function () {
                me.agent.fireEvent('inputChange', me);
            }
        });

        me.relayEvents(component, ['change']);
        me.fireEvent('componentCreated', component);
    },

    setComponentDisabled: function (disable) {
        this.component.setDisabled(disable);
    }
});