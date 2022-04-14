/*
支持选择与子形状
*/
Ext.define('YZSoft.src.flowchart.overrides.Sprite', {
    override: 'Ext.draw.sprite.Sprite',
    requires: [
        'Ext.draw.Matrix'
    ],
    //添加引起def即会引起系统报表Area不绘制
    /*
    inheritableStatics: {
    def: {
    updaters: {
    children: function (attr) {
    this.updateChildren(attr);
    }
    }
    }
    },*/

    isSelected: function () {
        return this.attr.selected;
    },

    constructor: function (config) {
        if (this.isComposite) {  //Ext.draw.sprite.Composite 也使用了sprites（作为数组），和此处冲突
            this.callParent(arguments);
            return;
        }

        config = config || {};

        var me = this,
            spritesCfg = config.sprites || {};

        delete config.sprites;

        var sprites = {},
            items = me.items = [],
            name;

        for (name in me.sprites) {
            var cfg = Ext.apply({ ischild: true }, spritesCfg[name], Ext.clone(me.sprites[name])),
                sprite;

            var fn = me['beforeCreateChild' + Ext.String.capitalize(name)];
            if (fn)
                fn.call(me, cfg);

            sprite = me.createItem(cfg);

            items.push(sprite);
            sprites[name] = sprite;

            sprite.setParent(me);
            sprite.setSurface(me.getSurface());
        }

        me.sprites = sprites;
        me.callParent(arguments);
    },

    getDirty: function () {
        var me = this;

        if (me.attr.dirty)
            return true;

        Ext.each(me.items, function (sprite) {
            if (sprite.getDirty())
                return true;
        });

        if (me.attr.showExtension && me.getExtensionText) {
            var extlines = me.getExtensionText('tr');

            extlines = Ext.isEmpty(extlines) ? [] : extlines;
            extlines = Ext.isArray(extlines) ? extlines : [extlines];

            if (extlines.length != me.extlines.length)
                return true;

            for (var i = 0; i < extlines.length; i++) {
                if (extlines[i] != me.extlines[i])
                    return true;
            }
        }

        return false;
    },

    createItem: function (config) {
        return Ext.create(config.xclass || 'sprite.' + config.type, config);
    },

    updateSurface: function (surface) {
        Ext.each(this.items, function (sprite) {
            sprite.setSurface(surface);
        });
    },

    renderChildren: function (surface, ctx, fn) {
        var me = this,
            attr = me.attr;

        ctx.save();

        Ext.each(me.items, function (sprite) {
            if (!fn || fn(sprite))
                surface.renderSprite(sprite);
        });

        ctx.restore();
    },

    insert: function (index, sprite) {
        var me = this;

        //sprites[name] = sprite;
        sprite.setAttributes({
            ischild: true
        });
        sprite.setParent(me);
        sprite.setSurface(me.getSurface());
        Ext.Array.insert(me.items, index, [sprite]);
    },

    updateChildren: function (attr) {
        var me = this;

        Ext.Object.each(me.sprites, function (name, sprite) {
            var fn = me['updateChild' + Ext.String.capitalize(name)];
            if (fn)
                fn.call(me, sprite, attr);
        });
    },

    hitTestText: function (point) {
        var me = this,
            x = point.x,
            y = point.y,
            i;

        for (i = me.items.length - 1; i >= 0; i--) {
            var childsprite = me.items[i],
                attr = childsprite.attr,
                bbox = childsprite.getBBox();

            if (childsprite.isText && bbox && x >= bbox.x && x <= bbox.x + bbox.width && y >= bbox.y && y <= bbox.y + bbox.height)
                return childsprite;

            if (childsprite.hitTestText) {
                var rv = childsprite.hitTestText({
                    x: point.x - attr.translationX,
                    y: point.y - attr.translationY
                });

                if (rv)
                    return rv;
            }
        }
    },

    getTotalTranslation: function () {
        var me = this,
            rv = {
                x: me.attr.translationX,
                y: me.attr.translationY
            },
            p = me.getParent();

        while (p.isSprite) {
            rv.x += p.attr.translationX;
            rv.y += p.attr.translationY;
            p = p.getParent()
        }

        return rv;
    },

    nextItem: function (sprite, fn) {
        var me = this,
            index = Ext.Array.indexOf(me.items, sprite),
            i;

        if (index == -1)
            return null;

        for (i = index + 1; i < me.items.length; i++) {
            var childSprite = me.items[i];
            if (!fn || fn(childSprite) === true)
                return childSprite;
        }
    },

    prevItem: function (sprite, fn) {
        var me = this,
            index = Ext.Array.indexOf(me.items, sprite),
            i;

        if (index == -1)
            return null;

        for (i = index - 1; i >= 0; i--) {
            var childSprite = me.items[i];
            if (!fn || fn(childSprite) === true)
                return childSprite;
        }
    },

    destroy: function () {
        if (this.isComposite) {  //此时me.items为null
            this.callParent();
            return;
        }

        var me = this,
            sprites = me.items,
            ln = sprites.length,
            i;

        me.callParent();

        for (i = 0; i < ln; i++) {
            sprites[i].destroy();
        }

        sprites.length = 0;

        me.fireEvent('destroy', me);
    }
});