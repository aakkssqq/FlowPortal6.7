Ext.define('YZSoft.bpa.sprite.Lane.Sprite', {
    extend: 'YZSoft.bpa.sprite.Sprite',
    selectionHitFirst: false,
    archiveProperties: ['translationX', 'translationY', 'x', 'y', 'width', 'height', 'lineWidth', 'lineDash', 'strokeStyle', 'fillStyle','titlesize'],
    hitBorderRadius: 2,
    assisit: true,

    inheritableStatics: {
        def: {
            defaults: {
                strokeStyle: '#000',
                fillStyle: 'none',
                lineWidth: 2
            },
            anchors: {
                ActivityMiddleTop: false,
                ActivityRightMiddle: false,
                ActivityMiddleBottom: false,
                ActivityLeftMiddle: false
            }
        }
    },

    hitTestBody: function (point, radius) {
        var me = this,
            attr = me.attr,
            rect = me.sprites.rect,
            bbox = me.getBBox(true),
            titleBbox = rect.getBBox(false),
            r = radius || me.hitRadius.body,
            br = me.hitBorderRadius,
            isChild = me.attr.ischild,
            hitbboxs = [], pointLocal;

        point = {
            x: point.x - attr.translationX,
            y: point.y - attr.translationY
        };

        hitbboxs.push({
            left: titleBbox.x - r,
            right: titleBbox.x + titleBbox.width + r,
            top: titleBbox.y - r,
            bottom: titleBbox.y + titleBbox.height + r
        });

        if (!isChild) {
            hitbboxs.push({
                left: bbox.x - br,
                right: bbox.x + br,
                top: bbox.y,
                bottom: bbox.y + bbox.height
            });

            hitbboxs.push({
                left: bbox.x + bbox.width - br,
                right: bbox.x + bbox.width + br,
                top: bbox.y,
                bottom: bbox.y + bbox.height
            });

            hitbboxs.push({
                left: bbox.x,
                right: bbox.x + bbox.width,
                top: bbox.y - br,
                bottom: bbox.y + br
            });

            hitbboxs.push({
                left: bbox.x,
                right: bbox.x + bbox.width,
                top: bbox.y + bbox.height - br,
                bottom: bbox.y + bbox.height + br
            });
        }

        return Ext.Array.findBy(hitbboxs, function (hitbbox) {
            if (point.x >= hitbbox.left && point.x <= hitbbox.right && point.y >= hitbbox.top && point.y <= hitbbox.bottom)
                return true;
        });
    },

    hitTestHotPoint: function (point, radius) {
        var me = this,
            attr = me.attr;

        if (!attr.ischild)
            return me.callParent(arguments);
    }
});