/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpa.sprite.Properties.Property', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',

    constructor: function (config) {
        this.callParent(arguments);
    },

    saveData: function (data) {
        return this.data = Ext.apply({
            Id: this.data.Id
        }, data);
    }
});