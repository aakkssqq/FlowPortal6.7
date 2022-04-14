
Ext.define('YZSoft.src.scroll.DomScroller', {
    override: 'Ext.scroll.Scroller',
    cntCls: 'yz-touch-scroll-container',
    pnlCls: 'yz-touch-scroll-panel',
    touchScroll: false,

    updateElement: function (element) {
        var me = this;

        if (me.touchScroll) {
            me.tracker = Ext.create('Ext.dd.DragTracker', {
                el: element.el,
                onBeforeStart: me.onBeforeDragStart.bind(me),
                onStart: me.onDragStart.bind(me),
                onDrag: me.onDrag.bind(me),
                onEnd: me.onDragEnd.bind(me),
                tolerance: 3,
                autoStart: 300
            });

            element.addCls(me.cntCls);
            element.el.down('.x-panel').addCls(me.pnlCls);
        }

        me.callParent(arguments);
    },

    onBeforeDragStart: function (e) {
        var me = this,
            maxPos = me.getMaxPosition();

        if (maxPos.x == 0 && maxPos.y == 0) {
            e.stopEvent();
            return false;
        }
    },

    onDragStart: function (e) {
        var me = this;

        me.startPoint = e.getXY();
        me.startPosition = Ext.apply({},me.getPosition()); //me.getPosition()获得的时引用，scroll时会一直变
    },

    onDrag: function (e) {
        var me = this,
            point = e.getXY(),
            maxPos = me.getMaxPosition(),
            offset, newPos;

        offset = {
            x: me.startPoint[0] - point[0],
            y: me.startPoint[1] - point[1]
        };

        if (offset.x == 0 && offset.y == 0)
            return;

        newPos = {
            x: me.startPosition.x + offset.x,
            y: me.startPosition.y + offset.y
        };

        x = Math.max(Math.min(newPos.x, maxPos.x), 0);
        y = Math.max(Math.min(newPos.y, maxPos.y), 0);

        me.scrollTo(x, y, false);
    },

    onDragEnd: function (e) {
    }
});