Ext.define('YZSoft.bpm.src.flowchart.DesignContainer', {
    extend: 'YZSoft.bpm.src.flowchart.Container',
    requires: [
        'YZSoft.src.flowchart.plugin.Designer',
        'YZSoft.bpm.src.ux.Server'
    ],
    plugins: ['yzflowchartdesigner'],
    border: false,
    bodyCls: 'yz-flowchart-bg',
    perfixRe: /\d*$/g,
    pasetOffset: {
        x: 20,
        y: 20
    },
    onSpriteDblClick:Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            spritecontextmenu: 'onSpriteContextMenu',
            spritedblclick:'onSpriteDblClick',
            bodycontextmenu: 'onContextMenu',
            selectioncontextmenu: 'onSelectionContextMenu',
            beforeDorpNewSprite: function (sprite) {
                var newId = me.getUniNodeId(sprite.getSpriteId(), 1);
                me.createUndoStep(Ext.String.format('Drop {0}', newId));
                sprite.setSpriteId(newId, false);
                if (sprite.onPropertyChanged)
                    sprite.onPropertyChanged(sprite.property.data);
            },
            addNewSprite: function (sprite) {
                sprite.setAttributes({
                    showExtension: !!me.showExtension
                });
            },
            dorpNewSprite: function (sprite) {
                sprite.drawContainer = me;
                me.commitUndoStep();
            },
            beforeDragSelecton: function () {
                me.createUndoStep(Ext.String.format('Drop Selection'));
            },
            dorpSelecton: function () {
                me.commitUndoStep();
            },
            beforeNodePropertyChange: function (sprite, property) {
                me.createUndoStep(Ext.String.format('{0} Property Change', sprite.getSpriteName()));
            },
            nodePropertyChanged: function (sprite, property) {
                me.commitUndoStep();
            },
            beforeLinkPropertyChange: function (displayName) {
                me.createUndoStep(Ext.String.format('{0} Property Change', displayName));
            },
            linkPropertyChanged: function (displayName) {
                me.commitUndoStep();
            },
            beforePropertyChange: function () {
                me.createUndoStep('Process Property Change');
            },
            propertyChanged: function () {
                me.commitUndoStep();
            },
            keydown: function (e, t, eOpts) {
                e.stopEvent();

                var key = e.getKey();
                if (e.ctrlKey && key == e.A)
                    me.selectAll();

                if (key == e.DELETE || key == e.BACKSPACE)
                    me.deleteSelection();

                if (e.ctrlKey && key == e.Z)
                    me.undo();

                if (e.ctrlKey && key == e.Y)
                    me.redo();

                if (e.ctrlKey && key == e.C)
                    me.copy();

                if (e.ctrlKey && key == e.V)
                    me.paste();

                if (key == e.UP)
                    me.moveSelectionUp();

                if (key == e.DOWN)
                    me.moveSelectionDown();

                if (key == e.LEFT)
                    me.moveSelectionLeft();

                if (key == e.RIGHT)
                    me.moveSelectionRight();
            }
        });

        me.newProcess();

        me.undoManager = Ext.create('YZSoft.bpm.src.flowchart.UndoManager', {
            maxSteps: 100
        });
    },

    saveProcess: function (config) {
        var me = this,
            surfaces = me.getItems(),
            sprites,
            data;

        config = config || {};

        sprites = me.getAllNodes();
        data = Ext.apply(config.data || {}, me.process);

        data.Nodes = [];
        Ext.each(sprites, function (sprite) {
            var node = me.getNodeFromSprite(sprite);
            if (config.spriteSaved)
                config.spriteSaved.call(config.scope || config, sprite, node);
            data.Nodes.push(node);
        });

        sprites = me.getAllLinks();
        if (me.sortLinks)
            sprites = me.sortLinks(sprites);

        data.Links = [];
        Ext.each(sprites, function (sprite) {
            var link = me.getLinkFromSprite(sprite);
            if (config.spriteSaved)
                config.spriteSaved.call(config.scope || config, sprite, link);
            data.Links.push(link);
        });

        return data;
    },

    getNodeFromSprite: function (sprite) {
        var me = this,
            node;

        //property
        node = Ext.apply({
        }, sprite.property.data);

        if (Ext.getClassName(sprite.property) != (sprite.propertyConfig && sprite.propertyConfig.xclass))
            node.propertyXClass = Ext.getClassName(sprite.property);

        Ext.apply(node, sprite.property.staticData);

        node.Name = sprite.getSpriteName();

        //sprite
        node.Sprite = sprite.archive();
        node.Sprite.xclass = Ext.getClassName(sprite);
        node.Sprite.surfaceName = sprite.getSurface().type;
        node.Sprite = Ext.encode(node.Sprite);

        return node;
    },

    getLinkFromSprite: function (sprite) {
        var me = this,
            link;

        link = Ext.apply({}, sprite.data);

        Ext.apply(link, {
            FromNodeId: sprite.from.sprite.getSpriteId(),
            FromPoint: sprite.from.name,
            ToNodeId: sprite.to.sprite.getSpriteId(),
            ToPoint: sprite.to.name
        });
        Ext.apply(link, sprite.staticData);

        //sprite
        link.Sprite = sprite.archive();
        link.Sprite.xclass = Ext.getClassName(sprite);
        link.Sprite.surfaceName = sprite.getSurface().type;
        link.Sprite = Ext.encode(link.Sprite);

        return link;
    },

    getOutLinksOfSprite: function (sprite, sort) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (spriteTmp.isLink && spriteTmp.from) {
                    if (spriteTmp.from.sprite === sprite)
                        rv.push(spriteTmp);
                }
            }
        }

        if (sort)
            rv = me.sortLinks(rv);

        return rv;
    },

    getAllStepIds: function (sprite) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (spriteTmp.isShape && spriteTmp !== sprite)
                    rv.push(spriteTmp.getSpriteId());
            }
        }

        return rv;
    },

    getAllStepNames: function (sprite) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (spriteTmp.isShape && spriteTmp !== sprite)
                    rv.push(spriteTmp.getSpriteName());
            }
        }

        return rv;
    },

    getUniNodeId: function (prefix, seed, increment) {
        var me = this,
            ids = me.getAllStepIds(),
            seed = (!seed && seed !== 0) ? 1 : seed,
            increment = increment ? increment : 1;

        if (!Ext.Array.contains(ids, prefix))
            return prefix;

        for (var i = seed; ; i += increment) {
            var id = prefix + i;

            if (!Ext.Array.contains(ids, id))
                return id;
        }
    },

    uniqueNodeId: function (ids, nodes, node, seed, increment, fn, scope) {
        var me = this;

        if (!Ext.Array.contains(ids, me.getNodeId(node)))
            return;

        var prefix = me.getObjectNamePerfix(me.getNodeId(node));

        for (var i = seed; ; i += increment) {
            var id = prefix + i;

            if (!Ext.Array.contains(ids, id) &&

                !Ext.Array.findBy(nodes, function (node1) { return String.Equ(me.getNodeId(node1), id); })) {
                var oldId = me.getNodeId(node);
                me.setNodeId(node, id);
                if (fn)
                    fn.call(scope || me, node, oldId, id);

                return;
            }
        }
    },

    //从原生数据获取id
    getNodeId: function (node) {
        return node.Name;
    },

    //设置节点原生数据的id
    setNodeId: function (node, id) {
        node.Name = id;
    },

    prepareSelectionData: function (selection) {
        var me = this,
            surfaces = me.getItems(),
            selection = selection || me.selection,
            allsprites = [];

        var data = {
            sprites: [],
            links: [],
            holdItems: [],
            innerlinks: [],
            flinks: [],
            tlinks: []
        };

        Ext.each(selection, function (sel) {
            if (sel.isShape)
                data.sprites.push(sel);
            if (sel.isLink)
                data.links.push(sel);

            if (sel.getHoldItems)
                data.holdItems = Ext.Array.union(data.holdItems, sel.getHoldItems());
        });

        Ext.each(data.holdItems, function (holdItem) {
            if (Ext.Array.contains(data.sprites, holdItem)) {
                Ext.Array.remove(data.sprites, holdItem);
            }
        });

        allsprites = Ext.Array.union(data.sprites, data.holdItems);

        for (var i = 0, c = surfaces.length; i < c; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            if (!surface.isSurface)
                continue;

            for (var j = 0, c2 = sprites.length; j < c2; j++) {
                var sprite = sprites[j];

                if (!sprite.isLink || !sprite.from || !sprite.to)
                    continue;

                var from = sprite.from.sprite,
                    to = sprite.to.sprite,
                    f = Ext.Array.contains(allsprites, from),
                    t = Ext.Array.contains(allsprites, to);

                sprite.save();

                if (f && t)
                    data.innerlinks.push(sprite);
                else if (f)
                    data.flinks.push(sprite);
                else if (t)
                    data.tlinks.push(sprite);
            }
        }

        return data;
    },

    selectAll: function () {
        var me = this,
            nodes = me.getAllNodes(),
            links = me.getAllLinks();

        me.select(Ext.Array.push(nodes, links));
        me.renderFrame();
    },

    deleteSelection: function (undoMsg) {
        var me = this,
            data = me.prepareSelectionData(),
            sprites = Ext.Array.union(data.sprites, data.innerlinks, data.flinks, data.tlinks, data.links);

        if (sprites.length == 0)
            return;

        me.createUndoStep(Ext.String.format(undoMsg || 'Delete {0} Items', sprites.length), true);

        me.deselectAll();

        Ext.each(data.holdItems, function (sprite) {
            if (sprite.deleteWithHolder)
                sprite.getSurface().remove(sprite, true);
        });

        Ext.each(sprites, function (sprite) {
            sprite.getSurface().remove(sprite, true);
        });

        me.renderFrame();
    },

    createUndoStep: function (stepName, commit) {
        var me = this;

        if (me.undoStep)
            delete me.undoStep;

        var item = Ext.create('YZSoft.bpm.src.flowchart.UndoItem', {
            drawContainer: me,
            stepName: stepName
        });

        if (commit)
            me.commitUndoStep(item);
        else
            me.undoStep = item;

        return item;
    },

    commitUndoStep: function (undoStep, stepName) {
        undoStep = undoStep || this.undoStep;
        if (stepName)
            undoStep.stepName = stepName;

        this.undoManager.push(undoStep);
    },

    undo: function () {
        var me = this,
            undoManager = me.undoManager;

        var item = undoManager.popUndo(function () {
            return me.createUndoStep('Last');
        });

        if (item)
            item.restore();
    },

    redo: function () {
        var me = this,
            undoManager = me.undoManager;

        var item = undoManager.popRedo();
        if (item)
            item.restore();
    },

    canCopy: function () {
        var sel = this.prepareSelectionData();
        return sel.sprites.length >= 1;
    },

    canCopyStyle: function (sprites) {
        return sprites.length == 1 && sprites[0].applyStyleZone;
    },

    canPaste: function () {
        return YZSoft.ProcessClipData;
    },

    canDelete: function () {
        var sel = this.getSelection();
        return sel.length >= 1;
    },

    cut: function () {
        this.copy(true);
    },

    copy: function (cut) {
        var me = this,
            selection = me.prepareSelectionData(),
            data;

        if (selection.sprites.length == 0)
            return;

        data = {
            Nodes: [],
            Links: []
        };

        Ext.each(selection.sprites, function (sprite) {
            data.Nodes.push(me.getNodeFromSprite(sprite));
        });

        Ext.each(selection.innerlinks, function (sprite) {
            data.Links.push(me.getLinkFromSprite(sprite));
        });

        if (YZSoft.ProcessClipData)
            delete YZSoft.ProcessClipData;

        YZSoft.ProcessClipData = Ext.encode(data);

        if (cut)
            me.deleteSelection('Cut {0} Items');

        me.fireEvent('clipDataChanged')
    },

    paste: function () {
        var me = this,
            data = YZSoft.ProcessClipData; // clippy.getData('ProcessData');

        if (!data)
            return;

        var undoStep = me.createUndoStep('Paste', true);

        data = Ext.decode(data);
        me.uniqueNodeIds(data);

        Ext.each([data.Nodes, data.Links], function (objs) {
            Ext.each(objs, function (obj) {
                var sprite = obj.Sprite ? Ext.decode(obj.Sprite) : obj.sprite; //流程定义：Sprite，BPA:sprite
                me.offsetObject(sprite, me.pasetOffset);
                obj.Sprite = Ext.encode(sprite);
            });
        });

        me.loadSprites(data.Nodes, data.Links);
        me.commitUndoStep(undoStep);
    },

    onApplyStyleClick: function () {
        var me = this,
            sprites = me.getSelection(),
            sprite = sprites && sprites[0];

        if (sprite)
            me.fireEvent('applyStyle', sprite);
    },

    applyStyle: function (sprite, templateSprite) {
        var me = this;

        if (sprite.applyStyle && sprite.applyStyleZone && sprite.applyStyleZone == templateSprite.applyStyleZone) {
            me.createUndoStep(Ext.String.format('Apply Style'));
            sprite.applyStyle(templateSprite);
            me.commitUndoStep();
        }
    },

    offsetObject: function (obj, offset) {
        obj.translationX = (obj.translationX || 0) + offset.x;
        obj.translationY = (obj.translationY || 0) + offset.y;
    },

    uniqueNodeIds: function (data) {
        var me = this,
            ids = me.getAllStepIds();

        Ext.each(data.Nodes, function (node) {
            me.uniqueNodeId(ids, data.Nodes, node, 1, 1, function (node, oldid, newid) {
                Ext.each(data.Links, function (link) {
                    Ext.each(['FromNodeId', 'ToNodeId'], function (p) {
                        if (String.Equ(link[p], oldid))
                            link[p] = newid;
                    });
                });
            });
        });
    },

    getObjectNamePerfix: function (name) {
        return name.replace(this.perfixRe, '');
    },

    replaceSprite: function (sprite, newSprite) {
        var me = this,
            surfaces = me.getItems(),
            surface, it, jt;

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (spriteTmp.isLink) {
                    if (spriteTmp.from && spriteTmp.from.sprite === sprite)
                        spriteTmp.from = newSprite.hotpointsMap[spriteTmp.from.name];

                    if (spriteTmp.to && spriteTmp.to.sprite === sprite)
                        spriteTmp.to = newSprite.hotpointsMap[spriteTmp.to.name];
                }
            }
        }

        me.deselectAll();
        surface = sprite.getSurface();

        if (sprite.onBeforeReplace)
            sprite.onBeforeReplace(newSprite);

        surface.remove(sprite, true);
        surface.add(newSprite);
        me.select(newSprite);
    },

    changeType: function (sprite, xclass) {
        var me = this,
            undoStep, archive, newSprite;

        undoStep = me.createUndoStep('Change Sprite Type');

        archive = me.getNodeFromSprite(sprite);
        archive.xclass = xclass;
        newSprite = me.getSpriteFromNode(archive);

        me.replaceSprite(sprite, newSprite);

        me.commitUndoStep(undoStep);
        me.renderFrame();
    },

    getShapes: function (sprites) {
        var rv = [];
        Ext.each(sprites, function (sprite) {
            if (sprite.isShape)
                rv.push(sprite);
        });

        return rv;
    },

    moveSelectionUp: function () {
        var undoStep = this.createUndoStep('Move Up');
        if (this.moveSelection(0, -10))
            this.commitUndoStep(undoStep);
    },

    moveSelectionDown: function () {
        var undoStep = this.createUndoStep('Move Down');
        if (this.moveSelection(0, 10))
            this.commitUndoStep(undoStep);
    },

    moveSelectionLeft: function () {
        var undoStep = this.createUndoStep('Move Left');
        if (this.moveSelection(-10, 0))
            this.commitUndoStep(undoStep);
    },

    moveSelectionRight: function () {
        var undoStep = this.createUndoStep('Move Right');
        if (this.moveSelection(10, 0))
            this.commitUndoStep(undoStep);
    },

    getClipBox: function () {
        var cmp = this.up(),
            box = cmp.getBox(true, false);

        box.right = box.left + cmp.getEl().dom.clientWidth - 1;
        box.bottom = box.top + cmp.getEl().dom.clientHeight - 1;
        return box;
    },

    moveSelection: function (x, y) {
        var me = this,
            shapes = me.getShapes(this.getSelection()),
            cntbox = me.getBox(true, true),
            clipBox = {},
            region;

        if (shapes.length == 0)
            return false;

        Ext.each(shapes, function (sprite) {
            var bbox = sprite.getBBox(false);
            var reg = new Ext.util.Region(bbox.y, bbox.x + bbox.width, bbox.y + bbox.height, bbox.x);
            region = region ? region.union(reg) : reg;
        });

        if (x < 0 && region.left + x < cntbox.left)
            return false;

        if (x > 0 && region.right + x > cntbox.right)
            return false;

        if (y < 0 && region.top + y < cntbox.top)
            return;

        if (y > 0 && region.bottom + y > cntbox.bottom)
            return false;

        Ext.each(shapes, function (shape) {
            me.fireEvent('commandMoveShape', shape, x, y);
        });

        me.renderFrame();
        me.focus();
        return true;
    }
});