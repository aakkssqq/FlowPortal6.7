//not used
Ext.define('YZSoft.bpm.src.editor.CCField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.Participant'],
    layout: 'fit',
    border: false,
    beforeLabelTextTpl: [
        '<a class="yz-fieldlabel-clickable" href="#">',
    ],
    afterLabelTextTpl: [
        '</a>',
    ],
    addable: true,

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Participant',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            hideHeaders: true,
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
                    { text: RS.$('All_Participant'), dataIndex: 'RuntimeDisplayString', flex: 1, renderer: YZSoft.Render.renderString },
                    { xtype: 'actioncolumn', text: RS.$('All_Operation'), width: 60, align: 'center', items: [{
                        icon: YZSoft.$url('YZSoft/theme/core/ui/action/delete.png'),
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            me.store.remove(record);
                        }
                    }, {
                        icon: YZSoft.$url('YZSoft/theme/core/ui/action/moveup.png'),
                        isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                            return rowIndex == 0;
                        },
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            me.grid.moveUp(record);
                        }
                    }, {
                        icon: YZSoft.$url('YZSoft/theme/core/ui/action/movedown.png'),
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

        var cfg = {
            items: [{
                xtype: 'panel',
                border: false,
                layout: 'fit',
                scrollable: true,
                items: [
                    me.grid
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    afterRender: function () {
        var me = this;

        if (me.addable) {
            me.labelEl.on('click', function () {
                me.onBrowser();
            });
        }

        me.callParent(arguments);
    },

    onBrowser: function () {
        var me = this;

        if (this.fireEvent('browserClick', this.getValue(), this) !== false) {
            Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
                autoShow: true,
                title: RS.$('All_SelectParticipant'),
                fn: function (recp) {
                    me.addRecords(recp);
                }
            });
        }
    },

    addRecords: function (datas) {
        var me = this;

        if (!datas)
            return;

        if (!Ext.isArray(datas))
            datas = [datas];

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Participant.ashx'),
            params: { method: 'CheckParticipant' },
            jsonData: datas,
            success: function (action) {
                var recps = action.result,
                    datas = [];

                Ext.each(recps, function (recp) {
                    if (recp.IsValid)
                        datas.push(recp);
                });

                me.grid.addRecords(datas);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
            }
        });
    },

    setValue: function (value) {
        this.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            rv.push(rec.data);
        });
        return rv;
    }
});