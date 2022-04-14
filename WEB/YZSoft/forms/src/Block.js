
Ext.define('YZSoft.forms.src.Block', {

    constructor: function (agent) {
        var me = this;

        me.agent = agent;
        me.NodeType = YZSoft.XForm.NodeType.Block;
        me.Eles = [];
        me.path = null;

        me.callParent(arguments);
    },

    getBlockID: function () {
        this._id = this._id || this.agent.getSeek('BlockID');
        return this._id;
    },

    getPath: function () {
        if (this.path == null)
            this.path = this.agent.getPath(this);

        return this.path;
    },

    toETBlock: function () {
        if (this.ParentElement)
            return this.ParentElement.getEleType().Blocks[0];
        else
            return this.agent.ETRootBlock;
    },

    calcExpress: function (express) {
        var me = this,
            parser = Parser.parse(express),
            expvars = parser ? parser.variables() : null,
            exp = { vars: me.agent.toVarArray(null, expvars, false), parser: parser };

        var path = me.toETBlock().getPath().concat(0);
        for (var i = 0; i < exp.vars.length; i++) {
            var vr = exp.vars[i];
            if (!vr.def.memvar)
                vr.path = me.agent.toRelativePath(path, vr.def.elType.getPath());
        }

        var xel = new YZSoft.forms.field.Element(me.agent);
        xel.ParentBlock = me;
        var rv = xel.calcExpress(exp);
        return rv;
    }
});
