/*
url
fileid
*/
Ext.define('YZSoft.src.ux.ImageViewer', {
    extend: 'Ext.container.Container',
    cls:'yz-image-viewer',
    requires: [
        'YZSoft.src.ux.WindowManager'
    ],
    floating: true,
    fixed: true,
    draggable: {
        constrain: true,
        constrainTo: Ext.getBody()
    },
    width: 0,
    height: 0,
    padding: '10px 4px 4px 6px',
    maxSizePadding: {
        x: 30,
        y: 30
    },
    minSize: {
        width: 500,
        height: 500
    },
    statics: {
        preview: function (config) {
            if (YZSoft.os.isMobile) {
                var params = {};

                if (config.url)
                    params.imageurl = config.url;
                if (config.fileid)
                    params.fileid = config.fileid;

                YZSoft.src.ux.WindowManager.OpenWindow(null, YZSoft.$url('YZSoft/attachment/PreviewImage.aspx'), params, {});
            }
            else {
                if (this.loading)
                    return;

                if (this.win && !this.win.destroyed) {
                    if (this.win.url == config.url)
                        return;

                    this.win.destroy();
                }

                this.win = Ext.create('YZSoft.src.ux.ImageViewer', config);
                this.win.showAt(-100, -100);
                return this.win;
            }
        }
    },

    constructor: function (config) {
        var me = this,
            url;

        url = config.url || Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            fileid: config.fileid
        }));

        me.self.loading = true;

        me.image = Ext.create('Ext.Img', {
            style: 'position:absolute;background-color:white',
            src: url,
            listeners: {
                single: true,
                afterrender: function () {
                    me.image.getEl().on({
                        single: true,
                        scope: me,
                        load: me.onImageLoaded,
                        abort: me.onImageLoaded,
                        error: me.onImageLoaded
                    });
                }
            }
        });

        me.cnt = Ext.create('Ext.container.Container', {
            style: 'overflow:hidden',
            scrollable: false,
            items: [me.image]
        });

        var cfg = {
            layout: 'fit',
            items: [me.cnt]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterlayout: function () {
                if (!me.getEl().shadow.el.hasCls('yz-imageviewer-shadow'))
                    me.getEl().shadow.el.addCls('yz-imageviewer-shadow yz-shadow-outside');

                me.tracker = Ext.create('Ext.dd.DragTracker', {
                    el: me.image.getEl(),
                    onBeforeStart: me.onBeforeDragStart.bind(me),
                    onStart: me.onDragStart.bind(me),
                    onDrag: me.onDrag.bind(me),
                    onEnd: me.onDragEnd.bind(me),
                    tolerance: 3,
                    autoStart: 300
                });

                me.cnt.getEl().on({
                    scope: me,
                    mousewheel: me.onMouseWheel
                });

                me.keyMap = Ext.create('Ext.util.KeyMap', {
                    target: Ext.getBody(),
                    key: Ext.event.Event.ESC,
                    fn: function (key, e) {
                        e.stopEvent();
                        me.destroy();
                    },
                    scope: me
                });
            }
        });

        me.scale = 100;
        me.scaleStep = 20;

        //        me.loadMask = Ext.create('Ext.LoadMask', { msg: 'Loading...', target: Ext.getBody() });
        //        me.loadMask.isElement = false;
        //        me.loadMask.msgWrapEl.center(Ext.getBody());
        //        me.loadMask.show();

        Ext.defer(function () {
            if (me.loadMask) {
                me.loadMask.destroy();
                delete me.loadMask;
            }

            delete me.self.loading;
        }, 3000);
    },

    onImageLoaded: function (e) {
        var me = this,
            maxSize, cntSize, imgOrgSize, imgRealSize;

        delete me.self.loading;

        if (me.loadMask) {
            me.loadMask.destroy();
            delete me.loadMask;
        }

        maxSize = {
            width: Ext.dom.Element.getViewportWidth() - me.maxSizePadding.x * 2,
            height: Ext.dom.Element.getViewportHeight() - me.maxSizePadding.y * 2
        },

        imgOrgSize = me.imgOrgSize = {
            width: me.image.getWidth(),
            height: me.image.getHeight()
        };

        cntSize = {
            width: imgOrgSize.width + 14,
            height: imgOrgSize.height + 10
        };

        cntSize = me.getSuggestSize(cntSize, maxSize, me.minSize);

        me.getEl().shadow.el.addCls('yz-imageviewer-shadow');
        me.getEl().shadow.el.removeCls('yz-shadow-outside');

        me.setSize(cntSize.width, cntSize.height, false);
        me.center();

        me.optEl = Ext.DomHelper.append(me.cnt.el.dom, {
            tag: 'div',
            role: 'presentation',
            cls: 'yz-imageviewer-action-cnt',
            cn: [{
                tag: 'div',
                role: 'presentation',
                cls: 'yz-imageviewer-action yz-imageviewer-action-dsp',
                html: '100%'
            }, {
                tag: 'div',
                role: 'presentation',
                cls: 'yz-imageviewer-action yz-imageviewer-action-del',
                html: 'X'
            }]
        }, true);

        me.optEl.on({
            click: function (e) {
                if (Ext.fly(e.getTarget()).hasCls('yz-imageviewer-action-del'))
                    me.destroy();
            }
        });

        imgRealSize = {
            width: cntSize.width - 14,
            height: cntSize.height - 10
        }

        var xScale = Math.floor(imgRealSize.width * 100 / imgOrgSize.width),
            yScale = Math.floor(imgRealSize.height * 100 / imgOrgSize.height),
            scale = Math.min(xScale, yScale);

        scale = Math.min(scale, 100);
        me.setScale(scale);
    },

    getSuggestSize: function (size, maxSize, minSize) {
        return {
            width: Math.max(Math.min(size.width, maxSize.width), minSize.width),
            height: Math.max(Math.min(size.height, maxSize.height), minSize.height)
        };
    },

    onBeforeDragStart: function (e) {
        var me = this,
            imgSize = me.image.getSize(),
            cntSize = me.cnt.getSize();

        //图片已完全显示
        if (imgSize.width <= cntSize.width && imgSize.height <= cntSize.height) {
            e.stopEvent();
            return false;
        }
    },

    onDragStart: function (e) {
        var me = this;
        me.startPoint = me.lastPoint = e.getXY();
        me.startPos = me.image.getPosition(true);
    },

    onDrag: function (e) {
        var me = this,
            point = e.getXY(),
            imgSize = me.image.getSize(),
            cntSize = me.cnt.getSize(),
            offset, newPos;

        offset = {
            x: point[0] - me.startPoint[0],
            y: point[1] - me.startPoint[1]
        };

        if (offset.x == 0 && offset.y == 0)
            return;

        newPos = {
            x: me.startPos[0] + offset.x,
            y: me.startPos[1] + offset.y
        };

        newPos.x = me.adjustPos(0, cntSize.width, newPos.x, imgSize.width);
        newPos.y = me.adjustPos(0, cntSize.height, newPos.y, imgSize.height);

        me.image.setPosition(newPos.x, newPos.y, false);
        me.lastPoint = point;
    },

    onDragEnd: function (e) {
    },

    onMouseWheel: function (e) {
        var me = this,
            event = e.event,
            delta, scale, rate, n;

        e.stopEvent();

        //返回：< 0 鼠标向下滚了
        delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;

        if (me.scale < 100)
            rate = (100 - me.scaleStep) / 100;
        else
            rate = (100 + me.scaleStep) / 100;

        if (delta < 0) //放大
            n = Math.log(me.scale / 100) / Math.log(rate);
        else
            n = Math.log(me.scale / 100) / Math.log(rate);

        //精确计算n
        if (Math.floor(Math.pow(rate, Math.floor(n)) * 100) == me.scale)
            n = Math.floor(n);
        else
            n = Math.ceil(n);

        if (delta < 0) //放大
            scale = Math.ceil(100 * Math.pow(rate, rate > 1 ? n + 1 : n - 1));
        else //缩小
            scale = Math.floor(100 * Math.pow(rate, rate > 1 ? n - 1 : n + 1));

        scale = scale > 1600 ? 1600 : scale;
        me.setScale(scale, true);
    },

    setScale: function (scale, checkminSize) {
        var me = this,
            oldScale = me.scale,
            oldPosXY = me.image.getPosition(true),
            oldSize = me.image.getSize(),
            cntSize = me.cnt.getSize(),
            newPos, newSize, newScale;

        newScale = scale;
        oldPos = {
            x: oldPosXY[0],
            y: oldPosXY[1]
        };
        newSize = {
            width: Math.floor(me.imgOrgSize.width * newScale / 100),
            height: Math.floor(me.imgOrgSize.height * newScale / 100)
        };

        if (checkminSize && newSize.width < 10 && newSize.height < 10)
            return;

        newPos = {
            x: oldPos.x + Math.floor((oldSize.width - newSize.width) * (-oldPos.x + Math.floor(cntSize.width / 2)) / oldSize.width),
            y: oldPos.y + Math.floor((oldSize.height - newSize.height) * (-oldPos.y + Math.floor(cntSize.height / 2)) / oldSize.height)
        };

        newPos.x = me.adjustPos(0, cntSize.width, newPos.x, newSize.width);
        newPos.y = me.adjustPos(0, cntSize.height, newPos.y, newSize.height);

        me.image.setPosition(newPos.x, newPos.y, false);
        me.image.setSize(newSize.width, newSize.height, true);

        me.scale = newScale;

        //if(me.optEl.rendered
        me.optEl.down('.yz-imageviewer-action-dsp').setHtml(me.scale + '%');
    },

    adjustPos: function (left, right, pos, width) {
        //完全包括
        if (right - left >= width)
            return left + Math.floor((right - left - width) / 2);

        //右边空白
        if (pos + width < right)
            return right - width;

        //左边空白
        if (pos > left)
            return left;

        return pos;
    }
})