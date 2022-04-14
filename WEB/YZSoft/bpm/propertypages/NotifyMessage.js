/*
config
messageCatFieldConfig

method
fill
{
}
*/
Ext.define('YZSoft.bpm.propertypages.NotifyMessage', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Notify'),
    layout: 'fit',

    constructor: function (config) {
        var me = this;

        me.edtMessageCat = Ext.create('YZSoft.bpm.src.editor.MessageCatField', Ext.apply({
            name: 'messages'
        }, config.messageCatFieldConfig));

        var cfg = {
            items: [me.edtMessageCat]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.edtMessageCat.relayEvents(me, ['tablesChanged']);
    },

    fill: function (data) {
        this.getForm().setValues({
            messages: data
        });
    },

    save: function () {
        return this.getValuesSubmit().messages;
    }
});