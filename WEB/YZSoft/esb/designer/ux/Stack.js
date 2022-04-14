
Ext.define('YZSoft.esb.designer.ux.Stack', {
    constructor: function (config) {
        var me = this;

        me.variables = [];
        me.indexs = [];

        me.callParent(arguments);
    },

    pushBlock: function () {
        var me = this;
        me.indexs.push(me.variables.length);
    },

    popBlock: function () {
        var me = this,
            lastIndex = me.indexs.pop();

        me.variables.splice(lastIndex);
    },

    push: function (varName, varDefine, readOnly) {
        var me = this,
            variable;

        variable = {
            name: varName,
            define: varDefine,
            readOnly: readOnly === true
        };

        Ext.Array.push(me.variables, variable);
    },

    getVariables: function (readOnly) {
        var me = this,
            properties = {};

        Ext.each(me.variables, function (variable) {
            if (!readOnly || !variable.readOnly)
                properties[variable.name] = variable.define
        });

        return {
            type: 'object',
            properties: properties
        };
    },

    destroy: function () {
        if (this.variables)
            delete this.variables;
        if (this.indexs)
            delete this.indexs
    }
});