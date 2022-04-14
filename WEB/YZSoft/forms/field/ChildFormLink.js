/*
value: string/object
*/
Ext.define('YZSoft.forms.field.ChildFormLink', {
    extend: 'YZSoft.forms.field.HyperLink',
    requires: [
        'YZSoft.bpm.src.ux.FormManager'
    ],

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            NoCopy: true,
            formApplication: me.getAttribute('FormApplication'),
            filterNoAffect: true,
            forceFilter: true,
            sDataSource: me.getDataSource(),
            sDataMap: me.getMap(),
            text: me.dom.innerText,
            windowModel: me.getAttribute('WindowModel') || 'Dialog',
            width: me.getAttributeNumber('popupwndwidth', -1),
            height: me.getAttributeNumber('popupwndheight', -1)
        });

        return config;
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls;

        return me.getAttribute('Value');
    },

    updateLink: function (value, disabled) {
        var me = this,
            et = me.getEleType(),
            text = me.text;

        me.setHref(disabled && Ext.isEmpty(value) ? null : '#');
        me.setText(text || et.text)
    },

    setValue: function (value, text) {
        var me = this,
            et = me.getEleType(),
            disabled = me.disabled,
            ctrls = me.controls,
            value = value || '';

        if (Ext.isObject(value)) {
            me.setValue(value.key, Ext.isEmpty(value.text) ? et.text : value.text);
        }
        else {
            me.text = text;
            me.updateLink(value, disabled);
            me.setAttribute('Value', value);
        }
    },

    setDisabled: function (disable) {
        var me = this,
            value = me.getValue();

        me.disabled = disable;
        me.updateLink(value, disable);
    },

    setText: function (text) {
        var me = this,
            ctrls = me.controls;

        //innerText引起嵌套Grid中，多出了<br/>
        ctrls.dom.link.innerHTML = text || 'HyperLink';
    },

    onClick: function (e) {
        var me = this,
            et = me.getEleType(),
            key = me.getValue(),
            config = {},
            filters = me.getCurrentFilters(),
            params = { childform: 1 },
            writable = false,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        e.stopEvent();

        if (me.disabled && Ext.isEmpty(key))
            return;

        if (!et.formApplication) {
            YZSoft.alert(RS.$('Form_Error_ChildFormLinkNoFormApplication'));
            return;
        }

        for (var paramName in filters) {
            if (filters.hasOwnProperty(paramName))
                params[paramName] = filters[paramName].value;
        }

        if (et.DataBind && et.DataBind.DataColumn && et.DataBind.DataColumn.Writeable)
            writable = true;

        if (et.width > 0)
            config.width = et.width;

        if (et.height > 0)
            config.height = et.height;

        //params && params.formState ? params.formState : (writable ? 'edit' : 'read') 第2个参数这样
        YZSoft.bpm.src.ux.FormManager.openFormApplication(et.formApplication, key, writable ? 'edit' : 'read', Ext.apply({
            dlgModel: et.windowModel,
            params: params,
            listeners: {
                afterSaveFormApplication: function (data) {
                    me.setValue(data.Key);
                    me.mapvalues = data;
                    me.agent.onDataAvailable(me);
                }
            }
        }, config));
    },

    doMap: function () {
        var me = this,
            rows = me.rows || [],
            row = rows[0] || {},
            et = me.getEleType();

        if (et && et.DataMap)
            me.doMapSingline(row, et.DataMap.kvs);
    }
});