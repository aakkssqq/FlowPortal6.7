
//员工
Ext.define('YZSoft.bpa.sprite.ORG.Employee', {
    extend: 'YZSoft.bpa.sprite.ORG.Sprite',
    inheritableStatics: {
        def: {
            defaults: {
                width: 120,
                height: 70
            }
        }
    },
    propertyConfig: {
        xclass: 'YZSoft.bpa.sprite.Properties.Employee.Property'
    },

    updatePath: function (path, attr) {
        var x = attr.x,
            y = attr.y,
            w = attr.width,
            h = attr.height;

        path.rect(x, y, w, h);
    }
});
