/*
增加背景
*/
Ext.define('YZSoft.src.flowchart.sprite.Text', {
    extend: 'Ext.draw.sprite.Text',
    requires: [
        'YZSoft.src.flowchart.TextMeasurer'
    ],
    isText: true,
    supportTextAlign: true,
    canChangeTextAlign: false,
    supportTextVAlign: true,
    canChangeTextVAlign: false,
    editable: false,
    archiveProperties: ['text', 'fillStyle', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'underline', 'background'],
    applyProperties: ['fillStyle', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'underline', 'background'],
    alignMap: {
        start: 'left',
        end: 'right',
        center: 'center'
    },
    inheritableStatics: {
        def: {
            processors: {
                fixWidth: 'number',
                underline: 'bool'
            },
            defaults: {
                fixWidth: 0,
                underline: false
            },
            triggers: {
                fixWidth: 'bbox',
                underline: 'canvas'
            }
        }
    },

    background: {
        fillStyle: 'white',
        fillOpacity: 1,
        strokeStyle: 'none',
        strokeOpacity: 1,
        lineWidth: 4
    },

    constructor: function (config) {
        var me = this;

        me.background = Ext.apply({}, config.background, me.background);
        delete config.background;

        me.callParent(arguments);

        me.on({
            scope: me,
            dblclick: 'onDblClick'
        });
    },

    updatePlainBBox: function (plain, useOldSize) {
        var me = this,
            attr = me.attr,
            x = attr.x,
            y = attr.y,
            font = attr.font,
            text = attr.text,
            baseline = attr.textBaseline,
            alignment = attr.textAlign,
            fixWidth = attr.fixWidth,
            size = (useOldSize && me.oldSize) ? me.oldSize : (me.oldSize = YZSoft.src.flowchart.TextMeasurer.measureText(text, font, fixWidth)),
            surface = me.getSurface(),
            isRtl = surface.getInherited().rtl,
            flipRtlText = isRtl && surface.getFlipRtlText(),
            rect = surface.getRect(),
            sizes = size.sizes,
            blockHeight = size.height || 16,
            blockWidth = size.width || 16,
            ln = sizes ? sizes.length : 0,
            lineWidth,
            i = 0;

        switch (baseline) {
            case 'hanging':
            case 'top':
                break;
            case 'ideographic':
            case 'bottom':
                y -= blockHeight;
                break;
            case 'alphabetic':
                y -= blockHeight * 0.8;
                break;
            case 'middle':
                y -= blockHeight * 0.5;
                break;
        }

        if (flipRtlText) {
            x = rect[2] - rect[0] - x;
            alignment = me.rtlAlignments[alignment];
        }

        switch (alignment) {
            case 'start':
                if (isRtl) {
                    for (; i < ln; i++) {
                        lineWidth = sizes[i].width;
                        sizes[i].x = -(blockWidth - lineWidth);
                    }
                }
                break;
            case 'end':
                x -= blockWidth;
                if (isRtl) {
                    break;
                }
                for (; i < ln; i++) {
                    lineWidth = sizes[i].width;
                    sizes[i].x = blockWidth - lineWidth;
                }
                break;
            case 'center':
                x -= blockWidth * 0.5;
                for (; i < ln; i++) {
                    lineWidth = sizes[i].width;
                    sizes[i].x = (isRtl ? -1 : 1) * (blockWidth - lineWidth) * 0.5;
                }
                break;
        }

        attr.lines = sizes;

        plain.x = x;
        plain.y = y;
        plain.width = blockWidth;
        plain.height = blockHeight;
    },

    setBackground: function (background) {
        this.background = Ext.apply({}, background, this.background);
        this.setDirty(true);
    },

    render: function (surface, ctx, rect) {
        var me = this,
            attr = me.attr,
            mat = Ext.draw.Matrix.fly(attr.matrix.elements.slice(0)),
            bbox = me.getBBox(true),
            lines = attr.lines,
            none = Ext.draw.Color.RGBA_NONE,
            x, y, i, lines, lineHeight,
            line, lineleft, linetop, lineright, linebaseline, lineunderline;

        if (attr.text.length === 0) {
            return;
        }

        me.renderBackground(surface, ctx, rect);

        lineHeight = bbox.height / lines.length;
        x = attr.bbox.plain.x;
        y = attr.bbox.plain.y + lineHeight * 0.78;
        mat.toContext(ctx);
        if (surface.getInherited().rtl) {
            x += attr.bbox.plain.width;
        }

        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            lineleft = x + (line.x || 0);
            lineright = lineleft + (line.width || 0)
            linebaseline = y + lineHeight * i,
            lineunderline = Math.round(linebaseline) + 3.5;

            if (ctx.fillStyle !== none) {
                ctx.fillText(line.text, lineleft, linebaseline);
            }
            if (ctx.strokeStyle !== none) {
                ctx.strokeText(line.text, lineleft, linebaseline);
            }

            if (attr.underline) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(lineleft, lineunderline);
                ctx.lineTo(lineright, lineunderline);
                ctx.closePath();
                ctx.strokeStyle = ctx.fillStyle;
                ctx.strokeOpacity = 1;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            }
        }
        //<debug>
        var debug = me.statics().debug || attr.debug;
        if (debug) {
            debug.bbox && me.renderBBox(surface, ctx);
        }
        //</debug>
    },

    renderBackground: function (surface, ctx) {
        var me = this,
            bbox = me.getBBox(false),
            bg = me.background;

        ctx.save();

        if (bg.fillStyle != 'none') {
            ctx.beginPath();
            ctx.moveTo(bbox.x, bbox.y);
            ctx.lineTo(bbox.x + bbox.width, bbox.y);
            ctx.lineTo(bbox.x + bbox.width, bbox.y + bbox.height);
            ctx.lineTo(bbox.x, bbox.y + bbox.height);
            ctx.closePath();

            ctx.fillStyle = bg.fillStyle;
            ctx.fillOpacity = bg.fillOpacity;
            ctx.fill();
        }

        if (bg.strokeStyle && bg.lineWidth) {
            ctx.strokeStyle = bg.strokeStyle;
            ctx.strokeOpacity = bg.strokeOpacity;
            ctx.lineWidth = bg.lineWidth;
            ctx.stroke();
        }

        ctx.restore();
    },

    onDblClick: function (e) {
        var me = this;

        if (me.editable)
            me.beginEdit();
    },

    canvasAlignToHTMLAlign: function (align, defaultValue) {
        return this.alignMap[align] || defaultValue || 'left';
    },

    beginEdit: function () {
        var me = this,
            attr = me.attr,
            editorPostfix = attr.fixWidth ? 'FixWidth' : '',
            editName = 'editor' + editorPostfix,
            xclass = 'YZSoft.src.flowchart.editor.TextEditor' + editorPostfix,
            editor = me.self[editName],
            trans = me.getTotalTranslation(),
            surface = me.getSurface(),
            cnt = surface.ownerCt,
            baseline = attr.textBaseline,
            alignment = attr.textAlign,
            x, y, el;

        if (!editor) {
            editor = me.self[editName] = Ext.create(xclass, {
                floating: true,
                shadow: false,
                width: 1,
                height: 1
            });
            editor.showAt(-1000, -1000, false);
        }

        el = editor.inputEl;
        x = trans.x + attr.x;
        y = trans.y + attr.y;

        if (attr.fixWidth) {
            switch (alignment) {
                case 'start':
                    break;
                case 'end':
                    x -= attr.fixWidth + el.getPadding('lr') + el.getBorderWidth('lr');
                    break;
                case 'center':
                    x -= attr.fixWidth * 0.5 + el.getPadding('l') + el.getBorderWidth('l'); ;
                    break;
            }
        }

        editor.rotationCenterOffset = {
            x: (trans.x + attr.rotationCenterX) - x,
            y: (trans.y + attr.rotationCenterY) - y
        };

        editor.setOrientation('horizontal');
        editor.showBy(cnt, 'tl', [x, y]);
        editor.eventOwner = me;
        editor.setFont(attr.font);
        editor.setTextColor(attr.fillStyle);
        me.editingText = attr.text;
        editor.setText(attr.text);
        editor.setTextAlign(me.canvasAlignToHTMLAlign(alignment, 'left'));

        if (attr.fixWidth)
            editor.setContentWidth(attr.fixWidth);

        editor.grow = me.getEditorGrow(attr);

        me.setAttributes({
            text: ''
        });

        surface.renderFrame();

        editor.autoSize();
        editor.setOrientation(attr.orientation);
        editor.inputEl.dom.select();

        var lis = me.edtListening = me.edtListening || {};
        if (!lis[editName]) {
            me.on({
                endedit: function (text) {
                    me.setAttributes({
                        text: text
                    });
                    
                    var parent = me.getParent();
                    if (parent)
                        parent.fireEvent('endedit', text)

                    surface.renderFrame();
                },
                cancel: function () {
                    me.setAttributes({
                        text: me.editingText
                    });
                    surface.renderFrame();
                    cnt.focus();
                }
            });
            lis[editName] = true;
        }

        return false;
    },

    getEditorGrow: function (attr) {
        var rv = {};

        switch (attr.textAlign) {
            case 'start':
                break;
            case 'center':
                rv.x = -0.5;
                break;
            case 'end':
                rv.x = -1;
                break;
        }

        switch (attr.textBaseline) {
            case 'top':
                break;
            case 'middle':
                rv.y = -0.5;
                break;
            case 'bottom':
                rv.y = -1;
                break;
        }

        return rv;
    },

    archive: function () {
        var me = this,
            archive;

        if (me.archiveProperties && me.archiveProperties.length != 0)
            archive = Ext.copyTo({}, me.attr, me.archiveProperties);

        if (Ext.Array.contains(me.archiveProperties, 'background'))
            archive.background = Ext.copyTo({}, me.background, ['fillStyle']);

        return archive;
    }
});
