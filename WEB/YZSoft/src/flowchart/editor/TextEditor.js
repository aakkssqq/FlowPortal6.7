
Ext.define('YZSoft.src.flowchart.editor.TextEditor', {
    extend: 'YZSoft.src.flowchart.editor.TextEditorBase',
    autoEl: 'textarea',
    cls: 'yz-sprite-text-editor yz-sprite-text-editor-growwidth',

    autoSize: function () {
        var me = this,
            el = me.inputEl,
            dom = el.dom,
            h;

        dom.style.width = '1px';
        dom.style.height = '1px';
        w = dom.scrollWidth + me.offsetx;
        h = dom.scrollHeight + me.offsety;

        if (me.grow && me.grow.y)
            dom.style.top = (me.startPos.y + h * me.grow.y) + 'px';

        if (me.grow && me.grow.x)
            dom.style.left = (me.startPos.x + w * me.grow.x) + 'px';

        dom.style.width = w + 'px';
        dom.style.height = h + 'px';
    }
});