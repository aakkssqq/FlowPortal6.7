/*
onBrowser
renderItem(data);
*/

Ext.define('YZSoft.src.form.field.List', {
    extend: 'Ext.form.field.Text',
    requires: [
        'Ext.XTemplate'
    ],
    cls: 'yz-form-field-strlist',
    addable: true,

    beforeLabelTextTpl: [
        '<a class="yz-fieldlabel-clickable" href="#">',
    ],
    afterLabelTextTpl: [
        '</a>',
    ],

    preSubTpl: [
        '<div id="{cmpId}-triggerWrap" data-ref="triggerWrap" class="{triggerWrapCls} {triggerWrapCls}-{ui}">',
            '<div id={cmpId}-inputWrap data-ref="inputWrap" class="{inputWrapCls} {inputWrapCls}-{ui}">'
    ],

    postSubTpl: [
            '</div>',
            '<tpl for="triggers">{[values.renderTrigger(parent)]}</tpl>',
        '</div>'
    ],

    fieldSubTpl: [
        '<div id="{id}" role="{role}" {inputAttrTpl}',
            '<tpl if="disabled"> disabled="disabled"</tpl>',
            '<tpl if="tabIdx != null"> tabindex="{tabIdx}"</tpl>',
            ' class="{fieldCls} {typeCls} {typeCls}-{ui} {inputCls}" ',
            '>\n',
        '</div>',{
            disableFormats: true
        }
    ],

    growMin: 20,
    growMax: 100,
    publishValue: Ext.emptyFn,

    listConfig: {
    },

    //inputCls: Ext.baseCSSPrefix + 'form-textarea1',

    constructor: function (config) {
        var me = this,
            config = config || {},
            listConfig = Ext.apply({}, me.listConfig);

        listConfig = Ext.copyTo(listConfig, config, 'emptyText,value');

        if (listConfig.emptyText)
            listConfig.emptyText = '<div class="yz-form-field-strlist-empty-text">' + listConfig.emptyText + '</div>';

        Ext.apply(listConfig, config.listConfig);

        me.list = me.createList(listConfig, config.height ? true : false);
        me.list.addCls('yz-dataview-strlist');
        me.callParent(arguments);
    },

    afterRender: function () {
        var me = this;

        me.list.render(me.inputEl);

        if (me.addable) {
            me.labelEl.on('click', function () {
                if (!me.disabled)
                    me.onBrowser();
            });

            me.inputEl.on('click', function () {
                if (!me.disabled)
                    me.onBrowser();
            });
        }

        me.defaultHeight = me.getHeight();
        me.callParent(arguments);
    },

    createList: function (config, fixheight) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            fields: [
                { name: 'tag' }
            ],
            data: [
            ],
            listeners: {
                datachanged: function () {
                    if (me.rendered) {
                        me.updateLayout();
                        me.fireEvent('change');
                    }
                    else {
                        me.on({
                            single: true,
                            afterrender: function () {
                                me.updateLayout();
                                me.fireEvent('change');
                            }
                        });
                    }
                }
            }
        });

        cfg = {
            trackOver: true,
            deferEmptyText: false,
            store: me.store,
            overItemCls: 'yz-dataview-item-strlist-over',
            itemSelector: '.yz-dataview-item-strlist',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="yz-dataview-item yz-dataview-item-block yz-dataview-item-strlist">',
                        '<div class="d-flex flex-row align-items-center">',
                            '<div class="text">{tag:this.renderItem}</div>',
                            '<div class="del"></div>',
                         '</div>',
                    '</div>',
                '</tpl>', {
                renderItem: function (value) {
                    return me.renderItem(value) || '&nbsp;';
                }
            })
        };

        Ext.apply(cfg, config);

        me.list = Ext.create('Ext.view.View', cfg);

        me.list.on({
            itemclick: function (view, record, item, index, e, eOpts) {
                e.stopEvent();

                if (me.disabled)
                    return;

                var target = Ext.fly(e.getTarget());
                if (target.hasCls('del')) {
                    me.store.remove(record);
                }
            }
        });

        if (!fixheight) {
            me.list.on({    //否则有初始值时和下一行会空开很大，如：BPA职责与分工页签
                resize: function () {
                    me.setHeight(Math.max(me.list.getHeight() + 2, me.defaultHeight));
                    me.list.refreshSize(true);
                }
            });
        }

        return me.list;
    },

    onBrowser: function () {
        this.fireEvent('browserClick', this.getValue(), this);
    },

    renderItem: function (data) {
        return data.name;
    },

    clear: function () {
        var me = this,
            recs = me.store.getRange(0, me.getValue().length);

        me.store.remove(recs);
    },

    addRecords: function (value, clear) {
        this.add(value, clear);
    },

    add: function (value, clear) {
        var me = this,
            values = value ? (Ext.isArray(value) ? value : [value]) : [];

        if (clear === true)
            me.clear();

        var adds = [];
        Ext.each(values, function (val) {
            adds.push({ tag: val });
        });

        return me.store.insert(me.getValue().length, adds);
    },

    setValue: function (value) {
        if (value)
            return this.add(value, true);
        else
            this.clear();
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.store.each(function (item, index, length) {
            rv.push(item.data.tag);
        });

        return rv;
    }
});