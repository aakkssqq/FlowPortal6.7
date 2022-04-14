Ext.define('YZSoft.bpa.src.model.TemplateObject', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'Path' },
        { name: 'Name' },
        { name: 'NameNoExt' },{
            name: 'DisplayName',
            depends:['Path','NameNoExt'],
            convert: function (v,rec) {
                var path = rec.data.Path,
                    nameNoExt = rec.data.NameNoExt;

                return RS.$('All_BPA_Templates_Enum_' + path + '_' + nameNoExt, nameNoExt);
            }
        },{
            name: 'url',
            depends: ['Path', 'Name'],
            convert: function (v,rec) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    method: 'GetBPATemplateThumbnail',
                    path: rec.data.Path,
                    name: rec.data.Name,
                    _dc: +new Date()
                }));
            }
        }
    ]
});