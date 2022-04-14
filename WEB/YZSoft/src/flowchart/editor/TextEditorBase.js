
Ext.define('YZSoft.src.flowchart.editor.TextEditorBase', {
    extend: 'Ext.Component',
    cls: 'yz-sprite-text-editor',
    ESC: 'endedit',

    setXY: function (xy, animate) {
        var me = this;

        me.startPos = {
            x: xy[0],
            y: xy[1]
        };
        me.callParent(arguments);
    },

    onRender: function () {
        var me = this;

        me.callParent(arguments);

        me.inputEl = me.el;

        var event = Ext.isIE8 ? 'keyup' : 'input';
        me.inputEl.on(event, me.autoSize, me);

        me.inputEl.on({
            scope: me,
            blur: 'onBlur'
        });

        me.keyMap = Ext.create('Ext.util.KeyMap', {
            target: Ext.getBody(),
            key: Ext.event.Event.ESC,
            fn: function (key, e) {
                me.hide();

                if (me.ESC == 'cancel')
                    (me.eventOwner || me).fireEvent('cancel');
                if (me.ESC == 'endedit')
                    (me.eventOwner || me).fireEvent('endedit', me.inputEl.getValue());
            },
            scope: me
        });

        me.offsety = /*me.inputEl.getPadding('tb') + */me.inputEl.getBorderWidth('tb');
        me.offsetx = /*me.inputEl.getPadding('lr') + */me.inputEl.getBorderWidth('lr');
    },

    setContentWidth: function (width) {
        var me = this,
            el = me.inputEl,
            dom = el.dom;

        dom.style.width = (width + me.offsetx) + 'px';
    },

    setFont: function (font) {
        var me = this;
        me.inputEl.setStyle({
            font: font
        });
    },

    setTextAlign: function (align) {
        var me = this;
        me.inputEl.setStyle({
            textAlign: align
        });
    },

    setTextColor: function (color) {
        var me = this;
        me.inputEl.setStyle({
            color: color
        });
    },

    setText: function (text) {
        var me = this;
        me.inputEl.dom.value = text;
    },

    setOrientation: function (orientation) {
        var me = this;

        if (orientation == 'vertical')
            me.inputEl.addCls('yz-sprite-text-editor-verti');
        else
            me.inputEl.removeCls('yz-sprite-text-editor-verti');
    },

    onBlur: function () {
        var me = this;

        me.showBy(Ext.getBody(), 'tl', [-1000, -1000]);
        me.hide();
        (me.eventOwner || me).fireEvent('endedit', me.inputEl.getValue());
    }
});