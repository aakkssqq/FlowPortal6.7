
Ext.define('YZSoft.im.src.face.Picker', {
    extend: 'Ext.Component',
    requires: [
        'Ext.XTemplate',
        'YZSoft.im.src.face.Faces'
    ],
    itemCls: 'yz-qqface-picker-item',
    itemSelector: '.yz-qqface-picker-item',
    renderTpl: [
        '<div class="yz-qqface-picker-wrap yz-qqface-picker-wrap-main">',
        '<tpl for="faces">',
            '<div style="" qtip="{text}" faceid="{id}" class="{parent.itemCls} face-{id}" hidefocus="on">',
            '</div>',
        '</tpl>',
        '</div>'
    ],

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        if (me.handler) {
            me.on('select', me.handler, me.scope, true);
        }
    },

    initRenderData: function () {
        var me = this,
            faces = [];

        Ext.Array.each(YZSoft.im.src.face.Faces.qq, function (face) {
            faces.push({
                id: face.id,
                text: face.text
            });
        });

        return Ext.apply(me.callParent(), {
            itemCls: me.itemCls,
            faces: faces
        });
    },

    onRender: function () {
        var me = this,
            el = me.el;

        me.callParent(arguments);

        me.mon(me.el, 'click', me.handleClick, me, { delegate: 'div' });
    },

    handleClick: function (event) {
        var me = this,
            target = event.getTarget(me.itemSelector);

        if (target) {
            event.stopEvent();

            var faceid = Ext.fly(target).getAttribute('faceid');
            me.fireEvent('select', faceid);
        }
    }
});