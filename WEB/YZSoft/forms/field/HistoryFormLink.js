/*
value: string/object
       string - taskid
       object -
       {
            taskid:123,
            text:'点击打开采购申请'
       }

*/
Ext.define('YZSoft.forms.field.HistoryFormLink', {
    extend: 'YZSoft.forms.field.HyperLink',
    requires: [
        'YZSoft.bpm.src.ux.FormManager'
    ],

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            activeText: me.getAttribute('ActiveText'),
            emptyText: me.getAttribute('EmptyText'),
            windowModel: me.getAttribute('WindowModel') || 'Window',
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

        if (Ext.isEmpty(value)) {
            if (!disabled) {
                me.setHref(null);
                me.setText(text || et.emptyText, false, value)
            }
            else {
                me.setHref(null);
                me.setText(text || et.activeText, true, value)
            }
        }
        else {
            me.setHref('#');
            me.setText(text || et.activeText, true, value)
        }
    },

    setValue: function (value, text) {
        var me = this,
            et = me.getEleType(),
            disabled = me.disabled,
            ctrls = me.controls,
            value = value || '';

        if (Ext.isObject(value)) {
            me.setValue(value.taskid, Ext.isEmpty(value.taskid) ? et.emptyText : value.text);
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

    setText: function (text, convert, value) {
        var me = this,
            ctrls = me.controls;

        if (convert && text && Ext.isString(text) && text.charAt(0) == '#') { //以#开头
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
                params: { Method: 'GetTaskInfo', TaskID: value },
                success: function (action) {
                    var fieldName = text.substring(1),
                        fieldValue = action.result[fieldName];

                    me.setText(fieldValue, false);
                },
                failure: function (action) {
                    me.setText(text, false);
                }
            });
        }
        else {
            //innerText引起嵌套Grid中，多出了<br/>
            ctrls.dom.link.innerHTML = text || 'HyperLink';
        }
    },

    onClick: function (e) {
        var me = this,
            et = me.getEleType(),
            value = me.getValue(),
            config = {},
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        e.stopEvent();

        if (!value)
            return;

        if (et.width > 0)
            config.width = et.width;

        if (et.height > 0)
            config.height = et.height;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Form.ashx'),
            params: {
                Method: 'GetReadToken',
                taskid: value
            },
            success: function (action) {
                YZSoft.bpm.src.ux.FormManager.openTaskForRead(value, Ext.apply({
                    dlgModel: et.windowModel,
                    params: {
                        token: action.result.token
                    }
                }, config));
            }
        });
    }
});