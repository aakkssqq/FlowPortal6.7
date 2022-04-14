
Ext.define('YZSoft.src.picker.Color', {
    extend: 'Ext.Component',
    requires: [
        'Ext.XTemplate',
        'Ext.draw.Color'
    ],
    alias: 'widget.yzcolorpicker',
    alternateClassName: 'Ext.ColorPalette',
    componentCls: 'yz-color-picker',
    selectedCls: 'yz-color-picker-item-selected',
    itemCls: 'yz-color-picker-item',
    value: null,
    clickEvent: 'click',
    allowReselect: true,
    shortColors: [
        'FFFFFF', 'E5E5E5', 'CFCFCF', 'B8B8B8', 'A1A1A1', '8A8A8A', '737373', '5C5C5C', '454545', '323232', '171717', '000000'
    ],
    colors: [
        'FFCCCC', 'FFE6CC', 'FFFFCC', 'E6FFCC', 'CCFFCC', 'CCFFE6', 'CCFFFF', 'CCE5FF', 'CCCCFF', 'E5CCFF', 'FFCCFF', 'FFCCE6',
        'FF9999', 'FFCC99', 'FFFF99', 'CCFF99', '99FF99', '99FFCC', '99FFFF', '99CCFF', '9999FF', 'CC99FF', 'FF99FF', 'FF99CC',
        'FF6666', 'FFB366', 'FFFF66', 'B3FF66', '66FF66', '66FFB3', '66FFFF', '66B2FF', '6666FF', 'B266FF', 'FF66FF', 'FF66B3',
        'FF3333', 'FF9933', 'FFFF33', '99FF33', '33FF33', '33FF99', '33FFFF', '3399FF', '3333FF', '9933FF', 'FF33FF', 'FF3399',
        'FF0000', 'FF8000', 'FFFF00', '80FF00', '00FF00', '00FF80', '00FFFF', '007FFF', '0000FF', '7F00FF', 'FF00FF', 'FF0080',
        'CC0000', 'CC6600', 'CCCC00', '66CC00', '00CC00', '00CC66', '00CCCC', '0066CC', '0000CC', '6600CC', 'CC00CC', 'CC0066',
        '990000', '994C00', '999900', '4D9900', '009900', '00994D', '009999', '004C99', '000099', '4C0099', '990099', '99004D',
        '660000', '663300', '666600', '336600', '006600', '006633', '006666', '003366', '000066', '330066', '660066', '660033',
        '330000', '331A00', '333300', '1A3300', '003300', '00331A', '003333', '001933', '000033', '190033', '330033', '33001A'
    ],
    colorRe: /(?:^|\s)color-(.{6})(?:\s|$)/,
    renderTpl: [
        '<div class="yz-color-picker-wrap yz-color-picker-wrap-short">',
        '<tpl for="shortColors">',
            '<div style="background:#{.}" class="color-{.} {parent.itemCls}" hidefocus="on">',
            '</div>',
        '</tpl>',
        '</div>',
        '<div class="yz-color-picker-wrap yz-color-picker-wrap-main">',
        '<tpl for="colors">',
            '<div style="background:#{.}" class="color-{.} {parent.itemCls}" hidefocus="on">',
            '</div>',
        '</tpl>',
        '</div>',
        '<div class="yz-color-picker-wrap-input">',
            '#<input type="text" class="yz-color-picker-input"/>',
            '<tpl if="transparent">',
                '<a href="#" class="yz-color-picker-transparent"/>' + RS.$('All_Transparent') + '</a>',
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
        var me = this;
        return Ext.apply(me.callParent(), {
            itemCls: me.itemCls,
            colors: me.colors,
            shortColors: me.shortColors,
            transparent: me.transparent
        });
    },

    onRender: function () {
        var me = this,
            clickEvent = me.clickEvent,
            el = me.el;

        me.callParent(arguments);

        me.inputEl = el.down('.yz-color-picker-input');
        me.inputEl.on({
            keydown: function (e) {
                if (e.getKey() == e.ENTER) {
                    var color = me.inputEl.dom.value;
                    me.fireEvent('select', me, '#' + color);
                }
            }
        });

        me.btnTransEl = el.down('.yz-color-picker-transparent');
        if (me.btnTransEl) {
            me.btnTransEl.on({
                click: function (e) {
                    e.stopEvent();
                    me.fireEvent('select', me, 'none');
                }
            });
        }

        me.mon(me.el, clickEvent, me.handleClick, me, { delegate: 'div' });
        me.mon(me.el, 'mouseover', me.mouseEnter, me, { delegate: 'div' });
        if (clickEvent !== 'click') {
            me.mon(me.el, 'click', Ext.emptyFn, me, { delegate: 'div', stopEvent: true });
        }
    },

    afterRender: function () {
        var me = this,
            value;

        me.callParent(arguments);
        if (me.value) {
            value = me.value;
            me.value = null;
            me.select(value, true);
        }
    },

    mouseEnter: function (event) {
        var me = this,
            color;

        event.stopEvent();
        if (!me.disabled) {
            var matchs = event.currentTarget.className.match(me.colorRe);
            if (matchs && matchs.length >= 1) {
                color = event.currentTarget.className.match(me.colorRe)[1];
                me.hover(color.toUpperCase());
            }
        }
    },

    handleClick: function (event) {
        var me = this,
            color;

        event.stopEvent();
        if (!me.disabled) {
            var matchs = event.currentTarget.className.match(me.colorRe);
            if (matchs && matchs.length >= 1) {
                color = event.currentTarget.className.match(me.colorRe)[1];
                me.select(color.toUpperCase());
            }
        }
    },

    select: function (color, suppressEvent) {
        var me = this,
            selectedCls = me.selectedCls,
            value = me.value,
            el, item;

        color = (color || '').replace('#', '').toUpperCase();
        if (!me.rendered) {
            me.value = color;
            return;
        }

        if (color !== value || me.allowReselect) {
            el = me.el;

            if (me.value) {
                item = el.down('div.color-' + value, true);
                if (item)
                    Ext.fly(item).removeCls(selectedCls);
            }

            item = el.down('div.color-' + color, true);

            if (item)
                Ext.fly(item).addCls(selectedCls);

            me.value = color;
            me.inputEl.dom.value = color;
            if (suppressEvent !== true) {
                me.fireEvent('select', me, '#' + color);
            }
        }
    },

    hover: function (color) {
        this.inputEl.dom.value = color;
    },

    clear: function () {
        var me = this,
            value = me.value,
            el;

        if (value && me.rendered) {
            el = me.el.down('a.color-' + value, true);
            Ext.fly(el).removeCls(me.selectedCls);
        }
        me.value = null;
    },

    getValue: function () {
        return this.value || null;
    }
});