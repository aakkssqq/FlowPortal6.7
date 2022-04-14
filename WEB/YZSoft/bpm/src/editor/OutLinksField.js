/*
config
*/

Ext.define('YZSoft.bpm.src.editor.OutLinksField', {
    extend: 'YZSoft.src.form.FieldContainer',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['text', 'tag'],
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            cls:'yz-grid-gray',
            border: true,
            flex: 1,
            trackMouseOver: false,
            disableSelection: true,
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('Process_LinkAndButtonName'), dataIndex: 'text', flex: 1, renderer: YZSoft.Render.renderString }, {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Operation'),
                        width: 100,
                        align: 'center',
                        items: [{
                            glyph: 0xea4f,
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return rowIndex == 0;
                            },
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.grid.moveUp(record);
                            }
                        }, {
                            glyph: 0xe601,
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return rowIndex >= view.getStore().getCount() - 1;
                            },
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.grid.moveDown(record);
                            }
                        }]
                    }
                ]
            }
        });

        cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bodyStyle: 'background-color:transparent',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderOpt: function () {
        return Ext.String.format('<a href="#">{0}</a>&nbsp;|&nbsp;<a href="#">{1}</a>', RS.$('All_MoveUp'), RS.$('All_MoveDown'));
    },

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            rv.push(rec.data);
        });
        return rv;
    }
});