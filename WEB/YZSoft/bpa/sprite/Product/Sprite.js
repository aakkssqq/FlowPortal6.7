Ext.define('YZSoft.bpa.sprite.Product.Sprite', {
    extend: 'YZSoft.bpa.sprite.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                strokeStyle: '#333333',
                fillStyle: '#ffffff',
                lineWidth: 2
            },
            triggers: {
                strokeStyle: 'canvas,children',
                lineWidth: 'canvas,children'
            }
        }
    }
});
