/*
  {
    "ReferencedAssemblies": [
      "System.dll",
      "System.Transactions.dll",
      "BPM.dll",
      "BPM.Server.dll"
    ],
    "Using": [
      "using System;",
      "using System.IO;",
      "using System.Text;",
      "using System.Transactions;",
      "using BPM;",
      "using BPM.Server;",
      "using BPM.Server.OAL;",
      "using BPM.Server.Security;"
    ]
  }
*/

Ext.define('YZSoft.bpm.propertypages.DotNetEnv', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('Process_Title_DotNetEnv'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                xtype: 'textarea',
                labelAlign: 'top',
                lineArray: true
            },
            items: [{
                fieldLabel: RS.$('All_Code_Reference'),
                reference: 'edtReference',
                flex: 8
            }, {
                fieldLabel: RS.$('All_Code_Using'),
                reference: 'edtUsing',
                margin:0,
                flex: 9
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        refs.edtReference.setValue(data.ReferencedAssemblies);
        refs.edtUsing.setValue(data.Using);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var value = {
            ReferencedAssemblies: refs.edtReference.getValue(),
            Using: refs.edtUsing.getValue()
        };

        return value;
    }
});