
Ext.define('YZSoft.src.layout.Flex', {
    extend: 'Ext.layout.container.Container',
    alias: ['layout.flex'],
    type: 'flex',
    childEls: [
        'outerCt',
        'innerCt'
    ],

    managePadding: true,
    outerCtCls: 'yz-flexcontainer-outer',
    innerCtCls: 'yz-flexcontainer-inner d-flex',
    cls:'',

    renderTpl: [
        '<div id="{ownerId}-outerCt" data-ref="outerCt" class="{outerCtCls}" role="presentation">',
            '<div id="{ownerId}-innerCt" data-ref="innerCt" style="{%this.renderPadding(out, values)%}" class="{innerCtCls}">',
                '{%this.renderBody(out,values)%}',
            '</div>',
        '</div>'
    ],

    getRenderTarget: function () {
        return this.innerCt;
    },

    getElementTarget: function () {
        return this.innerCt;
    },

    getContentTarget: function () {
        return this.innerCt;
    },

    setupRenderTpl: function (renderTpl) {
        this.callParent(arguments);
        renderTpl.renderPadding = this.doRenderPadding;
    },

    //将容器的padding设置到innerCt上
    doRenderPadding: function (out, renderData) {
        var me = renderData.$layout,
            owner = renderData.$layout.owner,
            padding = owner[owner.contentPaddingProperty];

        if (me.managePadding && padding) {
            out.push('padding:', owner.unitizeBox(padding));
        }
    },

    getRenderData: function () {
        var me = this,
            data = me.callParent();

        data.innerCtCls = me.innerCtCls + ' ' + me.cls;
        data.outerCtCls = me.outerCtCls;

        return data;
    }
});