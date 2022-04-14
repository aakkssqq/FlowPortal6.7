/*
config
    uploadButton:true
    root:'Templates'
    templateType:null
    path:null
    comboConfig
    buttonConfig
    uploaderConfig
*/

Ext.define('YZSoft.src.form.field.DocTemplateField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.src.ux.File'
    ],
    uploadButton: true,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    templateTypes: {
        Word: {
            fileSizeLimit: '100 MB',
            fileTypes: '*.doc;*.docx',
            typesDesc: 'Word'
        },
        Excel: {
            fileSizeLimit: '100 MB',
            fileTypes: '*.xls;*.xlsx',
            typesDesc: 'Excel'
        }
    },
    perfix: 'Account',

    constructor: function (config) {
        config = config || {};

        var me = this,
            uploadButton = 'uploadButton' in config ? config.uploadButton : me.uploadButton,
            root = config.root || 'Templates',
            templateType = config.templateType,
            path = me.path = 'path' in config ? config.path : templateType,
            uploaderConfig = config.uploaderConfig,
            perfix = config.perfix || me.perfix;
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/OSFileSystem.ashx'),
                extraParams: {
                    Method: 'GetFolderDocuments',
                    root: root,
                    path: templateType
                }
            }
        });

        me.combo = Ext.create('Ext.form.field.ComboBox', Ext.apply({
            editable: false,
            queryMode: 'local',
            store: me.store,
            valueField: 'Name',
            displayField: 'Name',
            flex: 1,
            value: config.value,
            emptyText: config.emptyText,
            submitValue: false
        }, config.comboConfig));

        me.button = Ext.create('Ext.button.Button', Ext.apply({
            text: RS.$('All_Btn_UploadTemplate'),
            padding: '0 10',
            margin: '0 0 0 3',
            hidden: !uploadButton
        }, config.buttonConfig));

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', Ext.apply({
            attachTo: me.button,
            params: {
                Method: 'OSFileSystemUpload',
                root: root,
                path: path,
                perfix: perfix
            },
            listeners: {
                uploadSuccess: function (file, data) {
                    me.store.reload({
                        callback: function (records, operation, success) {
                            if (!success)
                                return;

                            var rec = me.store.findRecord('Name', data.Name);
                            if (rec) {
                                me.setValue(data.Name);
                                me.fireEvent('select', me, rec);
                            }
                        }
                    });
                }
            }
        }, uploaderConfig, me.templateTypes[templateType]));

        cfg = {
            items: [me.combo, me.button]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.combo, ['select','change']);
    },

    setDisabled: function (value) {
        var me = this;

        me.combo.setDisabled(value);
        me.button.setDisabled(value);
    },

    setValue: function (value) {
        this.combo.setValue(value);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    download: function () {
        var me = this,
            value = me.getValue(),
            root = me.root;

        if (!value)
            return;

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            osfile: true,
            root: me.root,
            path: me.path,
            name: value,
            _dc: +new Date()
        });
    }
});