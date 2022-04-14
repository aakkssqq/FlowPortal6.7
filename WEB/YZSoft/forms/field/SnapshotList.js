
Ext.define('YZSoft.forms.field.SnapshotList', {
    extend: 'YZSoft.forms.field.Element',
    requires: [
        'Ext.menu.Item',
        'YZSoft.bpm.src.ux.FormManager'
    ],
    buttonSelector: '.yz-xform-field-snapshotbutton',

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            button: me.down(me.buttonSelector, true)
        };
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp(),
            width: me.getAttributeNumber('popupwndwidth', -1),
            height: me.getAttributeNumber('popupwndheight', -1),
            windowModel: me.getAttribute('WindowModel') || 'Window',
            snapshots: Ext.decode(me.getAttribute('snapshots')) || []
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            button: Ext.get(dom.button)
        });

        ctrls.button.on({
            scope: me,
            click: 'onClick'
        });
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        ctrls.dom.button.disabled = disable;

        if (readForm) {
            me.addCls(disableCssCls);
            return;
        }

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);
    },

    onClick: function (e) {
        var me = this,
            et = me.getEleType();

        e.stopEvent();

        if (et.snapshots.length == 0)
            return;

        var menuItems = [];
        Ext.each(et.snapshots, function (snapshot) {
            var menuItem = Ext.create('Ext.menu.Item', {
                iconCls: 'bdisk',
                text: Ext.String.format(RS.$('All_Snapshot_Version'), snapshot.ver, snapshot.date),
                handler: function (item) {
                    me.openSnapshot(snapshot);
                }
            });

            menuItems.push(menuItem);
        });

        var menu = Ext.create('Ext.menu.Menu', {
            shadow: false,
            minWidth: 80,
            items: menuItems
        });

        menu.showBy(me.dom, 'tr-br?');
        menu.focus();
    },

    openSnapshot: function (snapshot) {
        var me = this,
            et = me.getEleType(),
            config = {};

        if (et.width > 0)
            config.width = et.width;

        if (et.height > 0)
            config.height = et.height;

        YZSoft.bpm.src.ux.FormManager.openSnapshot(snapshot.taskid, snapshot.ver, me.agent.Params.StepID, Ext.apply({
            //sender: (window.frameElement && window.frameElement.containerPanel) ? window.frameElement.containerPanel:null,
            dlgModel: et.windowModel
        }, config));
    }
});