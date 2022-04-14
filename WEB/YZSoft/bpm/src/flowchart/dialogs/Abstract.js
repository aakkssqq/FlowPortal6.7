/*
config
data
property
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Abstract', {
    extend: 'Ext.window.Window', //999999
    layout: 'fit',
    cls:'yz-window-size-s',
    width: 950,
    height: 608,
    modal: true,
    maximizable: true,
    bodyPadding: 0,
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            dlgName = config.dlgName || me.dlgName || RS.$('All_NodeProperty');

        if (!config.title) {
            if (config.data.Name)
                config.title = Ext.String.format('{0} - {1}', dlgName, config.data.Name);
            else
                config.title = dlgName;
        }

        me.callParent(arguments);
    },

    onFileClick: function (option) {
        var me = this;

        if (me.modal)
            me.closeDialog(me.save());

        me.property.sprite.drawContainer.fireEvent('fileClick', option);
    }
});