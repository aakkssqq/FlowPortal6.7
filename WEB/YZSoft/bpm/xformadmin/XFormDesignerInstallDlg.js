/*
config:
version
*/
Ext.define('YZSoft.bpm.xformadmin.XFormDesignerInstallDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.src.ux.File'
    ],
    title: RS.$('All_Title_XFormDesignerInstall'),
    cls:'yz-window-prompt',
    layout: 'fit',
    width: 545,
    modal: true,
    resizable: false,
    buttonAlign: 'right',
    bodyPadding:'16 26 10 26',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            buttons: {
                defaults: {
                    minWidth:120
                },
                items: [{
                    text: RS.$('All_Close'),
                    handler: function () {
                        me.closeDialog();
                    }
                },{
                    text: Ext.String.format('{0}(1.3M)', RS.$('All_DownInstallPackage')),
                    cls:'yz-btn-default',
                    handler: function () {
                        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                            method: 'DownloadXFormDesignerSetupPackage',
                            fileName: 'XFormDesigner.exe'
                        });
                    }
                }]
            },
            defaults: {
                readOnly: false,
                labelAlign: 'top'
            },
            items: [{
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'component',
                    style: 'font-size:1.2em;font-weight:bold;',
                    html: Ext.String.format(RS.$('All_XFormDesignerInstall_Caption'), config.version),
                    margin: '10 0 8 0'
                },{
                    xtype: 'component',
                    style: 'line-height:20px;',
                    html: Ext.String.format(RS.$('All_XFormDesignerInstall_Desc'), config.version)
                },{
                    xtype: 'component',
                    margin: '20 0 8 0',
                    style: 'font-weight:bold',
                    html: RS.$('All_XFormDesignerInstall_InstallStepsCaption')
                },{
                    xtype: 'component',
                    style: 'line-height:18px;',
                    html: RS.$('All_XFormDesignerInstall_Steps')
                },{
                    xtype: 'component',
                    margin: '16 0 6 0',
                    html: Ext.String.format('{0}:<br/><a href="{1}" target="_self">{1}</a>', RS.$('All_XFormDesignerInstall_ManualDownload'), YZSoft.$url('YZSoft/BPM/XFormAdmin/Install/XFormDesigner.exe'))
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});