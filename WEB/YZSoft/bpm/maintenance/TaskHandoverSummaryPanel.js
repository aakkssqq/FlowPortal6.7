
Ext.define('YZSoft.bpm.maintenance.TaskHandoverSummaryPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.bpm.src.ux.FormManager',
        'YZSoft.bpm.src.model.Task',
        'YZSoft.bpm.src.model.Worklist',
        'YZSoft.bpm.src.ux.Render'
    ],
    bodyStyle: 'background-color:#efefef',

    constructor: function (config) {
        var me = this,
            user = me.user = userInfo,
            cfg;

        me.tabBar = bar = Ext.create('Ext.tab.Bar', {
            cls:'yz-tab-bar-arrow'
        });

        me.headshot = Ext.create('YZSoft.src.component.Headshort', {
            margin: '0 0 0 0',
            width: 60,
            height: 60,
            margin: '10 10 10 15',
            style: 'border-radius:40px',
            uid: userInfo.Account
        });

        me.cmpUserName = Ext.create('Ext.Component', {
            style: 'font-size:18px;color#000;color:#606060;',
            html: Ext.String.format(RS.$('Ment_Title'), user.DisplayName || user.Account)
        });

        me.btnSelUser = Ext.create('Ext.button.Button', {
            cls:'yz-btn-round3 yz-btn-submit',
            text: RS.$('All_SelUser'),
            margin: '0 0 0 10',
            padding:'4 6',
            handler: function () {
                YZSoft.SelUserDlg.show({
                    fn: function (user) {
                        me.user = user;

                        me.headshot.setUid(user.Account);
                        me.cmpUserName.update(Ext.String.format(RS.$('Ment_Title'), user.DisplayName || user.Account));
                        me.pnlWorklist.setUid(user.Account);
                        me.pnlShareTask.setUid(user.Account);
                        me.pnlMyRequests.setUid(user.Account);

                        me.tab.setActiveTab(0);
                    }
                });
            }
        });

        me.titlebar = Ext.create('Ext.container.Container', {
            region: 'north',
            layout: {
                type: 'hbox',
                align: 'end',
                pack:'start'
            },
            items: [me.headshot, {
                xtype: 'container',
                layout: 'vbox',
                items: [{
                    xtype: 'container',
                    margin:'0 0 3 10',
                    layout: {
                        type: 'hbox',
                        align:'middle'
                    },
                    items: [me.cmpUserName, me.btnSelUser]
                }, me.tabBar]
            }]
        });

        me.pnlWorklist = Ext.create('YZSoft.bpm.maintenance.HandoverWorklistPanel', {
            uid: userInfo.Account,
            closable:false
        });

        me.pnlShareTask = Ext.create('YZSoft.bpm.maintenance.HandoverShareTaskPanel', {
            uid: userInfo.Account,
            closable: false
        });

        me.pnlMyRequests = Ext.create('YZSoft.bpm.maintenance.HandoverRequestsPanel', {
            uid: userInfo.Account,
            closable: false
        });

        me.tab = Ext.create('YZSoft.frame.tab.Base', {
            region: 'center',
            cls: ['yz-s-module-tab'],
            activeTab: me.activeTab || 0, //from 0
            tabBar: me.tabBar,
            items: [
                me.pnlWorklist,
                me.pnlShareTask,
                me.pnlMyRequests
            ]
        });

        cfg = {
            layout: 'border',
            items: [me.titlebar, me.tab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.tab.relayEvents(me, ['activate']);
    },

    onActivate: function (times) {
        if (times == 0) {
            this.pnlShareTask.fireEvent('activate');
            this.pnlMyRequests.fireEvent('activate');
        }
    }
});
