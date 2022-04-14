/*
config
    processName
    processVersion
    data
*/

Ext.define('YZSoft.bpm.forecast.ProcessPanel', {
    extend: 'Ext.panel.Panel',
    title: RS.$('All_Title_Forecast'),
    layout: 'fit',
    border: false,

    constructor: function (config) {
        var me = this,
            data = config && config.data,
            memberfullname = data && data.Header && data.Header.OwnerMemberFullName;

        //代填
        if (data && data.Header && data.Header.delagationPost && memberfullname) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                params: {
                    method: 'GetPositionsFromFullName',
                    memberfullname: memberfullname
                },
                success: function (action) {
                    me.positions = action.result;
                }
            });
        }
        else {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                params: {
                    method: 'GetUserPositions'
                },
                success: function (action) {
                    me.positions = action.result;
                }
            });
        }

        var pos = me.positions;

        memberfullname = memberfullname || (pos[0] && pos[0].value);
        var defpos = Ext.Array.findBy(pos, function (item) {
            return String.Equ(item.value, memberfullname);
        });
        defpos = defpos || {};

        me.store = Ext.create('YZSoft.bpm.forecast.ProcessStore', {
            proxy: {
                actionMethods: { read: 'POST' },
                type: 'ajax',
                extraParams: {
                    processName: config.processName,
                    version: config.processVersion,
                    owner: defpos.value,
                    xmlData: Ext.util.Base64.encode(YZSoft.util.xml.encode('XForm', data))
                }
            }
        });

        me.grid = Ext.create('YZSoft.bpm.forecast.Grid', {
            store: me.store,
            showStoreErr: true
        });

        me.labPosition = Ext.create('Ext.toolbar.TextItem', {
            text: defpos.name
        });

        var menus = [];
        Ext.each(pos, function (positm) {
            menus.push({
                text: positm.shortName,
                glyph: 0xeb26,
                pos: positm,
                handler: function (item) {
                    me.store.load({
                        params: {
                            owner: this.pos.value
                        },
                        loadMask: {
                            msg: RS.$('All_Forecast_LoadMask'),
                            target: me,
                            start: 0
                        },
                        scope: this,
                        callback: function () {
                            me.labPosition.setText(this.pos.name);
                        }
                    });
                }
            });
        });

        me.btnSelPosition = Ext.create('Ext.button.Button', {
            text: RS.$('All_ChangePosition'),
            glyph:0xea94,
            disabled: pos.length == 0,
            menuAlign:'tr-br?',
            menu: {
                shadow: false,
                bodyPadding: '12 0',
                defaults: {
                    padding: '3 16'
                },
                items: menus
            }
        });

        var cfg = {
            tbar: [me.labPosition, '->', me.btnSelPosition],
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },


    setFormData: function (xmlData) {
        var me = this,
            params = me.store.getProxy().getExtraParams();

        params.xmlData = xmlData && Ext.util.Base64.encode(YZSoft.util.xml.encode('XForm', xmlData));
        if (me.store.isLoaded()) {
            me.store.load({
                loadMask: false
            });
        }
    }
});