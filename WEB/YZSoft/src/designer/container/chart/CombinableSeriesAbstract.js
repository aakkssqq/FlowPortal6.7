
Ext.define('YZSoft.src.designer.container.chart.CombinableSeriesAbstract', {
    extend: 'YZSoft.src.designer.container.chart.SeriesAbstract',
    opts: {
        tag: 'div',
        cls: 'yz-series-opt-cnt',
        children: [{
            cls: 'd-flex flex-row',
            children: [{
                cls: 'opt setting'
            }, {
                cls: 'opt add',
                html: RS.$('ReportDesigner_AddSeries')
            }, {
                cls: 'opt remove'
            }]
        }]
    },
    config: {
        addOpt:true,
        removeOpt: true,
        settingOpt: true
    },

    constructor: function (config) {
        var me = this;

        me.optEls = Ext.dom.Element.create(me.opts);

        me.settingEl = me.optEls.down('.setting');
        me.addEl = me.optEls.down('.add');
        me.removeEl = me.optEls.down('.remove');
        me.settingEl.setVisibilityMode(Ext.Element.DISPLAY);
        me.addEl.setVisibilityMode(Ext.Element.DISPLAY);
        me.removeEl.setVisibilityMode(Ext.Element.DISPLAY);

        me.callParent(arguments);

        me.on({
            single: true,
            afterrender: function () {
                me.el.appendChild(me.optEls);

                me.optEls.on({
                    scope: me,
                    click: 'onOptClick'
                });
            }
        });
    },

    getNextSeries: function (index) {
        var me = this,
            chartPart = me.chartPart,
            series = me.callParent(arguments);

        return (series || chartPart.getNextSeries(me));
    },

    updateSettingOpt: function (newValue) {
        this.settingEl.setVisible(newValue);
    },

    updateAddOpt: function (newValue) {
        this.addEl.setVisible(newValue);
    },

    updateRemoveOpt: function (newValue) {
        this.removeEl.setVisible(newValue);
    },

    onOptClick: function (e) {
        var me = this,
            chartPart = me.chartPart,
            seriesids = me.getSeriesIds(),
            setting = e.getTarget('.setting'),
            add = e.getTarget('.add'),
            remove = e.getTarget('.remove');

        if (setting) {
            e.stopEvent();
            me.chartPart.designer.dcnt.select(me.chartPart, me);
        }

        if (add) {
            e.stopEvent();
            me.fireEvent('addSeriesClick');
        }

        if (remove) {
            e.stopEvent();

            Ext.Msg.show({
                msg: Ext.String.format(RS.$('ReportDesigner_Msg_DeleteCombinableSeries')),
                buttons: Ext.Msg.OKCANCEL,
                defaultButton: 'cancel',
                icon: Ext.Msg.INFO,
                fn: function (btn, text) {
                    if (btn != 'ok')
                        return;

                    //不能在destroy中做，会引起异常
                    chartPart.removeSeries(seriesids);
                    chartPart.refreshXAxisExpandRange();

                    me.destroy();
                }
            });
        }
    }
});