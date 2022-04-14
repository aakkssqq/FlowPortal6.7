/*
config
readOnly
*/
Ext.define('YZSoft.bpa.DesignerPanelBase', {
    extend: 'Ext.panel.Panel',

    displayVersion: function (version) {
        if (this.txtVersion) {
            this.txtVersion.version = version;
            this.txtVersion.update(version ? Ext.String.format('{0} : {1}', RS.$('All_Version'), version) : '');
        }
    },

    getActiveDrawContainer: function () {
        return this.drawContainer;
    },

    getShapes: function (sprites) {
        var rv = [];
        Ext.each(sprites, function (sprite) {
            if (sprite.isShape)
                rv.push(sprite);
        });

        return rv;
    },

    getLinks: function (sprites) {
        var rv = [];
        Ext.each(sprites, function (sprite) {
            if (sprite.isLink)
                rv.push(sprite);
        });

        return rv;
    },

    canChangeLineWidth: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.supportLineWidth === false || sprite.canChangeLineWidth === false)
                return true;
        });
        return sprite ? false : true;
    },

    canChangeLineStyle: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.supportLineStyle === false || sprite.canChangeLineStyle === false)
                return true;
        });
        return sprite ? false : true;
    },

    canChangeStrokeStyle: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.supportStrokeStyle === false || sprite.canChangeStrokeStyle === false)
                return true;
        });
        return sprite ? false : true;
    },

    canChangeFillStyle: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.supportFillStyle === false || sprite.canChangeFillStyle === false)
                return true;
        });
        return sprite ? false : true;
    },

    canChangeStartArrow: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (!sprite.isLink || sprite.supportStartArrow === false || sprite.canChangeStartArrow === false)
                return true;
        });
        return sprite ? false : true;
    },

    canChangeEndArrow: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (!sprite.isLink || sprite.supportEndArrow === false || sprite.canChangeEndArrow === false)
                return true;
        });
        return sprite ? false : true;
    },

    canChangeTextAlign: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            sprite = sprite.sprites && sprite.sprites.text;
            if (!sprite || sprite.supportTextAlign === false || sprite.canChangeTextAlign === false)
                return true;
        });
        return sprite ? false : true;
    },

    canChangeTextVAlign: function (sprites) {
        if (sprites.length == 0)
            return false;

        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            sprite = sprite.sprites && sprite.sprites.text;
            if (!sprite || sprite.supportTextVAlign === false || sprite.canChangeTextVAlign === false)
                return true;
        });
        return sprite ? false : true;
    },

    getLineWidthRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.canChangeLineWidth !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                if (sprite.supportLineWidth !== false)
                    return true;
            });
        }

        return sprite;
    },

    getLineStyleRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.canChangeLineStyle !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                if (sprite.supportLineStyle !== false)
                    return true;
            });
        }

        return sprite;
    },

    getFillStyleRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.canChangeFillStyle !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                if (sprite.supportFillStyle !== false)
                    return true;
            });
        }

        return sprite;
    },

    getStrokeStyleRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.canChangeStrokeStyle !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                if (sprite.supportStrokeStyle !== false)
                    return true;
            });
        }

        return sprite;
    },

    getStartArrowRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.isLink && sprite.canChangeStartArrow !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                if (sprite.isLink && sprite.supportStartArrow !== false)
                    return true;
            });
        }

        return sprite;
    },

    getEndArrowRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            if (sprite.isLink && sprite.canChangeEndArrow !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                if (sprite.isLink && sprite.supportEndArrow !== false)
                    return true;
            });
        }

        return sprite;
    },

    getTextAlignRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            sprite = sprite.sprites && sprite.sprites.text;
            if (sprite && sprite.canChangeTextAlign !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                sprite = sprite.sprites && sprite.sprites.text;
                if (sprite && sprite.supportTextAlign !== false)
                    return true;
            });
        }

        return sprite;
    },

    getTextVAlignRefSprite: function (sprites) {
        var sprite = Ext.Array.findBy(sprites, function (sprite) {
            sprite = sprite.sprites && sprite.sprites.text;
            if (sprite && sprite.canChangeTextVAlign !== false)
                return true;
        });

        if (!sprite) {
            sprite = Ext.Array.findBy(sprites, function (sprite) {
                sprite = sprite.sprites && sprite.sprites.text;
                if (sprite && sprite.supportTextVAlign !== false)
                    return true;
            });
        }

        return sprite;
    },

    onHAlignStart: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Horz Align Start');
        this.alignStart('x', 'width');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onVAlignStart: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Vert Align Start');
        this.alignStart('y', 'height');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onHAlignEnd: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Horz Align End');
        this.alignEnd('x', 'width');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onVAlignEnd: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Vert Align Start');
        this.alignEnd('y', 'height');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onHAlignMiddle: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Horz Align Middle');
        this.alignMiddle('x', 'width');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onVAlignMiddle: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Vert Align Start');
        this.alignMiddle('y', 'height');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    alignStart: function (posProp, sizeProp) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            shapes = me.getShapes(dcnt.getSelection());

        if (shapes.length <= 1)
            return;

        var refShape = shapes[0],
            refBBox = refShape.getBBox(false);

        Ext.each(shapes, function (shape) {
            if (shape === refShape)
                return;

            var bbox = shape.getBBox(false),
                offset = refBBox[posProp] - bbox[posProp],
                attr = {};

            dcnt.fireEvent('commandMoveShape', shape, posProp == 'x' ? offset : 0, posProp == 'y' ? offset : 0);
        });

        dcnt.renderFrame();
        dcnt.focus();
    },

    alignEnd: function (posProp, sizeProp, transProp) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            shapes = me.getShapes(dcnt.getSelection());

        if (shapes.length <= 1)
            return;

        var refShape = shapes[0];
        var refBBox = refShape.getBBox(false);
        Ext.each(shapes, function (shape) {
            if (shape === refShape)
                return;

            var bbox = shape.getBBox(false),
                offset = refBBox[posProp] + refBBox[sizeProp] - (bbox[posProp] + bbox[sizeProp]),
                attr = {};

            dcnt.fireEvent('commandMoveShape', shape, posProp == 'x' ? offset : 0, posProp == 'y' ? offset : 0);
        });

        dcnt.renderFrame();
        dcnt.focus();
    },

    alignMiddle: function (posProp, sizeProp, transProp) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            shapes = me.getShapes(dcnt.getSelection());

        if (shapes.length <= 1)
            return;

        var refShape = shapes[0],
            refBBox = refShape.getBBox(false);

        Ext.each(shapes, function (shape) {
            if (shape === refShape)
                return;

            var bbox = shape.getBBox(false),
                offset = refBBox[posProp] - bbox[posProp] + Math.round((refBBox[sizeProp] - bbox[sizeProp]) / 2),
                attr = {};

            dcnt.fireEvent('commandMoveShape', shape, posProp == 'x' ? offset : 0, posProp == 'y' ? offset : 0);
        });

        dcnt.renderFrame();
        dcnt.focus();
    },

    onHSpaceAlign: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Horz Space Align');
        this.spaceAlign('x', 'width', 'translationX');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onVSpaceAlign: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Vert Space Align');
        this.spaceAlign('y', 'height', 'translationY');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onHSpaceIncrease: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Horz Space Increase');
        this.spaceIncrease('x', 'width', 'translationX', this.increaseStep.x);
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onVSpaceIncrease: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Vert Space Increase');
        this.spaceIncrease('y', 'height', 'translationY', this.increaseStep.y);
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onHSpaceDecrease: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Horz Space Decrease');
        this.spaceIncrease('x', 'width', 'translationX', -this.increaseStep.x);
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onVSpaceDecrease: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Vert Space Decrease');
        this.spaceIncrease('y', 'height', 'translationY', -this.increaseStep.y);
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onHSpaceRemove: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Horz Space Remove');
        this.spaceRemove('x', 'width', 'translationX');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onVSpaceRemove: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Vert Space Remove');
        this.spaceRemove('y', 'height', 'translationY');
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    spaceAlign: function (posProp, sizeProp, transProp) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            shapes = me.getShapes(dcnt.getSelection()),
            bboxs = [];

        if (shapes.length <= 2)
            return;

        Ext.each(shapes, function (sprite) {
            var bbox = sprite.getBBox(false);
            bboxs.push(bbox);
            bbox.sprite = sprite;
        });

        bboxs = Ext.Array.sort(bboxs, function (a, b) {
            return a[posProp] - b[posProp];
        });

        //空间合计
        var allSpace = bboxs[bboxs.length - 1][posProp] - bboxs[0][posProp] - bboxs[0][sizeProp];
        for (var i = 1; i < bboxs.length - 1; i++) {
            allSpace -= bboxs[i][sizeProp];
        }

        var space = Math.round(allSpace / (bboxs.length - 1));
        for (var i = 1; i < bboxs.length; i++) {
            var bbox = bboxs[i],
                bboxprev = bboxs[i - 1].sprite.getBBox(false),
                newpos = bboxprev[posProp] + bboxprev[sizeProp] + space,
                offset = newpos - bbox[posProp],
                shape = bbox.sprite,
                attr = {};

            dcnt.fireEvent('commandMoveShape', shape, posProp == 'x' ? offset : 0, posProp == 'y' ? offset : 0);
        }

        dcnt.renderFrame();
        dcnt.focus();
    },

    spaceIncrease: function (posProp, sizeProp, transProp, increase) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            shapes = me.getShapes(dcnt.getSelection()),
            bboxs = [];

        if (shapes.length <= 1)
            return;

        Ext.each(shapes, function (sprite) {
            var bbox = sprite.getBBox(false);
            bboxs.push(bbox);
            bbox.sprite = sprite;
        });

        bboxs = Ext.Array.sort(bboxs, function (a, b) {
            return a[posProp] - b[posProp];
        });

        for (var i = 1; i < bboxs.length; i++) {
            var bbox = bboxs[i],
                offset = i * increase,
                bboxprev = bboxs[i - 1].sprite.getBBox(false),
                minPos = bboxprev[posProp] + bboxprev[sizeProp],
                shape = bbox.sprite,
                attr = {};

            if (increase < 0)
                offset = Math.abs(bbox[posProp] - minPos) < Math.abs(offset) ? minPos - bbox[posProp] : offset;

            dcnt.fireEvent('commandMoveShape', shape, posProp == 'x' ? offset : 0, posProp == 'y' ? offset : 0);
        }

        dcnt.renderFrame();
        dcnt.focus();
    },

    spaceRemove: function (posProp, sizeProp, transProp) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            shapes = me.getShapes(dcnt.getSelection()),
            bboxs = [];

        if (shapes.length <= 1)
            return;

        Ext.each(shapes, function (sprite) {
            var bbox = sprite.getBBox(false);
            bboxs.push(bbox);
            bbox.sprite = sprite;
        });

        bboxs = Ext.Array.sort(bboxs, function (a, b) {
            return a[posProp] - b[posProp];
        });

        for (var i = 1; i < bboxs.length; i++) {
            var bbox = bboxs[i],
                bboxprev = bboxs[i - 1].sprite.getBBox(false),
                newpos = bboxprev[posProp] + bboxprev[sizeProp],
                offset = newpos - bbox[posProp],
                shape = bbox.sprite,
                attr = {};

            dcnt.fireEvent('commandMoveShape', shape, posProp == 'x' ? offset : 0, posProp == 'y' ? offset : 0);
        }

        dcnt.renderFrame();
        dcnt.focus();
    },

    onSameWidth: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Same Width');
        this.sameSize({
            width: true
        });
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onSameHeight: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Same Height');
        this.sameSize({
            height: true
        });
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    onSameSize: function () {
        var undoStep = this.getActiveDrawContainer().createUndoStep('Same Size');
        this.sameSize({
            width: true,
            height: true
        });
        this.getActiveDrawContainer().commitUndoStep(undoStep);
    },

    sameSize: function (option) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            shapes = me.getShapes(dcnt.getSelection());

        if (shapes.length <= 1)
            return;

        var refShape = shapes[0],
            refBBox = refShape.getBBox(false);

        Ext.each(shapes, function (shape) {
            if (shape === refShape)
                return;

            var bbox = shape.getBBox(false);

            dcnt.fireEvent('commandResizeShape', shape, (option.width ? refBBox : bbox).width, (option.height ? refBBox : bbox).height);
        });

        dcnt.renderFrame();
        dcnt.focus();
    },

    onBringFront: function () {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection(),
            surfaces = {},
            surface, surfaceItem;

        if (sprites.length == 0)
            return;

        var undoStep = dcnt.createUndoStep('Bring Front');

        Ext.each(sprites, function (sprite) {
            surface = sprite.getSurface();
            surfaceItem = surfaces[surface.type] = surfaces[surface.type] || [];
            surfaceItem.push(sprite);
            surface.remove(sprite, false);
        });

        Ext.Object.each(surfaces, function (key, value) {
            surface = dcnt.getSurface(key);
            surface.add(value);
        });

        dcnt.renderFrame();
        dcnt.focus();

        dcnt.commitUndoStep(undoStep);
    },

    onSendBottom: function () {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection(),
            surfaces = {},
            surface, surfaceItem, items = [];

        if (sprites.length == 0)
            return;

        var undoStep = dcnt.createUndoStep('Send Bottom');

        Ext.each(sprites, function (sprite) {
            surface = sprite.getSurface();
            surfaceItem = surfaces[surface.type] = surfaces[surface.type] || [];
            surfaceItem.push(sprite);
            surface.remove(sprite, false);
        });

        Ext.Object.each(surfaces, function (key, value) {
            surface = dcnt.getSurface(key);
            Ext.each(surface.getItems(), function (sprite) {
                items.push(sprite);
            });
            surface.removeAll(false);
            surface.add(value);
            surface.add(items);
        });

        dcnt.renderFrame();
        dcnt.focus();

        dcnt.commitUndoStep(undoStep);
    },

    onFontFamilyPicked: function (fontFamily) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Font Family', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    fontFamily: fontFamily
                });
            }
        });

        dcnt.renderFrame();
    },

    onFontSizeChange: function (edt, value) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        value = parseFloat(String(value));
        value = Math.min(Math.max(value, 12) || 12, 96);

        dcnt.createUndoStep('Change Font Size', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    fontSize: value
                });
            }
        });

        dcnt.renderFrame();
    },

    onBoldPressed: function (btn, pressed) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Bold', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    fontWeight: pressed ? 'bold' : 'normal'
                });
            }
        });

        dcnt.renderFrame();
    },

    onItalicPressed: function (btn, pressed) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Italic', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    fontStyle: pressed ? 'italic' : ''
                });
            }
        });

        dcnt.renderFrame();
    },

    onUnderlinePressed: function (btn, pressed) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Underline', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    underline: pressed
                });
            }
        });

        dcnt.renderFrame();
    },

    onFontColorPicked: function (color) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Font Color', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    fillStyle: color
                });
            }
        });

        dcnt.renderFrame();
    },

    onFontBgColorPicked: function (color) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Font Color', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setBackground({
                    fillStyle: color
                });
            }
        });

        dcnt.renderFrame();
    },

    onLineWidthPicked: function (lineWidth) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Line Width', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.supportLineWidth === false || sprite.canChangeLineWidth === false)
                return;

            sprite.setAttributes({
                lineWidth: lineWidth
            });
        });

        dcnt.renderFrame();
    },

    onLineStylePicked: function (lineDash) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Line Style', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.supportLineStyle === false || sprite.canChangeLineStyle === false)
                return;

            sprite.setAttributes({
                lineDash: lineDash
            });
        });

        dcnt.renderFrame();
    },

    onFillColorPicked: function (color) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Fill Color', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.supportFillStyle === false || sprite.canChangeFillStyle === false)
                return;

            sprite.setAttributes({
                fillStyle: color
            });
        });

        dcnt.renderFrame();
    },

    onStrokeColorPicked: function (color) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Stroke Color', true);
        Ext.each(sprites, function (sprite) {
            if (sprite.supportStrokeStyle === false || sprite.canChangeStrokeStyle === false)
                return;

            sprite.setAttributes({
                strokeStyle: color
            });
        });

        dcnt.renderFrame();
    },

    onStartArrowPicked: function (arrowType) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change Start Arrow', true);
        Ext.each(sprites, function (sprite) {
            if (!sprite.isLink || sprite.supportStartArrow === false || sprite.canChangeStartArrow === false)
                return;

            sprite.sprites.startArrow.setAttributes({
                type: arrowType
            });
        });

        dcnt.renderFrame();
    },

    onEndArrowPicked: function (arrowType) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Change End Arrow', true);
        Ext.each(sprites, function (sprite) {
            if (!sprite.isLink || sprite.supportEndArrow === false || sprite.canChangeEndArrow === false)
                return;

            sprite.sprites.endArrow.setAttributes({
                type: arrowType
            });
        });

        dcnt.renderFrame();
    },

    onLinkTypePicked: function (linkType) {
        var me = this,
            dcnt = me.getActiveDrawContainer();

        dcnt.linkXClass = 'YZSoft.src.flowchart.link.' + linkType;
    },

    onTextHAlign: function (pos) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Text Align ' + Ext.String.capitalize(pos), true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    textAlign: pos
                });
            }
        });

        dcnt.renderFrame();
    },

    onTextVAlign: function (pos) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Text Align ' + Ext.String.capitalize(pos), true);
        Ext.each(sprites, function (sprite) {
            if (sprite.sprites && sprite.sprites.text) {
                sprite.sprites.text.setAttributes({
                    textBaseline: pos
                });
            }
        });

        dcnt.renderFrame();
    },

    onPatternItemClick: function (template) {
        var me = this,
            dcnt = me.getActiveDrawContainer(),
            sprites = dcnt.getSelection();

        dcnt.createUndoStep('Apply Pattern', true);
        Ext.each(sprites, function (sprite) {
            me.applyPattern(sprite, template);
        });

        dcnt.renderFrame();
    },

    applyPattern: function (sprite, template) {

        //lineWidth
        if (template.lineWidth) {
            if (sprite.supportLineWidth !== false && sprite.canChangeLineWidth !== false) {
                sprite.setAttributes({
                    lineWidth: template.lineWidth
                });
            }
        }

        //lineDash
        if (template.lineDash) {
            if (sprite.supportLineStyle !== false && sprite.canChangeLineStyle !== false) {
                sprite.setAttributes({
                    lineDash: template.lineDash
                });
            }
        }

        //strokeStyle
        if (sprite.supportStrokeStyle !== false && sprite.canChangeStrokeStyle !== false) {
            sprite.setAttributes({
                strokeStyle: template.strokeStyle,
                strokeOpacity: template.strokeOpacity
            });
        }

        //fillStyle
        if (template.fillStyle) {
            if (sprite.supportFillStyle !== false && sprite.canChangeFillStyle !== false) {
                sprite.setAttributes({
                    fillStyle: template.fillStyle
                });
            }
        }
    }
});