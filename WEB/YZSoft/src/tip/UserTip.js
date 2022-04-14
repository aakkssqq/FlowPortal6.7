
Ext.define('YZSoft.src.tip.UserTip', {
    extend: 'Ext.tip.ToolTip',
    cls: 'yz-tip-userinfo',
    preventHideWhenMouseOnTip: true,
    layout: {
        type: 'hbox',
        align:'stretch'
    },
    bodyPadding: '10 20 20 20',
    width: 460,
    height:220,
    viewModel: {
        data: {
            Account: '',
            ShortName: '',
            OfficePhone: '',
            Mobile: '',
            EMail: '',
            oufullName:'',
            LeaderTitle:''
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'middle'
                },
                items: [{
                    xclass: 'YZSoft.src.component.Headshort',
                    margin: '10 0 0 0',
                    width: 110,
                    height: 110,
                    style: 'border: 4px solid #ddd;border-radius:60px',
                    bind: {
                        uid: '{Account}'
                    }
                }, { xtype: 'component', flex: 1 },{
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        xtype: 'button',
                        overCls:'',
                        margin: '0 5 0 5'
                    },
                    margin: '15 5 0 5',
                    items: [{
                        cls: 'yz-btn-facebook',
                        disabled: true,
                        iconCls: 'x-fa fa-facebook'
                    }, {
                        cls: 'yz-btn-twitter',
                        disabled: true,
                        iconCls: 'x-fa fa-twitter'
                    }, {
                        cls: 'yz-btn-email',
                        iconCls: 'x-fa fa-envelope'
                    }, {
                        cls: 'yz-btn-google',
                        iconCls: 'x-fa fa-commenting'
                    }]
                }]
            }, {
                xtype: 'container',
                flex:1,
                padding:'0 0 0 30',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'container',
                    margin: '10 0 0 0',
                    layout: {
                        type: 'hbox',
                        align:'middle'
                    },
                    items: [{
                        xtype: 'component',
                        cls: 'dspname',
                        bind: '{ShortName:text}'
                    }, { xtype: 'component', flex: 1 },{
                        xtype: 'button',
                        ui: 'link',
                        margin: '5 0 0 0',
                        hidden: false,
                        text: RS.$('All_ToDetail'),
                        handler: function () {
                            me.hide();

                            Ext.require('YZSoft.src.dialogs.docked.Employee', function () {
                                YZSoft.src.dialogs.docked.Employee.show(me.uid);
                            });
                        }
                    }]
                }, {
                    xtype: 'component',
                    cls: 'ou',
                    margin: '6 0 3 0',
                    bind: '{oufullName:text}'
                },{
                    xtype: 'component',
                    cls: 'leadertitle',
                    margin: '0 0 3 0',
                    bind: '{LeaderTitle:text}'
                }, { xtype: 'component',flex: 1 }, {
                    xtype: 'component',
                    cls: 'box yz-glyph yz-glyph-eaad',
                    margin:'0 0 12 0',
                    bind: '{Mobile:text}'
                }, {
                    xtype: 'component',
                    cls: 'box yz-glyph yz-glyph-eaae',
                    margin: '0 0 12 0',
                    bind: '{OfficePhone:text}'
                }, {
                    xtype: 'component',
                    cls: 'box yz-glyph yz-glyph-eaaf',
                    margin: '0 0 3 0',
                    bind: '{EMail:text}'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);
        me.on({
            scope:me,
            beforeshow:'onBefroeShow'
        });
    },

    onBefroeShow: function (tip) {
        var me = this,
            el = tip.triggerElement,
            uid = el.getAttribute('uid'),
            align = el.getAttribute('tip-align') || 'r50-l50',
            html;

        if (String.Equ(uid, 'sa'))
            return false;

        me.defaultAlign = align;
        if (me.isVisible())
            me.realignToTarget();

        if (me.uid == uid)
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Employee.ashx'),
            params: {
                method: 'GetTipInfo',
                account: uid
            },
            success: function (action) {
                var userInfo = action.result.user,
                    position = action.result.position;

                me.uid = uid;

                if (position)
                    position.LeaderTitle = position.LeaderTitle || RS.$('All_Employee');

                me.getViewModel().set(Ext.apply({
                }, position, userInfo));
            }
        });
    }
}, function () {
    YZSoft.usertip = new this({
        target: Ext.getBody(),
        delegate: '.yz-s-uid',
        defaultAlign: 'r50-l50',
        anchor: true
    });
});