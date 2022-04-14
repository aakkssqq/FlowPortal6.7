/*
config
tables:
[
    {
        "DataSourceName": "Default",
        "TableName": "A",
        "IsRepeatableTable": false
    },
    {
        "DataSourceName": "BPMSAN",
        "TableName": "AAA",
        "IsRepeatableTable": true
    }
],
value
{
"Name": "状态1",
"ShowSaveButton": true,
"ValidationGroup": "1111",
"ControlDataSet": {
"Tables": [
    {
    "DataSourceName": "Default",
    "TableName": "A",
    "AllowAddRecord": false,
    "Columns": [
        {
        "ColumnName": "TaskID",
        "DefaultValue": 11,
        "SaveValue": 22,
        "AllowRead": true,
        "AllowWrite": false,
        "ShowSpoor": false
        },
        {
        "ColumnName": "A1",
        "DefaultValue": {
            "CodeText": "FormDataSet[\"A.TaskID\"]"
        },
        "SaveValue": null,
        "AllowRead": false,
        "AllowWrite": false,
        "ShowSpoor": false
        },
        {
        "ColumnName": "S1",
        "DefaultValue": "222",
        "SaveValue": null,
        "AllowRead": true,
        "AllowWrite": true,
        "ShowSpoor": false
        }
    ],
    "Filter": {
        "Params": [
        {
            "ParamName": "TaskID",
            "Value": 11
        },
        {
            "ParamName": "A1",
            "Value": "22"
        },
        {
            "ParamName": "S1",
            "Value": {
            "CodeText": "DateTime.Today"
            }
        }
        ]
    }
    }
]
},
"Events": [
{
    "EventType": "FormDataPrepared",
    "CodeBlock": {
    "CodeText": "int a = 11;"
    }
},
{
    "EventType": "FormSaved",
    "CodeBlock": {
    "CodeText": "int a=12;"
    }
}
]
}
*/

Ext.define('YZSoft.app.formservice.FormStateDlg', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    modal: true,
    maximizable: true,
    buttonAlign:'right',
    bodyPadding: 0,
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        //Ext.suspendLayouts();
        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.FormStateGeneral', {
            tables: config.tables,
            padding: '15 15 5 15'
        });

        me.pnlEvents = Ext.create('YZSoft.bpm.propertypages.Events', {
            padding: '15 15 5 15',
            events: [
                'OnFormDataPrepared',
                'OnBeforeSave',
                'OnFormSaved'
            ]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlEvents
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            handler: function () {
                var value = me.save();
                me.closeDialog(value);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);

        //Ext.resumeLayouts(true);
    },

    fill: function (value) {
        var me = this;

        me.pnlGeneral.fill(value);
        me.pnlEvents.fill(value.Events);
    },

    save: function () {
        var me = this,
            value;

        value = me.pnlGeneral.save();
        value.Events = me.pnlEvents.save();

        return value;
    }
});