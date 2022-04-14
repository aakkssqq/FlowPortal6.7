Ext.define('YZSoft.bpa.sprite.BPMN.Task.Sprite', {
    extend: 'YZSoft.bpa.sprite.BPMN.Sprite',
    switchable: true,
    supportBoundaryEvent: true,
    resizeUpdateHoldItemPosition: true,
    inheritableStatics: {
        def: {
            processors: {
                radius: 'number'
            },
            defaults: {
                width: 90,
                height: 60,
                radius: 6,
                strokeStyle: '#000',
                fillStyle: '#fff',
                lineWidth: 2
            },
            triggers: {
                radius: 'path'
            }
        }
    },

    constructor: function (config) {
        var me = this;

        me.sprites = Ext.apply({
            text: {
                xclass: 'YZSoft.src.flowchart.sprite.BoxText',
                text: '',
                textAlign: 'center',
                textBaseline: 'middle',
                fontFamily: RS.$('All_BPA_FontFamily'),
                fontSize: 13,
                fillStyle: 'black',
                background: {
                    fillStyle: 'none'
                },
                editable: true
            }
        }, me.sprites);

        me.callParent(arguments);

        me.on({
            scope: me,
            sizeChangedUI: 'onSizeChangedUI'
        });
    },

    updateChildText: function (sprite, attr) {
        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: attr.x,
            top: attr.y,
            width: attr.width,
            height: attr.height,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    },

    beforeCreateChildIcon: function (cfg) {
        cfg.src = YZSoft.$url(this, cfg.src);
    },

    updateChildIcon: function (sprite, attr) {
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height,
            r = Math.min(attr.radius, Math.abs(attr.height) * 0.5, Math.abs(attr.width) * 0.5);

        if (r === 0) {
            path.rect(x, y, w, h);
        } else {
            path.moveTo(x + r, y);
            path.arcTo(x + w, y, x + w, y + h, r);
            path.arcTo(x + w, y + h, x, y + h, r);
            path.arcTo(x, y + h, x, y, r);
            path.arcTo(x, y, x + r, y, r);
        }
    },

    getHoldItems: function () {
        return this.holdItems || [];
    },

    onSizeChangedUI: function (attr) {
        this.updateHoldItems();
    },

    updateHoldItems: function () {
        var me = this,
            holdItems = me.holdItems || [],
            bbox = me.getBBox(false);

        bbox.left = bbox.x;
        bbox.top = bbox.y;
        bbox.right = bbox.x + bbox.width;
        bbox.bottom = bbox.y + bbox.height;

        Ext.each(holdItems, function (item) {
            if (item.isDestroyed)
                return;

            switch (item.docked && item.docked.dock) {
                case 'top':
                    item.setAttributes({
                        translationY: bbox.top - item.attr.height / 2,
                        translationX: bbox.left + Math.min(item.docked.offset, bbox.width) - item.attr.width / 2
                    });
                    break;
                case 'bottom':
                    item.setAttributes({
                        translationY: bbox.bottom - item.attr.height / 2,
                        translationX: bbox.left + Math.min(item.docked.offset, bbox.width) - item.attr.width / 2
                    });
                    break;
                case 'left':
                    item.setAttributes({
                        translationX: bbox.left - item.attr.width / 2,
                        translationY: bbox.top + Math.min(item.docked.offset, bbox.height) - item.attr.height / 2
                    });
                    break;
                case 'right':
                    item.setAttributes({
                        translationX: bbox.right - item.attr.width / 2,
                        translationY: bbox.top + Math.min(item.docked.offset, bbox.height) - item.attr.height / 2
                    });
                    break;
            }
        });
    },

    onBeforeReplace: function (newSprite) {
        var me = this,
            holderItems = me.getHoldItems();

        Ext.each(holderItems, function (holderItem) {
            holderItem.setHolder(newSprite);
        });
    },

    onSwitchClick: function (e) {
        var me = this,
            menu, panel;

        panel = Ext.create('YZSoft.bpa.sprite.BPMN.Task.panel.Switch', {
            listeners: {
                scope: me,
                select: function (xclass) {
                    me.getSurface().ownerCt.changeType(me, xclass);
                }
            }
        });

        menu = Ext.create('Ext.menu.Menu', {
            cls: 'yz-menu',
            bodyBorder: false,
            bodyStyle: 'padding:0px 0px;',
            showSeparator: false,
            items: [panel]
        });
        menu.showAt(e.getXY());
        menu.focus();
    }
});
