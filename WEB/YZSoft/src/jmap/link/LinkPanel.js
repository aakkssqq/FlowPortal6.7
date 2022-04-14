
Ext.define('YZSoft.src.jmap.link.LinkPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.ast.Walk',
        'YZSoft.src.ast.ParamsParser',
        'YZSoft.src.ast.JSM.JSM2JsonConvert',
        'YZSoft.src.ast.JSM.JsonMappingReader'
    ],
    style:'border-left:solid 1px #cacbcc;border-right:solid 1px #cacbcc;z-index:999;',
    layout: 'fit',
    config: {
        fromTree: null,
        toTree: null,
        editor: null,
        jsmCode: null
    },
    fromRecordHighlightCls: 'yz-jsonschema-item-highlight',

    initComponent: function () {
        var me = this;

        me.jsmParser = Ext.create('YZSoft.src.ast.JSM.Parser', {
            jsmCode: me.getJsmCode()
        });

        me.jsmParser.on({
            astchanged: function (ast) {
                var jsonMapping = me.lastJsonMapping = YZSoft.src.ast.JSM.JSM2JsonConvert.convert(ast);

                me.editor.setSyntaxError(null);
                me.updateMapping(jsonMapping);
            },
            parseFailed: function (result) {
                me.editor.setSyntaxError(result);
            }
        });

        me.drawContainer = Ext.create('YZSoft.src.jmap.link.DrawContainer', {
            bodyStyle: 'background-color:transparent;'
        });

        me.items = [{
            xtype: 'container',
            layout: 'fit',
            margin:'0 -6',
            //style:'background-color:transparent;border:solid 1px green;',
            items:[
                me.drawContainer
            ]
        }];

        me.callParent(arguments);

        me.on({
            scope: me,
            linkdrop:'onLinkDrop'
        });

        me.editor.on({
            keyup: function () {
                me.setJsmCode(me.editor.getValue());
            },
            clearmapdone: function () {
                me.setJsmCode(me.editor.getValue());
            },
            linkdropdone: function () {
                me.setJsmCode(me.editor.getValue());
            }
        });

        me.fromTree.on({
            updateschema: function () {
                if (me.lastJsonMapping)
                    me.updateMapping(me.lastJsonMapping);
            }
        });

        me.toTree.on({
            itemmouseenter: function (view, record) {
                var sprites = me.drawContainer.getSpritesBy(function (sprite) {
                    if (sprite.isLink || sprite.isRangeLink) {
                        return sprite.getToRecord() === record;
                    }
                });

                me.highlightLinks(sprites);
            },
            itemmouseleave: function (view, record) {
                var sprites = me.drawContainer.getSpritesBy(function (sprite) {
                    if (sprite.isLink || sprite.isRangeLink) {
                        return sprite.getToRecord() === record;
                    }
                });

                me.unhighlightLinks(sprites);
            },
            clearlink: function (record) {
                me.clearMapByToRecord(record);
            },
            updateschema: function () {
                if (me.lastJsonMapping)
                    me.updateMapping(me.lastJsonMapping);
            }
        });
    },

    updateJsmCode: function (value) {
        var me = this;

        if (me.jsmParser)
            me.jsmParser.setJsmCode(value);

        me.fireEvent('codechange', value);
    },

    onLinkDrop: function (fromTree, fromRecord, toTree, toRecord, e) {
        var me = this,
            surface = me.drawContainer.getSurface('main');

        if (!e.ctrlKey && fromRecord.isArray() && toRecord.isArray()) {
            surface.add(Ext.create('YZSoft.src.jmap.link.RangeLink', {
                fromTree: fromTree,
                fromRecord: fromRecord,
                toTree: toTree,
                toRecord: toRecord
            }));
        }
        else {
            surface.add(Ext.create('YZSoft.src.jmap.link.Link', {
                fromTree: fromTree,
                fromRecord: fromRecord,
                toTree: toTree,
                toRecord: toRecord
            }));
        }

        me.drawContainer.renderFrame();
    },

    clearMapByToRecord: function (record) {
        var me = this,
            surfaces = me.drawContainer.getItems(),
            removeSprites;
        
        removeSprites = me.drawContainer.getSpritesBy(function (sprite) {
            if (sprite.isLink || sprite.isRangeLink) {
                return sprite.getToRecord() === record;
            }
        });

        Ext.each(removeSprites, function (sprite) {
            sprite.remove();
            sprite.destroy();
        });

        me.drawContainer.renderFrame();

        me.fireEvent('linkcleared')
    },

    updateMapping: function (json) {
        var me = this,
            surface = me.drawContainer.getSurface('main'),
            fromTree = me.getFromTree(),
            toTree = me.getToTree(),
            fromStore = fromTree.getStore(),
            toStore = toTree.getStore();

        me.drawContainer.removeAll(true);
        YZSoft.src.ast.JSM.JsonMappingReader.walk(json, function (path, obj, vars, ancestors) {
            if (obj.isMap)
                me.createRangeLink(path, obj, vars, ancestors);
            if (obj.isProperty)
                me.createLineLink(path, obj, vars, ancestors);
        });

        me.drawContainer.renderFrame();
    },

    getRecordFromPath: function (tree, path, separator) {
        separator = separator || '.';

        path = Ext.isString(path) ? path.split(separator):path;

        var rec = tree.getRootNode();

        Ext.each(path, function (objname) {
            rec = Ext.Array.findBy(rec.childNodes, function (childNode) {
                return childNode.data.propertyName == objname;
            });

            if (!rec)
                return false;
        });

        return rec;
    },

    createRangeLink: function (path, obj, vars, ancestors) {
        var me = this,
            surface = me.drawContainer.getSurface('main'),
            fromTree = me.getFromTree(),
            toTree = me.getToTree(),
            toRecord = me.getRecordFromPath(toTree, path),
            fromfield = obj.src,
            fromRecord;

        if (!toRecord)
            return;

        fromfield = YZSoft.src.ast.JSM.JsonMappingReader.resolveParams(fromfield, vars);
        fromRecord = me.getRecordFromPath(fromTree, fromfield);

        if (fromRecord) {
            surface.add(Ext.create('YZSoft.src.jmap.link.RangeLink', {
                fromTree: fromTree,
                fromRecord: fromRecord,
                toTree: toTree,
                toRecord: toRecord
            }));
        }
    },

    createLineLink: function (path, obj, vars, ancestors) {
        var me = this,
            surface = me.drawContainer.getSurface('main'),
            fromTree = me.getFromTree(),
            toTree = me.getToTree(),
            toRecord = me.getRecordFromPath(toTree, path),
            fromFields, fromRecord;

        if (!toRecord)
            return;

        Ext.each(obj.params, function (fromfield) {
            fromfield = YZSoft.src.ast.JSM.JsonMappingReader.resolveParams(fromfield, vars);
            fromRecord = me.getRecordFromPath(fromTree, fromfield);

            if (fromRecord) {
                surface.add(Ext.create('YZSoft.src.jmap.link.Link', {
                    fromTree: fromTree,
                    fromRecord: fromRecord,
                    toTree: toTree,
                    toRecord: toRecord
                }));
            }
        });
    },

    highlightLinks: function (sprites) {
        var me = this;

        Ext.each(sprites, function (sprite) {
            sprite.getFromRecord().addCls(me.fromRecordHighlightCls);

            if (sprite.isLink) {
                sprite.setAttributes({
                    strokeStyle: '#00a2df'
                });

                //sprite.sprites.startArrow.setAttributes({
                //    strokeStyle: '#333'
                //});

                //sprite.sprites.endArrow.setAttributes({
                //    strokeStyle: '#333'
                //});
            }

            if (sprite.isRangeLink) {
                sprite.setAttributes({
                    fillOpacity: 0.2
                });
            }
        });

        me.drawContainer.renderFrame();
    },

    unhighlightLinks: function (sprites) {
        var me = this;

        Ext.each(sprites, function (sprite) {
            sprite.getFromRecord().removeCls(me.fromRecordHighlightCls);

            if (sprite.isLink) {
                sprite.setAttributes({
                    strokeStyle: '#d7dde1'
                });

                //sprite.sprites.startArrow.setAttributes({
                //    strokeStyle: '#00a2df'
                //});

                //sprite.sprites.endArrow.setAttributes({
                //    strokeStyle: '#00a2df'
                //});
            }

            if (sprite.isRangeLink) {
                sprite.setAttributes({
                    fillOpacity: 0.1
                });
            }
        });

        me.drawContainer.renderFrame();
    }
});