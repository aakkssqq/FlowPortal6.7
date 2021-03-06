
/*
cnt
*/
Ext.define('YZSoft.src.designer.part.RadarSeriesField', {
    extend: 'YZSoft.src.designer.part.ChartSeriesFieldAbstract',
    isRadarSeriesField: true,

    onDeleteClick: function (e, t, eOpts) {
        var me = this,
            comp = me.getComp(),
            columName = comp.columnName;

        e.stopEvent();

        Ext.Msg.show({
            msg: Ext.String.format(Ext.String.format(RS.$('ReportDesigner_Msg_DeleteSeries'), columName)),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                me.destroy();
            }
        });
    }
});