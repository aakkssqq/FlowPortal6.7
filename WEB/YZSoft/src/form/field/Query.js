
Ext.define('YZSoft.src.form.field.Query', {
    extend: 'Ext.form.field.TextArea',
    cls: 'yz-form-field-code',
    inputAttrTpl: new Ext.XTemplate([
        'wrap="off"'
    ]),

    insertAtCaret: function (text) {
        var me = this,
            dom = me.inputEl.dom,
            value = me.getValue() || '',
            text = text || '';

        if (dom.selectionStart || dom.selectionStart === 0) {
            var startPos = dom.selectionStart,
                endPos = dom.selectionEnd;

            me.setValue(value.substring(0, startPos) + text + value.substring(endPos, value.length));
            dom.selectionStart = startPos + (me.selectInserting ? 0 : text.length);
            dom.selectionEnd = startPos + text.length;
        }
        else if (document.selection) {
            dom.focus();
            var sel = document.selection.createRange();
            sel.text = text;
        } else {
            tag.setValue(value + text);
        }
    }
});