Ext.define('YZSoft.src.model.ChartSeries', {
    extend: 'Ext.data.Model',
    idProperty: 'type',
    fields: [
        { name: 'seriesType' },
        { name: 'desc' }, {
            name: 'url',
            depends: ['type'],
            convert: function (v, rec) {
                return YZSoft.$url(Ext.String.format('YZSoft/src/designer/img/series/{0}.png', rec.data.seriesType));
            }
        }
    ]
});
