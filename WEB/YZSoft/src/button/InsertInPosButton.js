/*
config
tags
selectInserting
method:
attach
insertAtCaret
*/
Ext.define('YZSoft.src.button.InsertInPosButton', {
    extend: 'Ext.button.Button',
    selectInserting: true,

    attach: function (tags) {
        var me = this;

        me.tags = Ext.isArray(tags) ? tags : [tags];
        Ext.each(me.tags, function (tag) {
            tag.on({
                scope: me,
                focusenter: 'onTargetFocusEnter'
            });
        });
    },

    onTargetFocusEnter: function (tag, e, eOpts) {
        this.lastFocusTag = tag;
    },

    insertAtCaret: function (text, config, tag) {
        var me = this;

        if (!tag) {
            if (me.tags.length == 1) {
                tag = me.tags[0];
            }
            else if (me.lastFocusTag) {
                tag = me.lastFocusTag;
            }

            if (tag) {
                me.insertAtCaret(text, config, tag);
                tag.focus();
            }
            else {
                if (config && config.nofocus)
                    config.nofocus();
            }
        }
        else {
            var dom = tag.inputEl.dom,
                value = tag.getValue() || '',
                text = text || '';

            if (dom.selectionStart || dom.selectionStart === 0) {
                var startPos = dom.selectionStart,
                    endPos = dom.selectionEnd;

                tag.setValue(value.substring(0, startPos) + text + value.substring(endPos, value.length));
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
    }
});