
Ext.define('Demo.XFormField.ExtReport', {
    extend: 'YZSoft.forms.field.ExtJSControl',

    createComponent: function (config) {
        var me = this;

        me.myDataStorePie = Ext.create('Ext.data.JsonStore', {
            fields: ['os', 'data1'],
            data: [
                { os: '合同审批', data1: 68.3 },
                { os: '日常付款', data1: 1.7 },
                { os: '采购申请', data1: 17.9 },
                { os: '付款申请', data1: 10.2 }
            ]
        });

        return Ext.create({
            border: false,
            xtype:'colorfield',
            width: config.width,
            height: config.height,
            store: me.myDataStorePie,
            insetPadding: 10,
            innerPadding: 30,
            tbar: {
                cls: 'yz-kpi-toolbar',
                items: [{
                    xtype: 'container',
                    cls: 'yz-kpi-chart-title',
                    html: 'Top 5'
                }]
            },

            interactions: ['rotate', 'itemhighlight'],
            series: [{
                type: 'pie',
                angleField: 'data1',
                label: {
                    field: 'os',
                    calloutLine: {
                        length: 50,
                        width: 3
                        // specifying 'color' is also possible here
                    }
                },
                highlight: true,
                tooltip: {
                    trackMouse: true,
                    renderer: function (storeItem, item) {
                        this.setHtml(storeItem.get('os') + ': ' + storeItem.get('data1') + '%');
                    }
                }
            }]
        });
    }
});