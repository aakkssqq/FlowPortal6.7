
//fileid
Ext.define('YZSoft.bpa.src.form.field.FileSpriteComboBox', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'YZSoft.bpa.src.model.Sprite'
    ],
    editable: false,
    queryMode: 'local',
    forceSelection: false,
    allowBlank: true,
    triggers: {
        picker: {
            handler: 'onTriggerClick'
        },
        clear: {
            cls: 'yz-trigger-clear yz-trigger-size-s',
            weight: -1, //排到缺省按钮前
            hidden: true,
            handler: 'onClearClick'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpa.src.model.Sprite',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                extraParams: {
                    method: 'GetFileSprites',
                    fileid: config.fileid
                }
            }
        });

        cfg = {
            store: me.store,
            displayField: 'SpriteName',
            valueField: 'SpriteID'
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            change: 'updateClearTrigger'
        });

        if (config.fileid)
            me.store.load({ async: false });
    },

    onClearClick: function () {
        this.clearValue();
    },

    updateClearTrigger: function () {
        var me = this,
            value = me.getValue(),
            clear = me.getTrigger('clear');

        Ext.defer(function () {
            if (value)
                clear.show();
            else
                clear.hide();

            me.updateLayout();
        }, 1);
    }
});