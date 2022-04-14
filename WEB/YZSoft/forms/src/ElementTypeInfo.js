Ext.define('YZSoft.forms.src.ElementTypeInfo', {
    extend: 'Ext.Evented',
    ExpressTypes: [
        { name: 'value', define: 'Express' },
        { name: 'disable', define: 'DisableExpress' },
        { name: 'hide', define: 'HiddenExpress' }
    ],

    constructor: function (agent, xel) {
        var me = this,
            eleTypeConfig = xel.getEleTypeConfig ? xel.getEleTypeConfig(me) : null;

        me.agent = agent;

        if (eleTypeConfig) {
            Ext.apply(me, eleTypeConfig);

            me.isValid = true;
            me.Len = xel.getLen();
            me.NodeType = YZSoft.XForm.NodeType.Element;
            me.xel = xel;
            me.path = null;
            me.Orders = null;
            me.NoCopy = me.NoCopy || xel.getAttributeBool('NoCopy', false);

            me.DataSource = xel.parseDataSource(eleTypeConfig.sDataSource, me, eleTypeConfig.DataSource);
            me.DataMap = xel.parseMap(me.sDataMap, me);

            me.compile(xel);
            return;
        }
    },

    compile: function (xel) {
        var me = this;

        me.affectFrom = null;

        for (var i = 0; i < me.ExpressTypes.length; i++) {
            var expType = me.ExpressTypes[i];

            var parser = Parser.parse(me[expType.define]);
            var expvars = parser ? parser.variables() : null;
            if (parser) {
                me.Expresses = me.Expresses || {};
                me.Expresses[expType.name] = { name: expType.name, type: expType, vars: me.agent.toVarArray(xel, expvars), parser: parser };
            }
        }
    },

    getPath: function () {
        if (this.path == null)
            this.path = this.agent.getPath(this);

        return this.path;
    },

    canWrite: function () {
        return !(this.DataBind && this.DataBind.DataColumn && this.DataBind.DataColumn.Writeable === false)
    }
});
