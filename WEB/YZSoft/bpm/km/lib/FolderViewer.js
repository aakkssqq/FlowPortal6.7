
/*
config
    folderid
*/
Ext.define('YZSoft.bpm.km.lib.FolderViewer', {
    extend: 'Ext.container.Container',
    layout: 'border',
    style: 'background-color:white',

    constructor: function (config) {
        var me = this,
            config = config || {},
            folderid = config.folderid,
            cfg;

        me.crumb = Ext.create('YZSoft.src.toolbar.Breadcrumb', Ext.apply({
            showIcons: false,
            showMenuIcons: false
        }, config.crumbConfig));

        me.toolbar = Ext.create('Ext.container.Container', {
            region: 'north',
            margin: '30 20 26 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [me.crumb, { xtype: 'tbfill'}]
        });

        me.viewFolder = Ext.create('YZSoft.bpa.src.view.FileView', {
            region: 'center',
            folderid: folderid,
            dblClickOpenFolder: false,
            checkpermision: false,
            itemdragable:false
        });

        me.viewFolder.on({
            scope: me,
            folderChanged: function (folderid, record) {
                var node = me.crumb.getStore().getNodeById(folderid);
                if (node) {
                    me.crumb.suspendEvent('selectionchange');
                    me.crumb.setSelection(node);
                    me.crumb.resumeEvent('selectionchange');
                }
            },
            itemclick: function (view, record) {
                if (record.data.isFile) {
                    me.openFile(record);
                }
                else {
                    me.viewFolder.showFolder(record.data.FolderID, {
                        loadMask: false
                    });
                }
            },
            selectionchange: 'updateStatus',
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                e.preventDefault();
            },
            containercontextmenu: function (view, e, eOpts) {
                e.preventDefault();
            }
        });

        me.crumb.on({
            order: 'after',
            afterrender: function () {
                me.crumb.renderedFlag = true;
            },
            selectionchange: function (crumb, node, eOpts) {
                if (me.crumb.renderedFlag && me.crumb.storeloaded && node)
                    me.viewFolder.showFolder(node.data.path);
            }
        });

        me.crumb.store.on({
            order: 'after',
            load: function () {
                me.crumb.storeloaded = true;
            }
        });

        cfg = {
            items: [me.toolbar, me.viewFolder]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();

        me.on({
            switchActive: function (config) {
                me.viewFolder.showFolder(config.folderid, {
                    loadMask: {
                        msg: RS.$('All_Loading')
                    }
                });
            }
        });

        me.relayEvents(me.viewFolder, ['folderChanged']);
    },

    afterRender: function () {
        var me = this;

        me.callParent(arguments);

        me.viewFolder.showFolder(me.folderid, {
            loadMask: {
                msg: RS.$('All_Loading')
            }
        });
    },

    openFile: function (record) {
        var me = this;

        YZSoft.ViewManager.addView(me, 'YZSoft.bpm.km.file.bpa.Panel', {
            id: Ext.String.format('File_{0}', YZSoft.util.hex.encode(record.data.FileID)),
            title: Ext.String.format('{0} - {1}', RS.$('All_File'), record.data.Name),
            fileid: record.data.FileID,
            closable: true
        });
    },

    updateStatus: function () {
    }
});