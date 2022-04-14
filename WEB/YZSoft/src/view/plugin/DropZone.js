
Ext.define('YZSoft.src.view.plugin.DropZone', {
    extend: 'Ext.grid.ViewDropZone',

    indicatorHtml: '<div class="yz-view-drop-indicator-top" role="presentation"></div><div class="yz-view-drop-indicator-bottom" role="presentation"></div>',
    indicatorCls: 'yz-view-drop-indicator',

    positionIndicator: function (node, data, e) {
        var me = this,
            view = me.view,
            pos = me.getPosition(e, node),
            overRecord = view.getRecord(node),
            draggingRecords = data.records,
            indicatorX, indicatorY;

        if (!Ext.Array.contains(draggingRecords, overRecord) && (
            pos === 'before' && !me.containsRecordAtOffset(draggingRecords, overRecord, -1) ||
            pos === 'after' && !me.containsRecordAtOffset(draggingRecords, overRecord, 1)
        )) {
            me.valid = true;

            if (me.overRecord !== overRecord || me.currentPosition !== pos) {

                indicatorX = Ext.fly(node).getX() - view.el.getX() - view.el.getPadding('l');
                indicatorY = Ext.fly(node).getY() - view.el.getY() - view.el.getPadding('t') - 1;

                if (pos === 'after') {
                    indicatorX += Ext.fly(node).getWidth();
                }

                // If view is scrolled using CSS translate, account for then when positioning the indicator
                if (view.touchScroll === 2) {
                    indicatorX += view.getScrollX();
                    indicatorY += view.getScrollY();
                }

                me.getIndicator().setHeight(Ext.fly(node).getHeight()).showAt(indicatorX, indicatorY);

                me.overRecord = overRecord;
                me.currentPosition = pos;
            }
        } else {
            delete me.currentPosition; //bug fix
            me.invalidateDrop();
        }
    },

    getTargetFromEvent : function(e) {
        var node = e.getTarget(this.view.getItemSelector()),
            mouseX, mouseY, nodeList, testNode, i, len, box;

        if (!node) {
            mouseX = e.getX();
            mouseY = e.getY();
            for (i = 0, nodeList = this.view.getNodes(), len = nodeList.length; i < len; i++) {
                testNode = nodeList[i];
                box = Ext.fly(testNode).getBox();
                if (mouseY <= box.bottom && mouseX <= box.right) {
                    return testNode;
                }
            }
        }
        return node;
    },

    getPosition: function(e, node) {
        var x = e.getXY()[0],
            region = Ext.fly(node).getRegion(),
            pos;

        if ((region.right - x) >= (region.right - region.left) / 2) {
            pos = 'before';
        } else {
            pos = 'after';
        }
        return pos;
    }
});