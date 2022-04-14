
Ext.define('YZSoft.report.search.field.ComboBox', {
    extend: 'YZSoft.src.form.field.ComboBox',
    mixins: ['YZSoft.report.search.field.mixin'],
    labelAlign: 'top',
    width: 160,
    editable:false,
    labelSeparator: false,
    config: {
        use: 'ds', //ds,options
        dsDisplayField: null,
        dsValueField: null
    },
    triggers: {
        clear: {
            cls: 'yz-trigger-clear yz-trigger-size-s',
            weight: -1, //排到缺省按钮前
            hidden: true,
            handler: 'onClearClick'
        }
    },

    initComponent: function() {
        var me = this;

        me.on({
            scope: me,
            change: 'updateClearTrigger'
        });

        if (me.use == 'ds') {
            me.store = me.createStoreFromDs(me.ds);
            me.store && me.store.load();
            if (me.dsDisplayField)
                me.displayField = me.dsDisplayField;
            if (me.dsValueField)
                me.valueField = me.dsValueField;
        }
        else {
            me.store = me.createStoreFromOptions(me.options);
            me.valueField = 'value';
            me.displayField = 'text';
        }

        me.callParent();

        if (!me.designModel && !Ext.isEmpty(me.defaultValue))
            me.setValue(me.defaultValue);
    },

    updateDs: function (newValue) {
        if (!this.initlized)
            return;

        var me = this;

        if (me.use != 'ds')
            return;

        if (me.dsDisplayField)
            me.setDisplayField(me.dsDisplayField);
        if (me.dsValueField)
            me.valueField = me.dsValueField;

        me.callParent(arguments);
    },

    updateOptions: function (newValue) {
        if (!this.initlized)
            return;

        var me = this;

        if (me.use != 'options')
            return;

        me.callParent(arguments);
    },

    updateUse: function (newValue) {
        if (!this.initlized)
            return;

        var me = this;

        if (newValue == 'ds')
            me.updateDs(me.ds);
        else
            me.updateOptions(me.options);
    },

    updateDsDisplayField: function (newValue) {
        var me = this;

        if (me.use == 'ds') {
            me.setDisplayField(me.dsDisplayField);
            if (me.picker) {
                me.picker.setDisplayField(newValue);
            }
        }
    },

    updateDsValueField: function (newValue) {
        var me = this;

        if (me.use == 'ds') {
            me.valueField = me.dsValueField;
        }
    },

    onClearClick: function() {
        this.clearValue();
    },

    updateClearTrigger: function() {
        var me = this,
            value = me.getValue(),
            clear = me.getTrigger('clear');

        Ext.defer(function() {
            if (value !== null) //清除时value为空，选择项的值也可能为空字符串
                clear.show();
            else
                clear.hide();

            me.updateLayout();
        }, 1);
    },

    applyDisplayTpl: function (displayTpl) {
        var me = this;

        if (!displayTpl) {
            displayTpl = new Ext.XTemplate(
                '<tpl for=".">' +
                '{[typeof values === "string" ? values : values["' + me.getDisplayField() + '"]]}' +
                '<tpl if="xindex < xcount">' + me.getDelimiter() + '</tpl>' +
                '</tpl>'
            );
            displayTpl.auto = true;
        } else if (!displayTpl.isTemplate) {
            displayTpl = new Ext.XTemplate(displayTpl);
        }
        return displayTpl;
    },

    updateValue: function () {
        var me = this,
            selectedRecords = me.valueCollection.getRange(),
            len = selectedRecords.length,
            valueArray = [],
            displayTplData = me.displayTplData || (me.displayTplData = []),
            inputEl = me.inputEl,
            i, record, displayValue;

        // Loop through values, matching each from the Store, and collecting matched records 
        displayTplData.length = 0;
        for (i = 0; i < len; i++) {
            record = selectedRecords[i];
            displayTplData.push(me.getRecordDisplayData(record));

            // There might be the bogus "value not found" record if forceSelect was set. Do not include this in the value. 
            if (record !== me.valueNotFoundRecord) {
                valueArray.push(record.get(me.valueField));
            }
        }

        // Set the value of this field. If we are multiselecting, then that is an array. 
        me.setHiddenValue(valueArray);
        me.value = me.multiSelect ? valueArray : valueArray[0];
        if (!Ext.isDefined(me.value)) {
            me.value = undefined;
        }
        me.displayTplData = displayTplData; //store for getDisplayValue method 

        displayValue = me.getDisplayValue();
        // Calculate raw value from the collection of Model data 
        me.setRawValue(displayValue);
        me.refreshEmptyText();
        me.checkChange();

        if (!me.lastSelectedRecords && selectedRecords.length) {
            me.lastSelectedRecords = selectedRecords;
        }

        if (inputEl && me.typeAhead && me.hasFocus) {
            // if typeahead is configured, deselect any partials 
            me.selectText(displayValue.length);
        }
    },

    getDSFilter: function (paramName) {
        var me = this,
            value = me.getValue();

        return [{
            name: paramName,
            op: '=',
            value: value
        }];
    }
});