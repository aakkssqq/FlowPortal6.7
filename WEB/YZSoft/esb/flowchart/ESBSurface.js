
Ext.define('YZSoft.esb.flowchart.ESBSurface', {
    extend: 'Ext.draw.engine.Canvas',
    isESBSurface: true,
    topPadding: 50,
    leftPadding: 50,
    itemPadding: 100,
    lineXGap: 10,
    onInsert: Ext.emptyFn,

    add: function () {
        var me = this,
            result;

        result = me.callParent(arguments);
        me.rePosition();
        return result;
    },

    remove: function () {
        var me = this,
            result;

        result = me.callParent(arguments);
        me.rePosition();
        return result;
    },

    insertBefore: function (sprite, before) {
        var me = this,
            map = me.map,
            items = me.getItems(),
            index;

        if (!sprite || sprite.destroyed)
            return;

        if (sprite.isSprite && !map[sprite.getId()]) {
            sprite = sprite;
        }
        else if (!map[sprite.id]) {
            sprite = me.createItem(sprite);
        }

        if (sprite) {
            map[sprite.getId()] = sprite;
            oldSurface = sprite.getSurface();
            if (oldSurface && oldSurface.isSurface) {
                oldSurface.remove(sprite);
            }
            sprite.setParent(me);
            sprite.setSurface(me);
            me.onInsert(sprite, before);
        }

        if (items) {
            if (!before) {
                items.push(sprite);
            }
            else {
                index = Ext.Array.indexOf(items, before);
                Ext.Array.insert(items, index, [sprite]);
            }
        }

        me.dirtyZIndex = true;
        me.setDirty(true);

        me.rePosition();

        return sprite;
    },

    rePosition: function () {
        if (this.destroying)
            return;

        var me = this,
            items = me.getItems(),
            maxHeight = me.getMaxHeight(items),
            cy = me.topPadding + maxHeight/2,
            x = me.leftPadding,
            bbox;

        Ext.each(items, function (item) {
            if (item.attr.hidden)
                return;

            bbox = item.getBBox();
            item.setCenter && item.setCenter(x + (bbox.width / 2),cy);
            x += bbox.width + me.itemPadding;
        });

        me.updateLinkSurface();
    },

    updateLinkSurface: function () {
        var me = this,
            linkSurface = me.linkSurface,
            sprites = [],
            i;

        if (!linkSurface) //linkSurface初始化过程中
            return;

        Ext.each(me.getItems(), function (sprite) {
            if (!sprite.attr.hidden)
                sprites.push(sprite);
        });

        linkSurface.removeAll(true);
        for (i = 0; i < sprites.length-1; i++) {
            linkSurface.add(me.createLink(sprites[i], sprites[i + 1]));
        }
    },

    createLink: function (sprite1,sprite2) {
        var me = this,
            bbox1 = sprite1.getBBox(true),
            bbox2 = sprite2.getBBox(true),
            x1 = bbox1.x + bbox1.width + me.lineXGap,
            y1 = bbox1.y + bbox1.height / 2,
            x2 = bbox2.x - me.lineXGap,
            y2 = bbox2.y + bbox2.height / 2;

        return {
            xclass: 'YZSoft.esb.sprites.Link',
            fromX: x1,
            fromY: y1,
            toX: x2,
            toY: y2
        };
    },

    getNextSprite: function (sprite) {
        var me = this,
            items = me.getItems(),
            i;

        for (i = 0; i < items.length-1; i++) {
            if (items[i] === sprite)
                return items[i + 1];
        }
    },

    getMaxHeight: function (items) {
        var me = this,
            maxHeight = 0,
            bbox;

        Ext.each(items, function (item) {
            bbox = item.getBBox();
            maxHeight = Math.max(maxHeight,bbox.height || 0);
        });

        return maxHeight;
    },

    renderFrame: function () {
        var me = this,
            linkSurface = me.linkSurface;

        me.callParent(arguments);
        linkSurface && linkSurface.renderFrame();
    }
});