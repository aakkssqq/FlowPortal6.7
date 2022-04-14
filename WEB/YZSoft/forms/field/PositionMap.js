
Ext.define('YZSoft.forms.field.PositionMap', {
    extend: 'YZSoft.forms.field.Element',

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        if (agent.Params.Model == agent.Models.Post) {
            agent.on({
                scope: me,
                positionChange: 'onPositionChange'
            });
        }
    },

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            OULevel: me.getAttribute('OULevel'),
            sDataMap: me.getMap()
        });

        return config;
    },

    onPositionChange: function (newPosition) {
        var me = this,
            et = me.getEleType();

        if (!et || !et.DataMap)
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Form.ashx'),
            params: {
                method: 'GetPositionInfo',
                OULevel: et.OULevel,
                memberfullname: newPosition
            },
            success: function (action) {
                me.mapvalues = action.result;
                me.agent.onDataAvailable(me);
            },
            failure: function (action) {
            }
        });
    },

    doMap: function (rows, options) {
        var me = this,
            et = me.getEleType();

        me.doMapSingline(rows[0], et.DataMap.kvs);
    }
});