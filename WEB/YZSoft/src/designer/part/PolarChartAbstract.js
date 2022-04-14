
Ext.define('YZSoft.src.designer.part.PolarChartAbstract', {
    extend: 'YZSoft.src.designer.part.SimpleChartAbstract',
    inheritableStatics: {
        demoStore: Ext.create('Ext.data.Store', {
            data: [
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '1', __demo__angle1__: 6830 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '2', __demo__angle1__: 1308 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '3', __demo__angle1__: 1790 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '4', __demo__angle1__: 1020 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '5', __demo__angle1__: 190 }
            ]
        })
    },

    initDemoData: function (store) {
        if (store.getCount() == 0)
            return;

        var rec = store.getAt(0),
            i;

        i = 1;
        if (!('__demo__label1__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__label1__: RS.$('ReportDesigner_DemoData_Company') +  i
                });

                i++;
            });
        }

        if (!('__demo__angle1__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__angle1__: Ext.Number.randomInt(0, 20) * 500
                });
            });
        }
    }
});