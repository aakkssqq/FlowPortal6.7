/*
*/
Ext.define('YZSoft.esb.sprites.FlowControlSpriteAbstract', {
    extend: 'YZSoft.esb.sprites.SpriteAbstract',
    isFlowControlNode: true,
    inheritableStatics: {
        def: {
            defaults: {
                width: 50,
                height: 50,
                fillStyle: '#ffffff',
                strokeStyle: '#000000',
                lineWidth: 1
            }
        }
    },
    sprites: {
        icon: {
            width: 20,
            height: 20
        }
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.moveTo(x + w * 0.5, y);
        path.lineTo(x + w, y + h * 0.5);
        path.lineTo(x + w * 0.5, y + h);
        path.lineTo(x, y + h * 0.5);
        path.closePath();
    }
});