/*
config
serverName,
tables,
importdataset

stepOwner : true/false
agentUser : true/false
loginUser : true/false
taskInitiator : true/false
datetime : true/false
dayofweek : true/false
formfields : true/false
*/

Ext.define('YZSoft.bpm.src.dialogs.CodeSuggestDlg', {
    extend: 'Ext.window.Window', //111111
    title: RS.$('All_Title_CodeSuggest'),
    layout: 'border',
    width: 512,
    height: 600,
    minWidth: 512,
    minHeight: 600,
    modal: true,
    buttonAlign: 'right',

    stepOwner: {
        text: RS.$('All_CurStepOwner'),
        expandable: true,
        expanded: false,
        children: []
    },
    agentUser: {
        text: RS.$('All_Delegator'),
        expandable: true,
        expanded: false,
        children: []
    },
    loginUser: {
        text: RS.$('All_LoginUser'),
        expandable: true,
        expanded: false,
        children: []
    },
    taskInitiator: {
        text: RS.$('All_TaskInitiator'),
        expandable: true,
        expanded: false,
        children: []
    },
    datetime: {
        text: RS.$('All_Date'),
        expandable: true,
        expanded: false,
        children: [
            { text: RS.$('All_Today'), code: 'DateTime.Today', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_Yesterday'), code: 'DateTime.Today - TimeSpan.FromDays(1)', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_TheDayBeforeYesterday'), code: 'DateTime.Today - TimeSpan.FromDays(2)', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_Tomorrow'), code: 'DateTime.Today + TimeSpan.FromDays(1)', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_TheDayAfterTomorrow'), code: 'DateTime.Today + TimeSpan.FromDays(2)', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_ThisYear'), code: 'DateTime.Today.Year', leaf: true, glyph: 0xeaf4 },
        ]
    },
    dayofweek: {
        text: RS.$('All_Weekday'),
        expandable: true,
        expanded: false,
        children: [
            { text: RS.$('All_Today'), code: 'DateTime.Today.DayOfWeek', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_Yesterday'), code: '(DateTime.Today - TimeSpan.FromDays(1)).DayOfWeek', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_TheDayBeforeYesterday'), code: '(DateTime.Today - TimeSpan.FromDays(2)).DayOfWeek', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_Tomorrow'), code: '(DateTime.Today + TimeSpan.FromDays(1)).DayOfWeek', leaf: true, glyph: 0xeaf4 },
            { text: RS.$('All_TheDayAfterTomorrow'), code: '(DateTime.Today + TimeSpan.FromDays(2)).DayOfWeek', leaf: true, glyph: 0xeaf4 }
        ]
    },
    formfields: {
        text: RS.$('All_FormField'),
        expandable: true,
        expanded: false,
        id: 'formfields'
    },
    processLink: {
        text: RS.$('All_ProcessLink'),
        expandable: true,
        expanded: false,
        children: [
            { text: RS.$('All_Mail_ClickToProcess'), code: 'Context.Current.CreateProcessLinks()', leaf: true }
        ]
    },

    regularConfig: function (config, name, defaultValue) {
        var me = this,
            value = name in config ? config[name] : defaultValue;

        if (value === false)
            return false;

        if (value === true)
            return Ext.clone(me[name]);

        return value;
    },

    constructor: function (config) {
        var me = this,
            tables = [],
            stepOwner = me.regularConfig(config, 'stepOwner', true),
            agentUser = me.regularConfig(config, 'agentUser', true),
            loginUser = me.regularConfig(config, 'loginUser', true),
            taskInitiator = me.regularConfig(config, 'taskInitiator', true),
            datetime = me.regularConfig(config, 'datetime', true),
            dayofweek = me.regularConfig(config, 'dayofweek', true),
            formfields = me.regularConfig(config, 'formfields', true),
            processLink = me.regularConfig(config, 'processLink', false),
            cfg;

        stepOwner.children = [];
        agentUser.children = [];
        loginUser.children = [];
        taskInitiator.children = []

        Ext.each(YZSoft.UserProperties, function (prop) {
            if (stepOwner !== false) {
                stepOwner.children.push({
                    text: 'Owner.UserInfo' + prop.propName,
                    leaf: true,
                    glyph: 0xeaf4
                });
            }

            if (agentUser !== false) {
                agentUser.children.push({
                    text: 'AgentUser' + prop.propName,
                    leaf: true,
                    glyph: 0xeaf4
                });
            }

            if (loginUser !== false) {
                loginUser.children.push({
                    text: 'LoginUser' + prop.propName,
                    leaf: true,
                    glyph: 0xeaf4
                });
            }

            if (taskInitiator !== false) {
                taskInitiator.children.push({
                    text: 'Initiator.UserInfo' + prop.propName,
                    leaf: true,
                    glyph: 0xeaf4
                });
            }
        });

        Ext.each(YZSoft.MemberProperties, function (prop) {
            if (stepOwner !== false) {
                stepOwner.children.push({
                    text: 'Owner' + prop.propName,
                    leaf: true,
                    glyph: 0xeaf4
                });
            }

            if (taskInitiator !== false) {
                taskInitiator.children.push({
                    text: 'Initiator' + prop.propName,
                    leaf: true,
                    glyph: 0xeaf4
                });
            }
        });

        Ext.each(config.tables || [], function (table) {
            tables.push([
                table.DataSourceName,
                table.TableName
            ]);
        });

        var rootData = [];

        if (stepOwner !== false)
            rootData.push(stepOwner);

        if (agentUser !== false)
            rootData.push(agentUser);

        if (loginUser !== false)
            rootData.push(loginUser);

        if (taskInitiator !== false)
            rootData.push(taskInitiator);

        if (datetime !== false)
            rootData.push(datetime);

        if (dayofweek !== false)
            rootData.push(dayofweek);

        if (formfields !== false)
            rootData.push(formfields);

        if (processLink !== false)
            rootData.push(processLink);

        if (config.importdataset) {
            var importTables = [];
            Ext.each(config.importdataset.Tables, function (table) {
                var columns = [];
                Ext.each(table.Columns, function (column) {
                    columns.push({
                        text: column.ColumnName,
                        code: Ext.String.format('ImportDataSet["{0}.{1}"]', table.TableName, column.ColumnName),
                        leaf: true,
                        glyph: 0xeaf8
                    });
                });

                importTables.push({
                    text: table.TableName,
                    leaf: false,
                    glyph: 0xe800,
                    expandable: true,
                    expanded: false,
                    children: columns
                });
            });

            rootData.push({
                text: RS.$('All_ImportData'),
                expandable: true,
                expanded: false,
                children: importTables
            });
        }

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'Ext.data.TreeModel',
            root: {
                expanded: true,
                children: rootData
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
                extraParams: {
                    method: 'GetTreeOfTables',
                    serverName: config.serverName,
                    tables: Ext.encode(tables),
                    expand: false
                }
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            title: RS.$('All_GeneralFunction'),
            region: 'center',
            border: true,
            store: me.store,
            rootVisible: false,
            useArrows: true,
            hideHeaders: true,
            viewConfig: {
                loadMask: false
            },
            //tools: [{
            //    type: 'refresh',
            //    handler: function (event, toolEl, panel) {
            //        var rec = me.store.getById('formfields');
            //        me.store.load({
            //            node: rec,
            //            loadMask: {
            //                msg: RS.$('All_Loading'),
            //                start:0
            //            },
            //            callback: function () {
            //                rec.expand(true);
            //            }
            //        });
            //    }
            //}],
            listeners: {
                itemdblclick: function (tree, record, item, index, e, eOpts) {
                    if (record.isLeaf())
                        me.closeDialog(me.getCodeTextFromRecord(record));
                },
                selectionchange: function (sm, selected, eOpts) {
                    if (selected.length == 1)
                        me.edtCode.setValue(selected[0].isLeaf() ? me.getCodeTextFromRecord(selected[0]) : '');
                }
            }
        });

        me.edtCode = Ext.create('Ext.form.field.TextArea', {
            region: 'south',
            cls:'yz-textarea-3line',
            split: {
                size: 4
            },
            listeners: {
                change: function () {
                    var code = Ext.String.trim(me.edtCode.getValue());
                    me.btnOK.setDisabled(!code);
                }
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var code = Ext.String.trim(me.edtCode.getValue());
                if (code)
                    me.closeDialog(code);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.tree, me.edtCode],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getCodeTextFromRecord: function (rec) {
        var me = this,
            rv;

        if (rec.data.hasOwnProperty('data'))
            rv = Ext.String.format('FormDataSet["{0}.{1}"]', rec.data.data.TableName, rec.data.data.ColumnName);
        else
            rv = rec.data.code || rec.data.text;

        return rv;
    },

    show: function (config) {
        config = config || {};

        if (config.title)
            this.setTitle(config.title);

        if (config.fn) {
            this.fn = config.fn;
            this.scope = config.scope;
        }

        this.callParent();
    }
});
