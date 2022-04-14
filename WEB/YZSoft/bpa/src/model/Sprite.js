Ext.define('YZSoft.bpa.src.model.Sprite', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'FileID' },
        { name: 'SpriteID' },
        { name: 'FileName' },
        { name: 'SpriteName' }
    ],

    constructor: function (data, session) {
        data['id'] = Ext.String.format('_{0}__{1}_', data.FileID, data.SpriteID);
        this.callParent(arguments);
    }
});
