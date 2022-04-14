/*
config:
*/
Ext.define('YZSoft.report.rpt.PropertyPages.DataSource', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_DataSource'),
    layout: 'fit',

    constructor: function (config) {
        var me = this;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
            params: {
                method: 'GetDataSourceNames'
            },
            success: function (action) {
                me.dataSourceNames = action.result;
            }
        });

        var dsNames = me.dataSourceNames;
        var menus = [];
        Ext.each(dsNames, function (dsName) {
            menus.push({
                text: dsName,
                dsName: dsName,
                handler: function (item) {
                    me.btnSelDS.setText(this.dsName);
                }
            });
        });

        me.btnSelDS = Ext.create('Ext.button.Button', {
            text: 'Default',
            minWidth: 120,
            padding: '2 6',
            menu: {
                items: menus
            }
        });

        var cfg = {
            dockedItems:[{
                xtype: 'container',
                dock:'top',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                margin: '0 0 3 0',
                items: [{
                    xtype: 'label',
                    html: Ext.String.format('{0}:', RS.$('All_SqlQuery'))
                }, {
                    xtype: 'tbfill'
                }, {
                    xtype: 'label',
                    html: RS.$('All_DataSource'),
                    margin: '0 6 0 0'
                }, me.btnSelDS]
            },{
                xtype: 'container',
                dock:'bottom',
                layout: 'hbox',
                items: [{
                    xtype:'checkbox',
                    name:'ClientCursor',
                    boxLabel: RS.$('Report_ClientPaging')
                }]
            }],
            items: [{
                xtype: 'textarea',
                reference: 'edtQuery',
                cls: 'yz-form-field-code',
                inputAttrTpl: new Ext.XTemplate([
                    'wrap="off"'
                ]),
                name: 'Query'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.btnSelDS.setText(data.DataSourceName);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        rv.DataSourceName = this.btnSelDS.getText();
        rv.Query = Ext.String.trim(rv.Query);
        return rv;
    },

    updateStatus: function () {
    }
});