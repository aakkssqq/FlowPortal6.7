/*
config
tables
*/

Ext.define('YZSoft.src.form.field.CondByFormField', {
    extend: 'YZSoft.src.form.field.CondBaseField',
    compareField: {
        xtype: 'textfield',
        flex: 1,
        editable:false,
        emptyText: RS.$('All_BizDataField'),
        getField:function(){
            return this.field;
        },
        triggers: {
            browser: {
                cls: 'yz-trigger-formfield',
                handler: function (field) {
                    var me = field;
                    Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', Ext.apply({
                        autoShow: true,
                        tables: me.tables,
                        fn: function (field) {
                            me.setValue(field.FullName);
                            me.field = {
                                express: '(' + field.Type + ')FormDataSet["' + field.FullName + '"]',
                                type: field.Type
                            };

                            me.fireEvent('selected', field);
                        }
                    }, me.dlgConfig));
                }
            }
        },
        listeners: {
            tablesChanged: function (tables) {
                this.tables = tables;
            }
        }
    }
});