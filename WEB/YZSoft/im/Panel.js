
Ext.define('YZSoft.im.Panel', {
    extend: 'Ext.container.Container',
    cls: 'yz-font-yahei',

    constructor: function (config) {
        var me = this,
            cfg,
            menuItems = [];

        me.cmpHeadshort = Ext.create('YZSoft.im.src.Headshort', {
            margin:'15 0 20 0'
        });

        me.btnChat = Ext.create('Ext.button.Button', {
            ui: 'toolbar',
            cls: 'yz-im-btn-mainmenu',
            toggleGroup: 'menu',
            allowDepress: false,
            iconCls: 'yz-im-icon-chat',
            module: {
                id: 'IM_Social',
                xclass:'YZSoft.im.social.Panel'
            },
            listeners: {
                scope: me,
                toggle: 'onToggle',
                clickOnPressedState: 'onClickOnPressedState'
            }
        });

        me.btnContact = Ext.create('Ext.button.Button', {
            ui: 'toolbar',
            cls: 'yz-im-btn-mainmenu',
            toggleGroup: 'menu',
            allowDepress: false,
            iconCls: 'yz-im-icon-contact',
            module: {
                id: 'IM_Contact',
                xclass: 'YZSoft.im.contact.Panel'
            },
            listeners: {
                scope: me,
                toggle: 'onToggle',
                clickOnPressedState: 'onClickOnPressedState'
            }
        });

        me.pnlMenu = Ext.create('Ext.container.Container', {
            region: 'west',
            width: 86,
            cls: 'yz-im-navigater',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'start'
            },
            defaults: {
            },
            items: [
                me.cmpHeadshort,
                me.btnChat,
                me.btnContact
            ]
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlMenu, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('yz-im-container');

        me.btnChat.toggle(true, false);
        //me.btnContact.toggle(true, false);
    },

    onToggle: function (btn, pressed, eOpts) {
        var me = this;

        if (pressed)
            me.showModule(btn);
    },

    onClickOnPressedState: function (btn) {
        var me = this,
            pnlModule = btn.pnlModule;

        if (pnlModule) {
            me.pnlModule.setActiveModule(pnlModule);
            pnlModule.fireEvent('clickMainMenuOnPressedState', btn);
        }
    },

    showModule: function (btn) {
        var me = this,
            cfg = btn.module;

        Ext.apply(cfg, {
            button: btn
        });

        btn.pnlModule = me.pnlModule.showModule({
            xclass: cfg.xclass,
            config: cfg,
            match: function (item) {
                return item.button === btn;
            }
        });
    }
});