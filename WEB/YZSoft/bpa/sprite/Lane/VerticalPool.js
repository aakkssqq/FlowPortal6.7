
//泳池(垂直)
Ext.define('YZSoft.bpa.sprite.Lane.VerticalPool', {
    extend: 'YZSoft.bpa.sprite.Lane.Pool',
    isVerti: true,
    laneXClass: 'YZSoft.bpa.sprite.Lane.VerticalLane',
    separatorXClass: 'YZSoft.bpa.sprite.Lane.HorizSeparator',
    inheritableStatics: {
        def: {
            defaults: {
                width: 250,
                height: 540
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
            width: w,
            height: attr.titlesize,
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
            width: w,
            height: attr.titlesize,
            paddingtop: (attr.lineWidth * 0.5 || 0) + 2,
            paddingleft: (attr.lineWidth * 0.5 || 0) + 2,
            paddingright: (attr.lineWidth * 0.5 || 0) + 2,
            paddingbottom: (attr.lineWidth * 0.5 || 0) + 2
        });
    }
});
