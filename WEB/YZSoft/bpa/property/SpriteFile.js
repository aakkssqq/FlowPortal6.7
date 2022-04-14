/*
config:
drawContainer
folderid
*/
Ext.define('YZSoft.bpa.property.SpriteFile', {
    extend: 'Ext.container.Container',
    title: RS.$('BPA__SpriteDocuments'),
    layout: 'border',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.cmpCaption = Ext.create('Ext.Component', {
            cls:'bpa-caption-spritefile'
        });

        me.menuUpload = Ext.create('YZSoft.src.menu.Item', {
            glyph: 0xe948,
            text: RS.$('All_Upload')
        });

        me.menuReference = Ext.create('YZSoft.src.menu.Item', {
            glyph: 0xe94a,
            text: RS.$('All_Reference'),
            handler: function () {
                me.pnlDocument.addReference('BPADocument');
            }
        });

        me.btnUpload = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddDocument'),
            cls: 'yz-btn-classic-box-hot',
            padding: '5 18',
            menuAlign: 'bc-tc?',
            menu: {
                padding: '2',
                defaults: {
                    padding: '0 0 0 6'
                },
                items:[
                    me.menuUpload,
                    me.menuReference
                ]
            }
        });

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.menuUpload,
            autoStart: false,
            fileSizeLimit: '100 MB',
            fileTypes: '*.*',
            typesDesc: RS.$('All_FileTypeDesc_All')
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            border: false,
            style: 'background-color:transparent;',
            layout: {
                type: 'hbox',
                align: 'center',
                pack:'center'
            },
            items: [
                me.btnUpload
            ]
        });

        me.pnlDocument = Ext.create('YZSoft.src.document.Simple', Ext.apply({
            region: 'center',
            folderid: config.folderid,
            uploader: me.uploader,
            padding: '0 0 0 0',
        }, config.pnlDocumentConfig));

        me.toolPanel = Ext.create('Ext.container.Container', Ext.apply({
            region: 'south',
            padding: '10 0 20 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.toolbar]
        }, config.toolPanelConfig));

        cfg = {
            items: [{
                xtype: 'container',
                region: 'north',
                padding: '30 14 20 7',
                items: [me.cmpCaption]
            }, me.toolPanel, me.pnlDocument]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            updateContext: 'onUpdateContext'
        });

        me.onUpdateContext(config.drawContainer,[])
    },

    setReadOnly: function (readOnly) {
        this.toolPanel.setVisible(!readOnly);
    },

    setParentFolderID: function (folderid) {
        this.parentFolderId = folderid;
    },

    setFolderID: function (folderid, loadOption, clear) {
        this.folderid = folderid;
        this.pnlDocument.setFolderID(folderid, loadOption, clear);
    },

    setSprite: function (spriteName) {
        this.cmpCaption.update(Ext.String.format(RS.$('BPA__SpriteDocuments_Caption'), Ext.util.Format.text(spriteName)));
    },

    isPageValiable: function (selection) {
        if (selection.length == 1 && selection[0].isShape)
            return true;

        return false;
    },

    onUpdateContext: function (drawContainer, selection) {
        if (!(selection.length == 1 && selection[0].isShape))
            return;

        var me = this,
            sprite = selection[0],
            spriteId = sprite.getSpriteId(),
            spriteName = sprite.getSpriteName(),
            parentFolderId = me.parentFolderId,
            folderid = sprite.folderid;

        if (!parentFolderId)
            return;

        if (!folderid) {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                params: {
                    method: 'CreateFolder',
                    folderid: parentFolderId,
                    name: spriteName
                },
                success: function (action) {
                    folderid = sprite.folderid = action.result.folderid;
                    me.setSprite(spriteName);
                    me.setFolderID(folderid, null, true);
                }
            });
        }
        else {
            me.setSprite(spriteName);
            me.setFolderID(folderid, {
                loadMask: false
            });
        }
    }
});