
Ext.define('YZSoft.src.flowchart.editor.TextEditorFixWidth', {
    extend: 'YZSoft.src.flowchart.editor.TextEditorBase',
    autoEl: 'textarea',
    cls: 'yz-sprite-text-editor yz-sprite-text-editor-fixwidth',

    autoSize: function () {
        var me = this,
            el = me.inputEl,
            dom = el.dom,
            roffset = me.rotationCenterOffset,
            growy = 0,
            h;

        dom.style.height = '1px';
        h = dom.scrollHeight + me.offsety;

        if (me.grow && me.grow.y) {
            growy = h * me.grow.y;
            dom.style.top = (me.startPos.y + growy) + 'px';
        }

        dom.style.height = h + 'px';
        dom.style.transformOrigin = Ext.String.format('{0}px {1}px', roffset.x, Math.round(roffset.y - growy));
    }
});