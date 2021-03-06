
/*
cnt
*/
Ext.define('YZSoft.src.designer.part.Pie3DLabelField', {
    extend: 'YZSoft.src.designer.part.ChartSingleFieldAbstract',
    isPie3DLabelField: true,

    onDeleteClick: function (e, t, eOpts) {
        var me = this,
            comp = me.getComp(),
            columName = comp.columnName;

        e.stopEvent();

        Ext.Msg.show({
            msg: Ext.String.format(Ext.String.format(RS.$('ReportDesigner_Warn_DeletePieLabelField'), columName)),
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