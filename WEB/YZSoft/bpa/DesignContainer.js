Ext.define('YZSoft.bpa.DesignContainer', {
    extend: 'YZSoft.bpm.src.flowchart.DesignContainer',

    newProcess: function (data) {
        var me = this,
            data = data || {};

        me.process = {
            Property: Ext.apply({}, data.Property)
        };

        me.deselectAll();
        me.removeAll(true);
        me.fireEvent('processLoading');
        me.renderFrame();
        me.fireEvent('processLoaded', me.process);
    },

    onContextMenu: function (e) {
        var me = this,
            menu;

        menu = [{
            iconCls: 'yz-glyph yz-glyph-copy',
            text: RS.$('All_Copy'),
            disabled: !me.canCopy(),
            handler: function () {
                me.copy();
            }
        }, {
            iconCls: 'yz-glyph yz-glyph-e60c',
            text: RS.$('All_Paste'),
            disabled: !me.canPaste(),
            handler: function () {
                me.paste();
            }
        }, '-', {
            iconCls: 'yz-glyph yz-glyph-e628',
            text: RS.$('All_ProcessProperty'),
            handler: function () {
                cfg = Ext.create('YZSoft.bpa.sprite.ProcessDialog', {
                    autoShow: true,
                    title: RS.$('All_ProcessProperty'),
                    data: me.process,
                    drawContainer: me,
                    fn: function (data) {
                        me.fireEvent('beforePropertyChange', me.process);
                        me.process.Property = Ext.apply(me.process.Property || {}, data.Property);
                        delete data.Property;
                        Ext.apply(me.process, data);
                        me.fireEvent('propertyChanged', me.process);
                    }
                });
            }
        }, {
            iconCls: 'yz-glyph yz-glyph-e624',
            text: RS.$('All_SelectAll'),
            handler: function () {
                me.selectAll();
            }
        }];

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: menu
        });
        menu.showAt(e.getXY());
        menu.focus();
    },

    onSelectionContextMenu: function (sprites, e) {
        var me = this,
            menu;

        menu = [{
            iconCls: 'yz-glyph yz-glyph-copy',
            text: RS.$('All_Copy'),
            disabled: !me.canCopy(),
            handler: function () {
                me.copy();
            }
        }, {
            iconCls: 'yz-glyph yz-glyph-e60c',
            text: RS.$('All_Paste'),
            disabled: !me.canPaste(),
            handler: function () {
                me.paste();
            }
        }, '-', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            disabled: !me.canDelete(),
            handler: function () {
                me.deleteSelection();
            }
        }];

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: menu
        });
        menu.showAt(e.getXY());
        menu.focus();
    },

    onSpriteContextMenu: function (sprite, e) {
        var me = this,
            menu;

        if (!sprite.isLink) {
            menu = [{
                iconCls: 'yz-glyph yz-glyph-copy',
                text: RS.$('All_Copy'),
                disabled: !me.canCopy(),
                handler: function () {
                    me.copy();
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-e60c',
                text: RS.$('All_Paste'),
                disabled: !me.canPaste(),
                handler: function () {
                    me.paste();
                }
            }, '-', {
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('All_Delete'),
                disabled: !me.canDelete(),
                handler: function () {
                    me.deleteSelection();
                }
            }, '-', {
                iconCls: 'yz-glyph yz-glyph-e916',
                text: RS.$('BPA_LinkedFile'),
                handler: function () {
                    me.bindRelatiedFile(sprite);
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-property',
                text: RS.$('All_Property'),
                handler: function () {
                    sprite.fireEvent('propertyMenuClicked');
                }
            }];
        }
        else {
            menu = [{
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('All_Delete'),
                disabled: !me.canDelete(),
                handler: function () {
                    me.deleteSelection();
                }
            }, '-', {
                iconCls: 'yz-glyph yz-glyph-property',
                text: RS.$('All_Property'),
                handler: function () {
                    var linkCfg = sprite.from.sprite.property.link || {};

                    cfg = Ext.create('YZSoft.bpm.src.flowchart.dialogs.Link', {
                        autoShow: true,
                        title: RS.$('All_LinkProperty'),
                        generalPanelConfig: {
                            showConfirmPanel: linkCfg.configConfirm,
                            showConditionPanel: linkCfg.configCondition,
                            showVotePanel: linkCfg.configVote
                        },
                        data: sprite.data,
                        fn: function (data) {
                            me.fireEvent('beforeLinkPropertyChange', data.DisplayString, sprite);
                            Ext.apply(sprite.data, data);
                            sprite.setText(data.DisplayString);
                            me.fireEvent('linkPropertyChanged', data.DisplayString, sprite);
                        }
                    });
                }
            }];
        }

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: menu
        });
        menu.showAt(e.getXY());
        menu.focus();
    },

    bindRelatiedFile: function (sprite) {
        var me = this,
            groupInfo = me.groupInfo,
            groupid = groupInfo && groupInfo.Group.GroupID;

        Ext.create('YZSoft.bpa.src.dialogs.SelFileDlg', {
            autoShow: true,
            title: RS.$('All_BPM_Title_SelectBPAFile'),
            folderType: 'BPAProcess',
            groupid: groupid,
            clearButton: sprite.relatiedFile ? {
                text:RS.$('BPA_ClearLinkedFile')
            }:false,
            fn: function (file) {
                sprite.setRelatiedFile(file.FileID, file.Name);
                sprite.getSurface().renderFrame();
            }
        });
    },

    getNodeFromSprite: function (sprite) {
        var me = this,
            node = {};

        //sprite
        node.Id = sprite.getSpriteId();
        node.Name = sprite.getSpriteName();
        node.relatiedFile = sprite.relatiedFile;
        node.FolderID = sprite.folderid;
        node.xclass = Ext.getClassName(sprite);
        node.surface = sprite.getSurface().type;
        node.Assisit = sprite.assisit === true;

        if (Ext.getClassName(sprite.property) != (sprite.propertyConfig && sprite.propertyConfig.xclass))
            node.propertyXClass = Ext.getClassName(sprite.property);

        node.sprite = sprite.archive();

        //property
        node.property = Ext.apply({}, sprite.property.data);
        Ext.apply(node.property, sprite.property.staticData);

        delete node.property.Id;
        delete node.property.Name;

        //保存个性化数据
        if (sprite.onSaveNode) {
            sprite.onSaveNode(node);
        }

        return node;
    },

    getLinkFromSprite: function (sprite) {
        var me = this,
            link = {};

        //basic
        Ext.apply(link, {
            xclass: Ext.getClassName(sprite),
            surface: sprite.getSurface().type,
            FromNodeId: sprite.from.sprite.getSpriteId(),
            FromPoint: sprite.from.name,
            ToNodeId: sprite.to.sprite.getSpriteId(),
            ToPoint: sprite.to.name
        });

        //sprite
        link.sprite = sprite.archive();

        //property
        link.property = Ext.apply({}, sprite.data);
        Ext.apply(link.property, sprite.staticData);

        //去除多余属性
        delete link.property.LineType;

        return link;
    },

    getSpriteFromNode: function (node) {
        var me = this,
            cfg;

        //老版本存的是YZSoft.BPA.
        if (Ext.String.startsWith(node.xclass, 'YZSoft.BPA.', 0, false))
            node.xclass = 'YZSoft.bpa.' + node.xclass.substr(11);

        if (Ext.String.startsWith(node.propertyXClass, 'YZSoft.BPA.', 0, false))
            node.propertyXClass = 'YZSoft.bpa.' + node.propertyXClass.substr(11);

        cfg = Ext.apply({
            relatiedFile: node.relatiedFile,
            relatiedFileName: node.relatiedFileName,
            folderid: node.FolderID,
            surfaceName: node.surface,
            node: node,
            drawContainer: me,
            sprites: {},
            docked: node.docked
        }, node.sprite);

        cfg.property = {
            xclass: node.propertyXClass,
            data: Ext.apply({}, node.property)
        };

        Ext.apply(cfg.property.data, {
            Id: node.Id,
            Name: node.Name
        });

        return Ext.create(node.xclass, cfg);
    },

    getSpriteFromLink: function (spritesById, link) {
        var me = this,
            fromSprite = spritesById[link.FromNodeId],
            fromPoint = fromSprite.hotpointsMap[link.FromPoint],
            toSprite = spritesById[link.ToNodeId],
            toPoint = toSprite.hotpointsMap[link.ToPoint],
            cfg;

        cfg = Ext.apply({
            surfaceName: link.surface,
            from: fromPoint,
            to: toPoint,
            points: link.sprite.points
        }, link.sprite);

        link.data = Ext.apply({}, link.property);

        return Ext.create(link.xclass, cfg);
    },

    //从原生数据获取id
    getNodeId: function (node) {
        return node.Id;
    },

    //设置节点原生数据的id
    setNodeId: function (node, id) {
        node.Id = id;
    },

    getSurface: function (name, type) {
        if (name == 'link')
            name = 'shape';

        return this.callParent([name, type]);
    }
});