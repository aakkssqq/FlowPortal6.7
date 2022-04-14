
Ext.define('YZSoft.src.dialogs.UploadProgressDlg', {
    extend: 'Ext.window.Window',
    layout: {
        type:'vbox',
        align:'stretch',
        pack:'middle'
    },
    closeAction:'hide',
    bodyPadding:10,
    width: 300,
    height: 180,

    constructor: function (config) {
        var me = this;

        me.progressBar = Ext.create('Ext.ProgressBar', {
        });

        var cfg = {
            items: [me.progressBar]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        config.uploader.on({
            scope: me,
            fileQueued: 'onFileQueued',
            //nextUpload: 'onNextUpload',
            uploadProgress: 'onUploadProgress',
            uploadSuccess: 'onUploadSuccess',
            uploadFailed: 'onUploadFailed'
        });
    },

    onFileQueued: function (file) {
        this.show();
    },

    onUploadProgress: function (file, complete, total) {
        this.progressBar.setValue(complete / total);
    },

    onUploadSuccess:function(file, data){
        this.hide();
    },

    onUploadFailed:function(file, errorMessage){
        this.hide();
    }
});