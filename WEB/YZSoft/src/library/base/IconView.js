
Ext.syncRequire('YZSoft.src.ux.EmptyText');

Ext.define('YZSoft.src.library.base.IconView', {
    extend: 'Ext.view.View',
    scrollable: true,
    cls: 'yz-dataview-icons',
    tpl: [
        '<tpl for=".">',
            '<tpl if="$$$isFolder">',
                '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-icon yz-dataview-item-icon-folder">',
                    '<div class="inner">',
                    '</div>',
                    '<div class="txt">',
                        '{Name}',
                    '</div>',
                '</div>',
            '</tpl>',
            '<tpl if="$$$isObject">',
                '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-icon yz-iconview-item-icon-object">',
                    '<div class="inner">',
                        '<img class="img" src="{icon}">',
                    '</div>',
                    '<div class="txt">',
                        '{Name}',
                    '</div>',
                '</div>',
            '</tpl>',
        '</tpl>'
    ],
    overItemCls: 'yz-dataview-item-over',
    selectedItemCls: 'yz-dataview-item-selected',
    itemSelector: '.yz-dataview-item',
    txtSelector: '.yz-dataview-item .txt',
    emptyText: YZSoft.src.ux.EmptyText.create({
        center: true,
        glyph: 0xeb41,
        text: RS.$('All_EmptyText_EmptyFolder')
    }),
    dblClickOpenFolder: true,
    libPanel:null,

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.editor = new Ext.Editor({
            updateEl: false,
            shadow: false,
            alignment: 'l-l',
            autoSize: {
                width: 'boundEl'
            },
            field: {
                xtype: 'textfield'
            }
        });

        me.editor.on({
            scope: me,
            complete: 'onRenameComplete'
        });

        me.on({
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                me.getSelectionModel().select(record);
            }
        });
    },

    startRename: function (rec, fieldName, context) {
        var me = this,
            el = Ext.get(me.getNode(rec)).down(me.txtSelector),
            dom = el.dom;

        context = context || {};
        context.record = rec;
        context.value = Ext.String.trim(dom.textContent || dom.innerText || dom.innerHTML);
        context.fieldName = fieldName;
        me.editor.context = context
        me.editor.startEdit(el);
    },

    onRenameComplete: function (editor, value, startValue, eOpts) {
        var me = this,
            context = editor.context,
            rec = context.record,
            fieldName = context.fieldName,
            params;

        Ext.apply(context, {
            value: value,
            originalValue: startValue
        });

        me.fireEvent('validateedit', editor, context);

        if (context.cancel !== true)
            rec.set(fieldName, value);
    }
});
