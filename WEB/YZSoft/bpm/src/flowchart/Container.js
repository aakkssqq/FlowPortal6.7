/*
events:
  bodycontextmenu
*/
Ext.define('YZSoft.bpm.src.flowchart.Container', {
    extend: 'YZSoft.src.flowchart.Container',
    nodeNameProperty: 'Name',

    loadProcess: function (process, config) {
        //remove all surface 必需在getSurface前调用
        this.deselectAll();
        this.removeAll(true);

        var me = this,
            nodeSprites = [],
            linkSprites = [],
            spritesById = {};

        config = config || {};
        me.process = process;

        Ext.each(process.Nodes, function (node) {
            var sprite = me.getSpriteFromNode(node);
            if (config.spriteCreated)
                config.spriteCreated.call(config.scope || config, sprite, node);
            nodeSprites.push(sprite);
        });

        Ext.each(nodeSprites, function (sprite) {
            spritesById[sprite.getSpriteId()] = sprite;
        });

        Ext.each(nodeSprites, function (sprite) {
            if (sprite.onAfterLoadNodes)
                sprite.onAfterLoadNodes(spritesById);
        });

        Ext.each(process.Links, function (link) {
            var sprite = me.getSpriteFromLink(spritesById, link);
            if (config.spriteCreated)
                config.spriteCreated.call(config.scope || config, sprite, link);
            linkSprites.push(sprite);
        });

        me.fireEvent('processLoading');

        Ext.each(nodeSprites, function (sprite) {
            me.getSurface(sprite.surfaceName || 'shape').add(sprite);
            me.fireEvent('addNewSprite', sprite);
        });
        Ext.each(linkSprites, function (sprite) {
            me.getSurface(sprite.surfaceName || 'link').add(sprite);
            me.fireEvent('addNewLink', sprite);
        });

        me.fireEvent('processLoaded', process, nodeSprites, linkSprites);

        if (config.beforeRender)
            config.beforeRender.call(config.scope || config);

        me.renderFrame();
    },

    loadSprites: function (Nodes, Links) {
        var me = this,
            nodeSprites = [],
            linkSprites = [],
            spritesById = {};

        me.deselectAll();

        Ext.each(Nodes, function (node) {
            var sprite = me.getSpriteFromNode(node);
            nodeSprites.push(sprite);
        });

        Ext.each(nodeSprites, function (sprite) {
            spritesById[sprite.getSpriteId()] = sprite;
        });

        Ext.each(Links, function (link) {
            var sprite = me.getSpriteFromLink(spritesById, link);
            linkSprites.push(sprite);
        });

        Ext.each(nodeSprites, function (sprite) {
            me.getSurface(sprite.surfaceName || 'shape').add(sprite);
            me.fireEvent('addNewSprite', sprite);
        });
        Ext.each(linkSprites, function (sprite) {
            me.getSurface(sprite.surfaceName || 'link').add(sprite);
            me.fireEvent('addNewLink', sprite);
        });

        me.select(nodeSprites);
        me.renderFrame();
    },

    getSpriteFromNode: function (node) {
        var me = this,
            spriteCfg = Ext.decode(node.Sprite),
            spriteXClass = spriteCfg.xclass,
            propertyXClass = node.propertyXClass,
            typeName = node.ElementTypeName.replace(/Node$/g, ''),
            cfg, propertyCfg, sprite, xclass;

        if (!spriteXClass)
            spriteXClass = 'YZSoft.bpm.src.flowchart.sprite.' + typeName;
        else {
            //老版本存的是YZSoft.BPM.
            if (Ext.String.startsWith(spriteXClass, 'YZSoft.BPM.', 0, false))
                spriteXClass = 'YZSoft.bpm.' + spriteXClass.substr(11);
        }
        if (!propertyXClass) {
            propertyXClass = 'YZSoft.bpm.src.flowchart.property.' + typeName;
        }
        else {
            if (Ext.String.startsWith(propertyXClass, 'YZSoft.BPM.', 0, false))
                propertyXClass = 'YZSoft.bpm.' + propertyXClass.substr(11);
        }

        cfg = Ext.apply({
            node: node,
            drawContainer: me,
            sprites: {}
        }, spriteCfg);

        cfg.property = {
            xclass: propertyXClass,
            data: Ext.apply({}, node)
        };
        delete cfg.property.data.Sprite;

        sprite = Ext.create(spriteXClass, cfg);
        sprite.onPropertyChanged(sprite.property.data);
        return sprite;
    },

    getSpriteFromLink: function (spritesById, link) {
        var me = this,
            lineType = link.LineType,
            cfg = Ext.apply({}, Ext.decode(link.Sprite)),
            fromSprite = spritesById[link.FromNodeId],
            fromPoint = fromSprite.hotpointsMap[link.FromPoint],
            toSprite = spritesById[link.ToNodeId],
            toPoint = toSprite.hotpointsMap[link.ToPoint];

        Ext.apply(cfg, {
            from: fromPoint,
            to: toPoint,
            points: cfg.points ? cfg.points : me.offsetsToPoints(fromPoint, cfg.offsets),
            data: Ext.copyTo({}, link, 'DisplayString,ValidationGroup,ProcessConfirmType,PromptMessage,ConditionType,Events')
        });
        delete cfg.offsets;

        Ext.apply(cfg.sprites.text, {
            text: link.DisplayString || ''
        });

        return Ext.create('YZSoft.src.flowchart.link.' + lineType, cfg);
    },

    offsetsToPoints: function (from, offsets) {
        var points = [],
            ptCur;

        ptCur = {
            x: from.x,
            y: from.y
        };

        points.push(Ext.clone(ptCur));
        Ext.each(offsets, function (offset) {
            ptCur.x += offset.x;
            ptCur.y += offset.y;
            points.push(Ext.clone(ptCur));
        });

        return points;
    },

    getAllNodes: function () {
        return this.getAllSprites(function (sprite) {
            return sprite.isShape
        });
    },

    getAllLinks: function () {
        return this.getAllSprites(function (sprite) {
            return sprite.isLink
        });
    },

    findSprite: function (fn) {
        var me = this,
            surfaces = me.getItems();

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (!fn || fn(spriteTmp) === true)
                    return spriteTmp;
            }
        }

        return null;
    },

    findSpriteById: function (id) {
        var me = this;

        return me.findSprite(function (sprite) {
            return sprite.getSpriteId && sprite.getSpriteId() == id;
        });
    }
});