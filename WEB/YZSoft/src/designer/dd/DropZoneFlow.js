
Ext.define('YZSoft.src.designer.dd.DropZoneFlow', {
    extend: 'YZSoft.src.designer.dd.DropZone',

    getAbove: function(dd, e, data) {
        var me = this,
            vert = !me.horiz,
            dcnt = me.dcnt,
            items = dcnt.items.items,
            xy = e.getXY(),
            dbody = dcnt.el,
            bodyBox = dbody.getBox(),
            x = xy[0] - bodyBox.x + dbody.getScrollLeft(),
            y = xy[1] - bodyBox.y + dbody.getScrollTop(),
            mpos, itemBox, aboveItem;

        mpos = { x: x, y: y };
        aboveItem = Ext.Array.findBy(items, function(item) {
            itemBox = {
                left: item.el.dom.offsetLeft,
                top: item.el.dom.offsetTop,
                width: item.el.dom.offsetWidth,
                height: item.el.dom.offsetHeight
            };

            itemBox.right = itemBox.left + itemBox.width;
            itemBox.bottom = itemBox.top + itemBox.height;
            itemBox.xcenter = itemBox.left + itemBox.width / 2;
            itemBox.ycenter = itemBox.top + itemBox.height / 2;

            if (y < itemBox.top || (y <= itemBox.bottom && x <= itemBox.xcenter))
                return true;
        });

        return aboveItem;
    },

    getBefore: function(e) {
        var me = this,
            dragger = me.dragger,
            dragitem = dragger.getElement(),
            dataview = me.getDataview(),
            elBody = dataview.container.element,
            xy = dragitem.getOffsetsTo(elBody),
            x = xy[0] + dragitem.getWidth() / 2,
            y = xy[1] + dragitem.getHeight() / 2,
            items = dataview.container.getViewItems();

        return Ext.Array.findBy(items, function(item) {
            var item = Ext.get(item),
                exy = item.getOffsetsTo(elBody),
                et = exy[1],
                eb = exy[1] + item.getHeight(),
                ecx = exy[0] + item.getWidth() / 2;

            if (!item.hasCls('x-dataview-item'))
                return;

            if (item.hasCls('x-dragging'))
                return;

            if (item.hasCls('yz-dd-dataview-indicator'))
                return;

            if (y < et || (y <= eb && x <= ecx)) {
                return true;
            }
        });
    },
});