
Ext.define('YZSoft.system.server.MessageTemplatesSettingPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlMessage = Ext.create('YZSoft.bpm.propertypages.MessageGroups', {
            border: false,
            header: false,
            cls: 'yz-border-t',
            tables: [],
            caption: {
                hidden: true
            },
            gridConfig: {
                border: false
            },
            messageCats: [
                'NewTaskNormal',
                'IndicateTask',
                'InformTask',
                'RecedeBack',
                'TimeoutNotify',
                'Approved',
                'Rejected',
                'Aborted',
                'Deleted',
                'StepStopHumanOpt',
                'StepStopVoteFinished',
                'ManualRemind',
                'NoParticipantException'
            ],
            inheriable: false
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Edit'),
            sm: me.pnlMessage.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.pnlMessage.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.pnlMessage.grid.getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.pnlMessage.edit(recs[0]);
                }
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.pnlMessage.load({
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me,
                        start: 0
                    }
                });
            }
        });

        cfg = {
            tbar: {
                cls: 'yz-tbar-module',
                items: [me.btnEdit, '->', me.btnRefresh]
            },
            items: [me.pnlMessage]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.pnlMessage.load({
                waitMsg: {
                    msg: RS.$('All_Loading'),
                    target: this
                }
            });
        else
            this.pnlMessage.load();
    }
});
