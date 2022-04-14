Ext.define('YZSoft.src.model.ClassicGroupImage', {
    extend: 'Ext.data.Model',
    idProperty: 'Code',
    fields: [
        { name: 'Code', type: 'string' },
        { name: 'Text', type: 'string' },
        { name: 'NameSpace', type: 'string' },
        { name: 'Image', type: 'string' },
        {
            name: 'imageurl',
            depends: ['Code'],
            convert: function (v, rec) {
                return YZSoft.$url(Ext.String.format('YZSoft/theme/images/group/{0}.png', rec.data.Code));
            }
        }
    ]
});