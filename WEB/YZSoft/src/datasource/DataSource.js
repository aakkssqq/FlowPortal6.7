
Ext.define('YZSoft.src.datasource.DataSource', {
    statics: {
        getIdentityText: function (ds) {
            var me = this,
                dstype = ds && ds.type;

            if (dstype == 'table')
                return Ext.String.format(RS.$('All_DataSource_Identity_Table'), ds.datasourceName, ds.tableName);
            else if (dstype == 'procedure')
                return Ext.String.format(RS.$('All_DataSource_Identity_Procedure'), ds.datasourceName, ds.procedureName);
            else if (dstype == 'esb') {
                if (Ext.String.startsWith(ds.esbObjectName, 'ESB:'))
                    return ds.esbObjectName;
                else
                    return Ext.String.format(RS.$('All_DataSource_Identity_ESB'), ds.esbObjectName);
            }
            else if (dstype == 'query')
                return Ext.String.format(RS.$('All_DataSource_Identity_Query'));

            return '';
        },

        tryCreate: function (config) {
            var me = this,
                dstype = config && config.type,
                xclass;

            if (dstype == 'table')
                xclass = 'YZSoft.src.datasource.Table';
            else if (dstype == 'procedure')
                xclass = 'YZSoft.src.datasource.Procedure';
            else if (dstype == 'esb')
                xclass = 'YZSoft.src.datasource.ESB';
            else if (dstype == 'query')
                xclass = 'YZSoft.src.datasource.Query';
            else
                return null;

            return Ext.create(xclass, config);
        }
    },

    constructor: function (config) {
        var me = this,
            ds = me.self.tryCreate(config);

        if (!ds)
            YZSoft.Error.raise(RS.$('All_Excpetion_InvalidDataSource'), Ext.encode(config));
        else
            return ds;
    }
});