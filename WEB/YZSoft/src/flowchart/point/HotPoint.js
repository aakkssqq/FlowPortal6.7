Ext.define('YZSoft.src.flowchart.point.HotPoint', {
    extend: 'Ext.util.Point',
    hot: false,

    constructor: function (config) {
        var me = this,
            width, height;

        if (!me.self.img) {
            me.self.img = new Image();
            me.self.img.src = me.src;
        }

        if (!me.self.imghot && me.srchot) {
            me.self.imghot = new Image();
            me.self.imghot.src = me.srchot;
        }

        width = me.width;  //宽，高会被父构造函数置0
        height = me.height;

        me.callParent([config.x, config.y]);

        me.width = width;
        me.height = height;
           
        Ext.apply(me, config);
    },

    setHot: function (value) {
        this.hot = value;
    },

    setPos: function (x, y) {
        if (Ext.isObject(x)) {
            y = x.y;
            x = x.x;
        }
        this.x = this.left = this.right = x;
        this.y = this.top = this.bottom = y;
    },

    hitTest: function (point, radius) {
        var d = this.getDistanceTo(point);
        if (Math.floor(d) <= radius)
            return true;
    },

    draw: function (ctx, highlight) {
        var x = Math.round(this.x - this.width / 2),
            y = Math.round(this.y - this.height / 2);

        if (this.hot && this.self.imghot)
            ctx.drawImage(this.self.imghot, x, y);
        else
            ctx.drawImage(this.self.img, x, y);
    }
});