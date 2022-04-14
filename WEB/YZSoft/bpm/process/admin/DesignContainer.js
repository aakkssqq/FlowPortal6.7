Ext.define('YZSoft.bpm.process.admin.DesignContainer', {
    extend: 'YZSoft.bpm.src.flowchart.DesignContainer',

    newProcess: function (data) {
        var me = this,
            data = data || {};

        me.process = {
            Active: true,
            Property: Ext.apply({
                TaskDescTemplate: '',
                SNTableName: 'BPMInstTasks',
                SNColumnName: 'SerialNum',
                SNPrefix: 'REQ<%=DateTime.Today.ToString("yyyyMM")%>',
                SNColumns: 4,
                SNFrom: 1,
                SNIncrement: 1,
                SNDesc: 'REQyyyyMM{0001}',
                FormDataRelationshipType: 'TaskID',
                OrderIndex: 2,
                Color: '#76dbb4',
                MobileInitiation: true,
                DotNetEnv: {
                    ReferencedAssemblies: [
                        'System.dll',
                        'System.Transactions.dll',
                        "System.Data.dll",
                        'BPM.dll',
                        'BPM.Server.dll'
                    ],
                    Using: [
                        'using System;',
                        'using System.IO;',
                        'using System.Text;',
                        'using System.Transactions;',
                        'using System.Data;',
                        'using BPM;',
                        'using BPM.Server;',
                        'using BPM.Server.OAL;'
                    ]
                }
            }, data.Property),
            MessageGroups: [],
            Events: [],
            GlobalTableIdentitys: []
        };

        me.deselectAll();
        me.removeAll(true);
        me.fireEvent('processLoading');
        me.renderFrame();
        me.fireEvent('processLoaded', me.process);
    },

    getMessageGroups: function (callback) {
        callback(this.process.MessageGroups);
    },

    getParentMessageContainer: function () {
        return YZSoft.bpm.src.ux.Server
    },

    sortLinks: function (sprites) {
        var rv1 = [],
            rv2 = [];

        Ext.each(sprites, function (sprite) {
            if ('orderIndex' in sprite)
                rv1.push(sprite);
            else
                rv2.push(sprite);
        });

        Ext.Array.sort(rv1, function (a, b) {
            return a.orderIndex - b.orderIndex;
        });

        return Ext.Array.push(rv1, rv2);
    },

    getAllHumanStepNames: function (sprite) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (spriteTmp.isShape && spriteTmp !== sprite && spriteTmp.property.getHumanStepNames) {
                    var names = spriteTmp.property.getHumanStepNames(),
                        names = Ext.isArray(names) ? names : [names];

                    Ext.each(names, function (name) {
                        if (!Ext.Array.contains(rv, name))
                            rv.push(name);
                    });
                }
            }
        }

        return rv;
    },

    getAllInterfaceStepNames: function (sprite) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (spriteTmp.isShape && spriteTmp !== sprite && spriteTmp.property.isInterface)
                    rv.push(spriteTmp.getSpriteName());
            }
        }

        return rv;
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
                Ext.create('YZSoft.bpm.src.flowchart.dialogs.Process', {
                    autoShow: true,
                    title: RS.$('All_ProcessProperty'),
                    tables: me.process.GlobalTableIdentitys,
                    data: me.process,
                    fn: function (data) {
                        me.fireEvent('beforePropertyChange', me.process);
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
                    var linkCfg = (sprite.from.sprite.property.getLinkCfg ? sprite.from.sprite.property.getLinkCfg() : sprite.from.sprite.property.link) || {};

                    Ext.create('YZSoft.bpm.src.flowchart.dialogs.Link', {
                        autoShow: true,
                        title: RS.$('All_LinkProperty'),
                        generalPanelConfig: {
                            showConfirmPanel: linkCfg.configConfirm,
                            showConditionPanel: linkCfg.configCondition,
                            showDefaultRoutePanel: linkCfg.configDefaultLink,
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

    onSpriteDblClick: function (sprite) {
        sprite.fireEvent('propertyMenuClicked');
    },

    getAllRecedeBackGroup: function (sprite) {
        var me = this,
            surfaces = me.getItems(),
            rv = [];

        for (i = 0, it = surfaces.length; i < it; i++) {
            var surface = surfaces.get(i),
                sprites = surface.getItems();

            for (j = 0, jt = sprites.length; j < jt; j++) {
                var spriteTmp = sprites[j];

                if (spriteTmp.isShape && spriteTmp.property && spriteTmp.property.data) {
                    var groupName = spriteTmp.property.data.RecedeBackGroup;

                    if (groupName && spriteTmp !== sprite && !Ext.Array.contains(rv, groupName))
                        rv.push(spriteTmp.property.data.RecedeBackGroup);
                }
            }
        }

        return rv;
    }
});