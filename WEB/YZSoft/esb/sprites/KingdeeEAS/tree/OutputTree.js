
Ext.define('YZSoft.esb.sprites.KingdeeEAS.tree.OutputTree', {
    extend: 'YZSoft.src.jschema.tree.SpecificSchemaOutputTree',
    decodable: true,

    editTopDecodable: function (record) {
        var me = this;

        me.callParent([record, {
            cmbDecodeType: {
                defaultDecode: 'XML'
            }
        }]);
    }
});