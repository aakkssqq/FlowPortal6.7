
Ext.define('YZSoft.src.ast.ParamsParser', {
    singleton: true,

    parse: function (node) {
        var me = this;
        return Ext.Array.from(me.parseExpression(node));
    },

    parseExpression: function (node) {
        var me = this;

        switch (node.Type) {
            case 'Identifier': //ddd: payload.Purchase.Amount
                return me.parseIdentifier(node);
            case 'MemberExpression': //ddd: payload.Purchase.Amount
                return me.parseMemberExpression(node);
            case 'BinaryExpression': //ddd: payload.Purchase.Price*ddd: payload.Purchase.Qty
                return me.parseBinaryExpression(node);
            case 'CallExpression': //ddd: aaa(payload.Purchase.Price,payload.Purchase.Qty)
                return me.parseCallExpression(node);
            case 'ConditionalExpression': //ddd: (a? 1:payload.Purchase.Amount),\
                return me.parseConditionalExpression(node);
            case 'LogicalExpression': //eee: payload.Purchase.Amount&&payload.Purchase.Price,
                return me.parseLogicalExpression(node);
            case 'UpdateExpression': //fff: ++payload.Purchase.Amount,
                return me.parseUpdateExpression(node);
            case 'UnaryExpression': //ggg: -payload.Purchase.Amount,
                return me.parseUnaryExpression(node);
        }
    },

    parseIdentifier:function (node) {
        return node.Name;
    },

    parseMemberExpression:function(node) {
        var me = this,
            objectName = me.parseExpression(node.Object);

        return Ext.String.format('{0}.{1}', objectName, node.Property.Name);
    },

    parseBinaryExpression: function (node) {
        var me = this,
            left = Ext.Array.from(me.parseExpression(node.Left)),
            right = Ext.Array.from(me.parseExpression(node.Right)),
            rv = [];

        Ext.Array.push(rv, left);
        Ext.Array.push(rv, right);

        return rv;
    },

    parseCallExpression: function (node) {
        var me = this,
            rv = [];

        Ext.each(node.Arguments, function (arg) {
            Ext.Array.push(rv, Ext.Array.from(me.parseExpression(arg)));
        });

        return rv;
    },

    parseConditionalExpression: function (node) {
        var me = this,
            test = Ext.Array.from(me.parseExpression(node.Test)),
            consequent = Ext.Array.from(me.parseExpression(node.Consequent)),
            alternate = Ext.Array.from(me.parseExpression(node.Alternate)),
            rv = [];

        Ext.Array.push(rv, test);
        Ext.Array.push(rv, consequent);
        Ext.Array.push(rv, alternate);

        return rv;
    },

    parseLogicalExpression: function (node) {
        var me = this,
            left = Ext.Array.from(me.parseExpression(node.Left)),
            right = Ext.Array.from(me.parseExpression(node.Right)),
            rv = [];

        Ext.Array.push(rv, left);
        Ext.Array.push(rv, right);

        return rv;
    },

    parseUpdateExpression: function (node) {
        var me = this,
            argument = Ext.Array.from(me.parseExpression(node.Argument)),
            rv = [];

        Ext.Array.push(rv, argument);

        return rv;
    },

    parseUnaryExpression: function (node) {
        var me = this,
            argument = Ext.Array.from(me.parseExpression(node.Argument)),
            rv = [];

        Ext.Array.push(rv, argument);

        return rv;
    }
});