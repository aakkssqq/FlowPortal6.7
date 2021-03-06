
/*
cnt
*/
Ext.define('YZSoft.src.designer.part.Pie3DAngleField', {
    extend: 'YZSoft.src.designer.part.ChartSingleFieldAbstract',
    isPie3DAngleField: true,

    onDeleteClick: function (e, t, eOpts) {
        var me = this,
            comp = me.getComp(),
            columName = comp.columnName;

        e.stopEvent();

        Ext.Msg.show({
            msg: Ext.String.format(Ext.String.format(RS.$('ReportDesigner_Warn_DeletePieAngleField'), columName)),
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