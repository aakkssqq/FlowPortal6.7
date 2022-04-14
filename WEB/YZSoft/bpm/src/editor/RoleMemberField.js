/*
getRootOUsType
srcoupath
*/
Ext.define('YZSoft.bpm.src.editor.RoleMemberField', {
    extend: 'YZSoft.bpm.src.editor.UsersField',
    requires: ['YZSoft.bpm.src.model.Member'],
    storeConfig: {
        model: 'YZSoft.bpm.src.model.Member'
    },
    gridConfig: {
        selModel: { mode: 'MULTI' },
        columns: {
            defaults: {
                sortable: false,
                renderer: YZSoft.Render.renderString
            },
            items: [
                { text: RS.$('All_UserDisplayName'), dataIndex: 'UserDisplayName', width: 100 },
                { text: RS.$('All_BelongOU'), dataIndex: 'FullName', flex: 1 },
                { text: RS.$('All_Account'), dataIndex: 'UserAccount', width: 100 }
            ]
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        config.addBtnConfig = {
            handler: function () {
                Ext.create('YZSoft.bpm.src.dialogs.SelMembersDlg', {
                    autoShow: true,
                    getRootOUsType: config.getRootOUsType,
                    srcoupath: config.srcoupath,
                    recentlyPanelConfig: {
                        hidden: true
                    },
                    fn: function (users) {
                        me.addbtnHandler(users);
                    }
                });
            }
        };

        me.callParent(arguments);
    },

    addbtnHandler: function (users) {
        var members = [];
        Ext.each(users, function (user) {
            members.push(user.Member);
        });

        this.grid.addRecords(members);
    },

    getValue: function () {
        var rv = [];

        this.store.each(function (rec) {
            rv.push(rec.data.FullName);
        });

        return rv;
    }
});