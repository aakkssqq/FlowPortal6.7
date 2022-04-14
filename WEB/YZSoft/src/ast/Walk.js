
Ext.define('YZSoft.src.ast.Walk', {
    singleton: true,
    statics: {
        skipThrough: function (node, st, c) {
            c(node, st)
        },
        ignore: function (_node, _st, _c) {
        },
        base: {
            'Program,BlockStatement': function (node, st, c) {
                Ext.each(node.Body, function (stmt) {
                    c(stmt, st, "Statement");
                });
            },
            Statement:'skipThrough',
            EmptyStatement: 'ignore',
            'ExpressionStatement,ParenthesizedExpression': function (node, st, c) {
                c(node.Expression, st, "Expression");
            },
            IfStatement: function (node, st, c) {
                c(node.Test, st, "Expression")
                c(node.Consequent, st, "Statement")
                if (node.Alternate)
                    c(node.Alternate, st, "Statement")
            },
            LabeledStatement: function (node, st, c) {
                c(node.Body, st, "Statement");
            },
            'BreakStatement,ContinueStatement': 'ignore',
            WithStatement: function (node, st, c){
                c(node.Object, st, "Expression");
                c(node.Body, st, "Statement");
            },
            SwitchStatement: function (node, st, c) {
                c(node.Discriminant, st, "Expression")
                Ext.each(node.Cases, function (cs) {
                    if (cs.Test)
                        c(cs.Test, st, "Expression");

                    Ext.each(cs.Consequent, function (cons) {
                        c(cons, st, "Statement")
                    });
                });
            },
            SwitchCase: function(node, st, c){
                if (node.Test)
                    c(node.Test, st, "Expression");

                Ext.each(node.Consequent, function (cons) {
                    c(cons, st, "Statement");
                });
            },
            'ReturnStatement,YieldExpression,AwaitExpression': function(node, st, c){
                if (node.Argument)
                    c(node.Argument, st, "Expression");
            },
            'ThrowStatement,SpreadElement': function (node, st, c) {
                c(node.Argument, st, "Expression");
            },
            TryStatement: function (node, st, c) {
                c(node.Block, st, "Statement");

                if (node.Handler)
                    c(node.Handler, st);

                if (node.Finalizer)
                    c(node.Finalizer, st, "Statement");
            },
            CatchClause: function (node, st, c) {
                if (node.Param)
                    c(node.Param, st, "Pattern");

                c(node.Body, st, "Statement");
            },
            'WhileStatement,DoWhileStatement':function(node, st, c) {
                c(node.Test, st, "Expression");
                c(node.Body, st, "Statement");
            },
            ForStatement: function(node, st, c) {
                if (node.Init)
                    c(node.Init, st, "ForInit");

                if (node.Test)
                    c(node.Test, st, "Expression");

                if (node.Update)
                    c(node.Update, st, "Expression");

                c(node.Body, st, "Statement");
            },
            'ForInStatement,ForOfStatement': function(node, st, c) {
                c(node.Left, st, "ForInit");
                c(node.Right, st, "Expression");
                c(node.Body, st, "Statement");
            },
            ForInit: function (node, st, c) {
                if (node.Type === "VariableDeclaration")
                    c(node, st);
                else
                    c(node, st, "Expression");
            },
            DebuggerStatement: 'ignore',
            FunctionDeclaration: function (node, st, c) {
                c(node, st, "Function");
            },
            VariableDeclaration: function (node, st, c) {
                Ext.each(node.Declarations, function (decl) {
                    c(decl, st);
                });
            },
            VariableDeclarator: function(node, st, c) {
                c(node.Id, st, "Pattern"); //************************
                if (node.Init)
                    c(node.Init, st, "Expression");
            },
            Function: function (node, st, c) {
                if (node.Id)
                    c(node.Id, st, "Pattern");

                Ext.each(node.Params, function (param) {
                    c(param, st, "Pattern");
                });

                c(node.Body, st, node.Expression ? "Expression" : "Statement")
            },
            Pattern: function(node, st, c) {
                if (node.Type === "Identifier")
                    c(node, st, "VariablePattern");
                else if (node.Type === "MemberExpression")
                    c(node, st, "MemberPattern");
                else
                    c(node, st);
            },
            VariablePattern: 'ignore',
            MemberPattern:'skipThrough',
            RestElement: function (node, st, c) {
                c(node.Argument, st, "Pattern");
            },
            ArrayPattern: function(node, st, c){
                Ext.each(node.Elements, function (elt) {
                    if (elt) c(elt, st, "Pattern")
                });
            },
            ObjectPattern: function(node, st, c) {
                Ext.each(node.Properties, function (prop) {
                    if (prop.Type === "Property") {
                        if (prop.Computed)
                            c(prop.Key, st, "Expression");

                        c(prop.Value, st, "Pattern");
                    }
                    else if (prop.Type === "RestElement") {
                        c(prop.Argument, st, "Pattern")
                    }
                });
            },
            Expression: 'skipThrough',
            'ThisExpression,Super,MetaProperty':'ignore',
            ArrayExpression: function (node, st, c){
                Ext.each(node.Elements, function (elt) {
                    if (elt)
                        c(elt, st, "Expression");
                });
            },
            ObjectExpression:function (node, st, c) {
                Ext.each(node.Properties, function (prop) {
                    c(prop, st);
                });
            },
            'FunctionExpression,ArrowFunctionExpression':'FunctionDeclaration',
            SequenceExpression: function (node, st, c){
                Ext.each(node.Expressions, function (expr) {
                    c(expr, st, "Expression");
                });
            },
            TemplateLiteral: function (node, st, c) {
                Ext.each(node.Quasis, function (quasi) {
                    c(quasi, st);
                });

                Ext.each(node.Expressions, function (expr) {
                    c(expr, st, "Expression");
                });
            },
            TemplateElement:'ignore',
            'UnaryExpression,UpdateExpression' : function(node, st, c){
                c(node.Argument, st, "Expression");
            },
            'BinaryExpression,LogicalExpression': function(node, st, c){
                c(node.Left, st, "Expression");
                c(node.Right, st, "Expression");
            },
            'AssignmentExpression,AssignmentPattern': function(node, st, c) {
                c(node.Left, st, "Pattern");
                c(node.Right, st, "Expression");
            },
            ConditionalExpression: function (node, st, c) {
                c(node.Test, st, "Expression");
                c(node.Consequent, st, "Expression");
                c(node.Alternate, st, "Expression");
            },
            'NewExpression,CallExpression': function (node, st, c) {
                c(node.Callee, st, "Expression");

                if (node.Arguments) {
                    Ext.each(node.Arguments, function (arg) {
                        c(arg, st, "Expression");
                    });
                }
            },
            MemberExpression: function (node, st, c) {
                c(node.Object, st, "Expression");
                if (node.Computed)
                    c(node.Property, st, "Expression");
            },
            'ExportNamedDeclaration,ExportDefaultDeclaration': function(node, st, c) {
                if (node.Declaration)
                    c(node.Declaration, st, node.Type === "ExportNamedDeclaration" || node.Declaration.Id ? "Statement" : "Expression");

                if (node.Source)
                    c(node.Source, st, "Expression");
            },
            ExportAllDeclaration: function(node, st, c) {
                c(node.Source, st, "Expression");
            },
            ImportDeclaration:function (node, st, c) {
                Ext.each(node.Specifiers, function (spec) {
                    c(spec, st);
                });

                c(node.Source, st, "Expression");
            },
            ImportExpression: function(node, st, c) {
                c(node.Source, st, "Expression")
            },
            'ImportSpecifier,ImportDefaultSpecifier,ImportNamespaceSpecifier,Identifier,Literal':'ignore',
            TaggedTemplateExpression: function(node, st, c) {
                c(node.Tag, st, "Expression");
                c(node.Quasi, st, "Expression");
            },
            'ClassDeclaration,ClassExpression': function (node, st, c) {
                c(node, st, "Class");
            },
            Class: function (node, st, c) {
                if (node.Id)
                    c(node.Id, st, "Pattern");

                if (node.SuperClass)
                    c(node.SuperClass, st, "Expression");

                c(node.Body, st);
            },
            ClassBody: function (node, st, c){
                Ext.each(node.Body, function (elt) {
                    c(elt, st);
                });
            },
            'MethodDefinition,Property': function(node, st, c) {
                if (node.Computed)
                    c(node.Key, st, "Expression");

                c(node.Value, st, "Expression");
            }
        }
    },

    simple: function (node, visitors, baseVisitor, state, override) {
        var me = this,
            baseVisitor = baseVisitor || me.self.base;

        (function c(node, st, override) {
            var type = override || node.Type,
                found = visitors[type];

            if (found)
                found(node, st)

            if (baseVisitor[type]) {
                baseVisitor[type](node, st, c);
                //Ext.log(Ext.String.format('AST walk:{0}'), type);
            }
            else {
                //Ext.log(Ext.String.format('AST walk miss:{0}'), type);
            }

        })(node, state, override);
    }
}, function (me) {
    var base = me.self.base;

    Ext.Object.each(base, function (prop, value) {
        var props = prop.split(',');

        if (Ext.isString(value))
            value = base[prop] = base[value] || me.self[value] || me[value];

        if (props.length != 1) {
            Ext.each(props, function (subprop) {
                base[subprop] = value;
            });
            delete base[prop];
        }
    });
});