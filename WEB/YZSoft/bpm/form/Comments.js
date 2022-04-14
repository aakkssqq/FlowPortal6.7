
/*
post true/false
*/

Ext.define('YZSoft.bpm.form.Comments', {
    extend: 'Ext.panel.Panel',
    layout: 'anchor',
    border: false,
    padding: '3 10 8 10',
    bodyStyle: 'background-color:transparent',

    constructor: function (config) {
        var me = this,
            post = config.post === true;

        me.labComments = Ext.create('Ext.form.Label', {
            text: post ? RS.$('All_PostComments') : RS.$('All_SignComments')
        });

        me.btnInviteIndicate = Ext.create('Ext.button.Button', {
            text: RS.$('All_EnableInviteIndicate'),
            disabled: true,
            enableToggle: true,
            margin: 0,
            padding: '1 10 2 10',
            listeners: {
                toggle: function (btn, pressed) {
                    me.lstInviteIndicateUsers.setVisible(pressed);
                }
            }
        });

        me.btnConsign = Ext.create('Ext.button.Button', {
            text: RS.$('All_EnableConsign'),
            disabled: true,
            enableToggle: true,
            margin: '0 0 0 6',
            padding: '1 10 2 10',
            listeners: {
                toggle: function (btn, pressed) {
                    me.cntConsign.setVisible(pressed);
                }
            }
        });

        me.edtComments = Ext.create('Ext.form.field.TextArea', {
            height: 48,
            margin: 0
        });

        me.lstInviteIndicateUsers = Ext.create('YZSoft.src.form.field.Users', {
            hidden: !me.btnInviteIndicate.pressed,
            fieldLabel: RS.$('All_Title_InviteIndicateUsers'),
            labelAlign: 'top',
            margin: 0
        });

        me.lstConsignUsers = Ext.create('YZSoft.src.form.field.Users', {
            fieldLabel: RS.$('All_Title_ConsignUsers'),
            labelAlign: 'top',
            margin: 0
        });

        me.chkConsignRoutingType = Ext.create('Ext.button.Segmented', {
            margin: '0 30 0 10',
            defaults: {
                padding: '1 10 2 10'
            },
            items: [{
                text: RS.$('All_ConsignRoutingType_Parallel'),
                value: 'Parallel',
                pressed: true
            }, {
                text: RS.$('All_ConsignRoutingType_Serial'),
                value: 'Serial'
            }]
        });

        me.chkConsignReturnType = Ext.create('Ext.button.Segmented', {
            margin: '0 0 0 10',
            defaults: {
                padding: '1 10 2 10'
            },
            items: [{
                text: RS.$('All_ConsignReturnType_Return'),
                value: 'Return',
                pressed: true
            }, {
                text: RS.$('All_ConsignReturnType_Forward'),
                value: 'Forward'
            }]
        });

        me.cntConsign = Ext.create('Ext.container.Container', {
            layout: 'anchor',
            hidden: !me.btnConsign.pressed,
            defaults: {
                anchor: '100%'
            },
            items: [
                me.lstConsignUsers, {
                    xtype: 'container',
                    margin: '5 0 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [{
                        xtype: 'label',
                        text: RS.$('All_ConsignRoutingType')
                    },
                    me.chkConsignRoutingType, {
                        xtype: 'label',
                        text: RS.$('All_ConsignReturnType')
                    },
                    me.chkConsignReturnType
                    ]
                }
            ]
        });

        me.labFreeSign = Ext.create('Ext.form.Label', {
            text: RS.$('All_DeclareParticipent'),
            padding: '0 0 4 0'
        });

        me.cntSignItems = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            flex: 1,
            items: []
        });

        me.cntFreeSign = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            padding: '3 0 2 0',
            hidden: true,
            items: [
                me.labFreeSign,
                me.cntSignItems
            ]
        });

        var cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [me.cntFreeSign, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                padding: '0 0 3 0',
                items: [
                    me.labComments,
                    { xtype: 'tbfill' },
                    me.btnInviteIndicate,
                    me.btnConsign
                ]
            },
            me.edtComments,
            me.lstInviteIndicateUsers,
            me.cntConsign
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            show: function () {
                Ext.defer(function () {
                    me.edtComments.focus();
                }, 100);
            }
        });
    },

    setParticipantDeclares: function (declares, routing) {
        var me = this,
            items = me.declareItems = [];

        declares = declares || [];
        routing = routing || {};
        me.cntFreeSign.setVisible(declares.length != 0);

        Ext.each(declares, function (declare) {
            var item = {};

            item.declare = declare;

            item.chkRoutingType = Ext.create('Ext.button.Segmented', {
                disabled: !declare.MultiRecipient || declare.RoutingType != 'None',
                defaults: {
                    padding: '1 10 2 10'
                },
                items: [{
                    text: RS.$('All_ConsignRoutingType_Serial'),
                    value: 'Serial'
                }, {
                    text: RS.$('All_ConsignRoutingType_Parallel'),
                    value: 'Parallel'
                }]
            });

            var emptyText = Ext.String.format(RS.$('All_RoutingDeclareEmptyText'), declare.TargetStepName);
            item.lstSelUser = Ext.create('YZSoft.src.form.field.Users', {
                flex: 1,
                singleSelection: !declare.MultiRecipient,
                margin: '0 0 0 3',
                emptyText: emptyText
            });

            item.cnt = Ext.create('Ext.container.Container', {
                padding: '0 0 3 0',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [
                    item.chkRoutingType,
                    item.lstSelUser
                ]
            });

            items.push(item);
            me.cntSignItems.add(item.cnt);

            item.chkRoutingType.setValue('Serial');
            var routingItem = routing[declare.TargetStepName];
            if (routingItem) {
                if (routingItem.RoutingType)
                    item.chkRoutingType.setValue(routingItem.RoutingType);
                item.lstSelUser.setValue(routingItem.Uids);
            }

            if (declare.RoutingType != 'None')
                item.chkRoutingType.setValue(declare.RoutingType);
        });
    },

    getValue: function () {
        var me = this,
            inviteIndicateEnabled = me.btnInviteIndicate.pressed,
            consignEnabled = me.btnConsign.pressed,
            declareItems = me.declareItems || [],
            Routing = {};

        Ext.each(declareItems, function (item) {
            Routing[item.declare.TargetStepName] = {
                RoutingType: item.chkRoutingType.getValue(),
                Uids: me.getUidList(item.lstSelUser.getValue())
            };
        });

        return {
            Comments: Ext.String.trim(me.edtComments.getValue() || ''),
            ConsignEnabled: consignEnabled,
            ConsignUsers: consignEnabled ? me.getUidList(me.lstConsignUsers.getValue()) : [],
            ConsignRoutingType: me.chkConsignRoutingType.getValue(),
            ConsignReturnType: me.chkConsignReturnType.getValue(),
            InviteIndicateUsers: inviteIndicateEnabled ? me.getUidList(me.lstInviteIndicateUsers.getValue()) : [],
            Routing: Routing
        };
    },

    check: function () {
        var me = this,
            declareItems = me.declareItems || [],
            err;

        Ext.each(declareItems, function (item) {
            var uids = me.getUidList(item.lstSelUser.getValue());
            if (!item.declare.JumpIfNoParticipants && uids.length == 0) {
                err = Ext.String.format(RS.$('All_Post_MissFreeRoutingDeclare'), item.declare.TargetStepName);
                return false;
            }
        });

        return err;
    },

    getUidList: function (users) {
        var rv = [];

        users = Ext.isArray(users) ? users : [users];
        Ext.each(users, function (user) {
            rv.push(user.Account);
        });

        return rv;
    }
});