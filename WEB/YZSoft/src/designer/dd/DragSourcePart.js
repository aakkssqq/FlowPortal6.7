
Ext.define('YZSoft.src.designer.dd.DragSourcePart', {
    extend: 'Ext.dd.DragSource',
    showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    createFrame: Ext.emptyFn,

    constructor: function (part, config) {
        var me = this;

        me.part = part;
        me.callParent([part.el,config]);
    },

    b4MouseDown: function (e) {
        var xy = e.getXY(),
            x = xy[0],
            y = xy[1];

        this.autoOffset(x, y);
    },

    autoOffset: function (x, y) {
        x -= this.startPageX;
        y -= this.startPageY;
        this.setDelta(x, y);
    },

    b4StartDrag: function (x, y) {
        var me = this,
            part = me.part,
            partsize = part.getSize();

        part.el.setVisibilityMode(Ext.Element.DISPLAY);
        me.ghost = part.ghost();

        part.updateLayout();
    },

    getDragEl: function (e) {
        return this.ghost.el.dom;
    },

    endDrag: function (e) {
    },

    //不调用父级行为，去除无效拖动动画
    onInvalidDrop: function (target, e, id) {
        var me = this;

        me.part.unghost();
        me.updateLayout();
        me.callParent(arguments);
    },

    updateLayout: function (cnt) {
        var me = this,
            cnt = cnt || (me.part.designer && me.part.designer.dcnt);

        if (cnt) {
            cnt.hide();
            cnt.show();
        }
    },

    //缺省行为：控件拖动时不能超出屏幕，使用不方便，改为可以超出屏幕
    alignElWithMouse: function (el, iPageX, iPageY) { 
        var oCoord = this.getTargetCoord(iPageX, iPageY),
            fly = el.dom ? el : Ext.fly(el, '_dd'),
            elSize = fly.getSize(),
            EL = Ext.Element,
            vpSize,
            aCoord,
            newLeft,
            newTop;

        if (!this.deltaSetXY) {
            vpSize = this.cachedViewportSize = { width: EL.getDocumentWidth(), height: EL.getDocumentHeight() };
            //aCoord = [
            //    Math.max(0, Math.min(oCoord.x, vpSize.width - elSize.width)),
            //    Math.max(0, Math.min(oCoord.y, vpSize.height - elSize.height))
            //];
            aCoord = [
                oCoord.x,
                oCoord.y
            ];
            fly.setXY(aCoord);
            newLeft = this.getLocalX(fly);
            newTop = fly.getLocalY();
            this.deltaSetXY = [newLeft - oCoord.x, newTop - oCoord.y];
        } else {
            vpSize = this.cachedViewportSize;
            this.setLocalXY(
                fly,
                //Math.max(0, Math.min(oCoord.x + this.deltaSetXY[0], vpSize.width - elSize.width)),
                //Math.max(0, Math.min(oCoord.y + this.deltaSetXY[1], vpSize.height - elSize.height))
                oCoord.x + this.deltaSetXY[0],
                oCoord.y + this.deltaSetXY[1]
            );
        }

        this.cachePosition(oCoord.x, oCoord.y);
        //this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
        return oCoord;
    },

    //支持DragSource嵌套
    handleMouseDown: function (e) {
        //e.stopEvent(); //设计时展开下拉框，在其他地方点击下拉框不消失
        e.stopPropagation();
        this.callParent(arguments);
    }
});