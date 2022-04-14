
Ext.define('YZSoft.src.designer.dd.DropZone', {
    extend: 'Ext.dd.DropTarget',
    horiz: false,

    constructor: function (dcnt, config) {
        var me = this;

        me.dcnt = dcnt;
        me.callParent([dcnt.el, config]);

        me.dcnt.on({
            destroy: function(){
                me.destroy();
            }
        })
    },

    getAbove: function (dd, e, data) {
        var me = this,
            vert = !me.horiz,
            dcnt = me.dcnt,
            items = dcnt.items.items,
            xy = e.getXY(),
            dbody = dcnt.el,
            bodyBox = dbody.getBox(),
            x = xy[0] - bodyBox.x + dbody.getScrollLeft(),
            y = xy[1] - bodyBox.y + dbody.getScrollTop(),
            xAttr = vert ? 'x' : 'y',
            leftAttr = vert ? 'left' : 'top',
            yAttr = vert ? 'y' : 'x',
            rightAttr = vert ? 'right' : 'bottom',
            topAttr = vert ? 'top' : 'left',
            heightAttr = vert ? 'height' : 'width',
            mpos,itemBox,aboveItem;

        mpos = { x: x, y: y };
        aboveItem = Ext.Array.findBy(items, function (item) {
            itemBox = {
                left: item.el.dom.offsetLeft,
                top: item.el.dom.offsetTop,
                width: item.el.dom.offsetWidth,
                height: item.el.dom.offsetHeight
            };

            itemBox.right = itemBox.left + itemBox.width;
            itemBox.bottom = itemBox.top + itemBox.height;

            if (/*mpos[xAttr] >= itemBox[leftAttr] && mpos[xAttr] <= itemBox[rightAttr] &&*/
                mpos[yAttr] <= itemBox[topAttr] + itemBox[heightAttr]/2)
                return true;
        });

        return aboveItem;
    },

    moveIndicator: function (parentNode, before) {
        var me = this,
            dropIndicator = me.dropIndicator;

        if (!dropIndicator)
            return;

        parentNode.insertBefore(dropIndicator.dom, before);
    },

    moveIndicatorAbove: function(aboveItem) {
        var me = this,
            dropIndicator = me.dropIndicator;

        if (!dropIndicator)
            return;

        if (me.lastAbove && me.lastAbove === aboveItem)
            return;

        if (aboveItem)
            me.moveIndicator(aboveItem.el.dom.parentNode, aboveItem.el.dom);
        else
            me.moveIndicator(dropIndicator.dom.parentNode, null);

        me.lastAbove = aboveItem;
    },

    hideIndicator: function (e) {
        var me = this;

        if (me.dropIndicator) {
            me.dropIndicator.destroy();
            delete me.dropIndicator;
        }
    },

    updateLayout: function (cnt){
        var me = this,
            cnt = cnt || me.dcnt.designer.dcnt;

        if (cnt.dragLayout === false)
            return;

        cnt.hide();
        cnt.show();
    },

    notifyEnter: function (source, e, data) {
        var me = this,
            aboveItem = me.getAbove(source, e, data),
            dropIndicator = me.dropIndicator = me.dropIndicator || me.dcnt.createDropIndicator(source, data); //保证只有一个indicator

        me.dcnt.onDropEnter(source, e, data);

        //目标容器更新高度
        if (dropIndicator) {
            dropIndicator.show();
            me.updateLayout(me.dcnt);

            delete me.lastAbove;
            me.moveIndicatorAbove(aboveItem);
        }

        return me.callParent(arguments);
    },

    notifyOver: function (dd, e, data) {
        var me = this,
            dcnt = me.dcnt,
            aboveItem = me.getAbove(dd, e, data);

        me.moveIndicatorAbove(aboveItem);

        me.dcnt.onDropOver(dd, e, data);
        return me.dropAllowed;
    },

    notifyOut: function (source, e, data) {
        var me = this,
            dropIndicator = me.dropIndicator;

        me.dcnt.onDropOut(source, e, data);

        data.currentTarget = null;

        if (dropIndicator) {
            me.hideIndicator();
            me.updateLayout(me.dcnt);
        }
    },

    notifyDrop: function (source, e, data) {
        var me = this;

        me.dcnt.onDropEnd(source, e, data);

        if (data.fromToolbar)
            me.dcnt.onDrop(source, e, data);

        if (data.isPart)
            me.notifyDropPart(source, e, data);

        me.hideIndicator();
        me.updateLayout(me.dcnt);
    },

    notifyDropPart: function (source, e, data) {
        var me = this,
            part = data.part,
            oldCnt = part.ownerCt,
            oldIndex = oldCnt.items.indexOf(part),
            newCnt = me.dcnt,
            newIndex = me.dropIndicator ? newCnt.layout.getRenderTarget().indexOf(me.dropIndicator.dom) : 0,
            result;

        result = newCnt.onDorpPart(part);
        if (result === false) {
            part.unghost();
        }
        else if (result && result.isComponent){
            oldCnt.remove(part, false);
            newCnt.insert(newIndex, result);
            Ext.defer(function () {
                part.unghost();
                part.destroy();
            },1);
        }
        else{
            if (oldCnt == newCnt && oldIndex < newIndex)
                newIndex--;

            newCnt.insert(newIndex, part);

            part.unghost();

            if (oldCnt == newCnt)
                newCnt.onDorpPartExchangePos && newCnt.onDorpPartExchangePos(part, oldIndex, newIndex);
        }
    }
});