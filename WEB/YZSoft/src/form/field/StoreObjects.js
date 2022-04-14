/*
singleSelection default:false
*/
Ext.define('YZSoft.src.form.field.StoreObjects', {
    extend: 'YZSoft.src.form.field.List',
    beforeLabelTextTpl: [],
    afterLabelTextTpl: [],
    addable:false,

    renderItem: function (rec) {
        var me = this,
            nameField = me.nameField;

        return nameField ? rec.data[nameField] : rec.getId();
    }
});