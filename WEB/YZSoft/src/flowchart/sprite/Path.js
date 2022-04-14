/*
connectable: true,
resizeable:true,
*/
Ext.define('YZSoft.src.flowchart.sprite.Path', {
    extend: 'Ext.draw.sprite.Path',
    requires: [
        'YZSoft.src.flowchart.overrides.Sprite'
    ],
    hotbox: {
        strokeStyle: '#ff9900',
        strokeOpacity: 1,
        lineWidth: 4
    },
    adjust: true,
    getExtensionText: Ext.emptyFn,

    drawImage: function (ctx, image, x, y, width, height) {
        image = YZSoft.src.flowchart.sprite.Path[image];

        ctx.drawImage(image, x, y,
            width || (image.naturalWidth || image.width) / surface.devicePixelRatio,
            height || (image.naturalHeight || image.height) / surface.devicePixelRatio);
    },

    render: function (surface, ctx) {
        var mat = this.attr.matrix,
            attr = this.attr,
            extlines = this.getExtensionText('tr');

        extlines = Ext.isEmpty(extlines) ? [] : extlines;
        extlines = Ext.isArray(extlines) ? extlines : [extlines];

        this.extlines = extlines;

        if (!attr.path || attr.path.params.length === 0) {
            return;
        }
        mat.toContext(ctx);

        if (attr.display == 'hotbox') {
            var hoxbox = Ext.apply({}, this.hotbox);

            hoxbox.lineWidth = Math.max(hoxbox.lineWidth, attr.lineWidth);
            Ext.apply(ctx, hoxbox);
        }
        ctx.appendPath(attr.path);
        ctx.fillStroke(attr);

        if (attr.relatiedFile)
            this.renderRelatedFile(surface, ctx);

        if (attr.showExtension && extlines && extlines.length != 0)
            this.renderExtensionText(surface, ctx, extlines);

        //<debug>
        var debug = this.statics().debug || attr.debug;
        if (debug) {
            debug.bbox && this.renderBBox(surface, ctx);
            debug.xray && this.renderXRay(surface, ctx);
        }
        //</debug>
    },

    getRelatedFileBox: function (isWithoutTransform) {
        var me = this,
            bbox = me.getBBox(isWithoutTransform),
            x = bbox.x,
            y = bbox.y,
            w = bbox.width,
            h = bbox.height;

        return {
            x: x + w + 3,
            y: y + h - 13,
            width: 13,
            height: 13
        };
    },

    renderRelatedFile: function (surface, ctx) {
        var me = this,
            bbox = me.getRelatedFileBox();

        me.drawImage(ctx, 'imgLink', bbox.x, bbox.y, bbox.width, bbox.height);
    },

    renderExtensionText: function (surface, ctx, lines) {
        var me = this,
            bbox = me.getBBox(),
            x = bbox.x,
            y = bbox.y - lines.length*15 - 4;

        ctx.save();

        Ext.each(lines, function (line) {
            ctx.font = '12px Verdana';
            ctx.fillStyle = '#333';    
            ctx.textAlign = 'start'
            ctx.textBaseline = 'top';
            ctx.fillText(line, x, y);
            y += 15;
        });

        ctx.restore();
    },

    /**
    * Tests whether the given point is inside the path.
    * @param x
    * @param y
    * @return {Boolean}
    * @member Ext.draw.sprite.Path
    */
    isPointInPath: function (x, y) {
        var attr = this.attr;

        if (attr.fillStyle === Ext.draw.Color.RGBA_NONE) {
            return this.isPointOnPath(x, y);
        }

        var path = attr.path,
            matrix = attr.matrix,
            params, result;

        if (!matrix.isIdentity()) {
            params = path.params.slice(0);
            path.transform(attr.matrix);
        }

        result = path.isPointInPath(x, y);

        if (params) {
            path.params = params;
        }
        return result;
    },

    /**
    * Tests whether the given point is on the path.
    * @param x
    * @param y
    * @return {Boolean}
    * @member Ext.draw.sprite.Path
    */
    isPointOnPath: function (x, y) {
        var attr = this.attr,
            path = attr.path,
            matrix = attr.matrix,
            params, result;

        if (!matrix.isIdentity()) {
            params = path.params.slice(0);
            path.transform(attr.matrix);
        }

        result = path.isPointOnPath(x, y);

        if (params) {
            path.params = params;
        }
        return result;
    }
}, function () {
    this.imgLink = new Image();
    this.imgLink.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1RDc5NUZBMTQ4MTcxMUU2OTcyMDhCQzNCNjcwM0REMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1RDc5NUZBMjQ4MTcxMUU2OTcyMDhCQzNCNjcwM0REMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwQUNFN0Q2NDgxNjExRTY5NzIwOEJDM0I2NzAzREQzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVENzk1RkEwNDgxNzExRTY5NzIwOEJDM0I2NzAzREQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ovC5EAAAANdJREFUeNpiVFVRYYACUSA+CsSfGDABHxBbAfEbEIcFSUICiE8DcTQWTUuBWBKmiYmBDECWJmTnPQJiBSA+A+VLAfEzKPsnVB4MGJECAh0cBmJbQja5AbEhEl8GiMuR+OeBeBe6TdOA+DkQ38BiuAY09LJAHGZhIaFgIO0HxI5A/BVkEBCfAOL9UJeYAbEs1BUioKgB2XQPzRkgCXcgDgDiDUC8ExY/UNAJMukLEK9GEpQDYm8kP29FDjkgqCU7nv4ixQ0IsAHxDij7KhBvAeJfSPL/AAIMAE93JkrVQ3ldAAAAAElFTkSuQmCC';
});