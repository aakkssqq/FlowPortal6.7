
//泳道(水平)
Ext.define('YZSoft.bpa.sprite.Lane.HorizLane', {
    extend: 'YZSoft.bpa.sprite.Lane.Lane',
    isHoriz: true,
    inheritableStatics: {
        def: {
            defaults: {
                width: 500,
                height: 220
            }
        }
    },

    updateChildRect: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            strokeStyle: attr.strokeStyle,
            lineWidth: attr.lineWidth,
            x: x,
            y: y,
            width: attr.titlesize,
            height: h,
            fillStyle: attr.fillStyle
        });
    },

    updateChildText: function (sprite, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        sprite.setAttributes({
            translationX: 0,
            translationY: 0,
            left: x,
            top: y,
            width: attr.titlesize,
            height: h,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2,
            orientation: 'vertical'
        });
    }
});
