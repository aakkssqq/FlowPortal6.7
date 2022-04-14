
Ext.define('YZSoft.src.form.field.codemirror.Abstract', {
    extend: 'Ext.form.field.TextArea',
    codeMirror: {
        listeners: null
    },
    config: {
        syntaxError:null
    },

    constructor: function (config) {
        var me = this;

        me.codeMirror = Ext.apply({}, config.codeMirror, me.codeMirror);
        delete config.codeMirror;

        me.callParent(arguments);

        me.on({
            scope: me,
            resize: 'onResize'
        });
    },

    onRender: function () {
        var me = this,
            codeMirrorListeners = me.codeMirror && me.codeMirror.listeners,
            err = me.getSyntaxError();

        me.callParent();

        me.codeEditor = CodeMirror.fromTextArea(me.inputEl.dom, Ext.apply({}, me.codeMirror));
        me.el.down('.CodeMirror').setStyle({
            position:'absolute'
        });

        if (err)
            me.updateSyntaxError(err);

        me.onCodeMirror(codeMirrorListeners);
        me.fireEvent('editorCreated', me.codeEditor);
    },

    initEvents: function () {
        var me = this,
            el = me.inputEl;

        me.callParent();

        me.onCodeMirror({
            scope: me,
            change: function (codemirror, changeObj) {
                me.fireEvent('change', me, me.getValue(), '');
            },
            keyup: function (codemirror, e) {
                me.fireEvent('keyup', me, e);
            },
            keydown: function (codemirror, e) {
                me.fireEvent('keydown', me, e);
            },
            keypress: function (codemirror, e) {
                me.fireEvent('keypress', me, e);
            },
            paste: function (codemirror, e) {
                me.fireEvent('paste', me, e);
            }
        });
    },

    onCodeMirror: function (listeners) {
        var me = this,
            scope = (listeners && listeners.scope) || me;

        if (me.codeEditor) {
            Ext.Object.each(listeners, function (eventName, fn) {
                if (eventName == 'scope')
                    return;

                if (Ext.isString(fn))
                    value = scope[fn];

                me.codeEditor.on(eventName, fn);
            });
        }
        else {
            me.on('editorCreated', function () {
                me.onCodeMirror(listeners);
            });
        }
    },

    updateSyntaxError: function (err) {
        var me = this,
            codeEditor = me.codeEditor,
            doc = codeEditor && codeEditor.doc;

        if (!doc)
            return;

        Ext.each(doc.getAllMarks(), function (mask) {
            mask.clear();
        });

        doc.eachLine(function (line) {
            doc.removeLineClass(line, 'wrap', 'yz-syntax-error');
        });

        if (!err)
            return;

        doc.addLineClass(err.LineNumber - 1, 'wrap', 'yz-syntax-error');
        doc.markText({
            line: err.LineNumber - 1,
            ch: 0
        }, {
            line: err.LineNumber - 1,
            ch: 1000
        }, {
            title: err.Description
        });
    },

    getValue: function () {
        var me = this;

        if (me.codeEditor) 
            return me.codeEditor.getValue();
        else
            return me.callParent(arguments);
    },

    setValue: function (value) {
        var me = this;

        if (me.codeEditor) 
            me.codeEditor.setValue(value);
        else
            me.callParent(arguments);
    },

    onResize: function () {
        var me = this,
            size = me.bodyEl.getSize();

        me.codeEditor.setSize(size.width, size.height);
    }
});