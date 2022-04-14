
Ext.define('YZSoft.src.jmap.MapAbstract', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.jschema.data.Store',
        'YZSoft.src.form.field.JMapEditor'
    ],
    style: 'background-color:#f4f5f6;',
    srcTreeXClass: null,
    tagTreeXClass: null,
    config: {
        jsmCode: null,
        srcSchema: null,
        tagSchema: null
    },
    $refresh: Ext.emptyFn(),

    constructor: function (config) {
        var me = this,
            cfg;

        me.srcTree = me.createSrcTree(config);
        me.tagTree = me.createTagTree(config);
        me.editor = me.createEditor(config);
        me.linkPanel = me.createLinkPanel(config);

        me.dragMgr = Ext.create('YZSoft.src.jmap.link.DragDrop', {
            srcTree: me.srcTree,
            tagTree: me.tagTree
        });

        cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.srcTree, me.linkPanel, me.tagTree, me.editor]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.relayEvents(me.srcTree, ['schemachanged'], 'src');
        me.relayEvents(me.tagTree, ['schemachanged'], 'tag');

        me.editor.relayEvents(me.dragMgr, ['linkdrop']);
        me.editor.relayEvents(me.tagTree, ['clearlink'], 'tagtree');

        me.linkPanel.relayEvents(me.dragMgr, ['linkdrop']);
    },

    onActivate: function (times) {
        var me = this;

        if (me.dirty) {
            me.dirty = false;
            me.dirtyRefresh();
        }
    },

    dirtyRefresh: function () {
        this.$refresh();
    },

    getOutputTreeXClass: function (sprite) {
        var nameSpace = sprite.$className.split('.');

        nameSpace[nameSpace.length - 1] = 'tree.OutputTree';
        return nameSpace.join('.');
    },

    getInputTreeXClass: function (sprite) {
        var nameSpace = sprite.$className.split('.');

        nameSpace[nameSpace.length - 1] = 'tree.InputTree';
        return nameSpace.join('.');
    },

    applyJsmCode: function (value) {
        value = value || '';

        if (!value) {
            value = [
                'var $result = {',
                '}'
            ].join('\r\n');
        }

        return value;
    },

    updateJsmCode: function (value) {
        this.editor && this.editor.setValue(value);
        this.linkPanel && this.linkPanel.setJsmCode(value);
    },

    getJsmCode: function () {
        return this.editor.getValue();
    },

    updateSrcSchema: function (value) {
        this.srcTree && this.srcTree.setSchema(value);
    },

    updateTagSchema: function (value) {
        this.tagTree && this.tagTree.setSchema(value);
    },

    createSrcTree: function (config) {
        var me = this,
            schema = config.srcSchema || me.config.srcSchema;

        return Ext.create(me.srcTreeXClass, Ext.apply({
            schema: schema
        }, me.srcTreeConfig));
    },

    createTagTree: function (config) {
        var me = this,
            schema = config.tagSchema || me.config.tagSchema;

        return Ext.create(me.tagTreeXClass, Ext.apply({
            schema: schema
        }, me.tagTreeConfig));
    },

    createEditor: function (config) {
        config = config || {};

        var me = this,
            jsmCode = me.applyJsmCode(config.jsmCode || me.config.jsmCode);

        return Ext.create('YZSoft.src.form.field.JMapEditor', {
            cls: 'yz-form-field-noborder',
            style: 'border-left:solid 1px #d0d0d0;',
            flex: 2,
            minWidth: 330,
            enableKeyEvents: true,
            value: jsmCode,
            codeMirror: {
                lineNumbers: true
            }
        });
    },

    createLinkPanel: function (config) {
        config = config || {};

        var me = this,
            jsmCode = me.applyJsmCode(config.jsmCode || me.config.jsmCode);

        return Ext.create('YZSoft.src.jmap.link.LinkPanel', {
            flex: 1,
            fromTree: me.srcTree,
            toTree: me.tagTree,
            editor: me.editor,
            jsmCode: jsmCode,
            border: true
        });
    },

    mergeSection: function (newSchema, curSchema, defaultSchema, fieldName) {
        newSchema[fieldName] = curSchema[fieldName] || Ext.clone(defaultSchema[fieldName]);
        newSchema[fieldName].yzext = newSchema[fieldName].yzext || {};
        Ext.merge(newSchema[fieldName].yzext, defaultSchema[fieldName].yzext);
    },

    mergeSchema: function (tagSchema, srcSchame, fn) {
        if (!srcSchame)
            return tagSchema;

        var me = this,
            i = 1,
            key, srcValue, sourceKey;

        for (key in srcSchame) {
            srcValue = srcSchame[key];
            if (srcValue && srcValue.constructor === Object) {
                tagValue = tagSchema[key];
                if (tagValue && tagValue.constructor === Object) {
                    if (fn(srcValue)) {
                        tagSchema[key] = Ext.clone(srcValue);
                    }
                    else {
                        me.mergeSchema(tagValue, srcValue, fn)
                    }
                }
            }
        }

        return tagSchema;
    }
});