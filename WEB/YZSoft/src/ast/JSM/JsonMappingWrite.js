
Ext.define('YZSoft.src.ast.JSM.JsonMappingWrite', {
    extend: 'Ext.Evented',
    requires: [
        'YZSoft.src.ast.JSM.JsonMappingReader',
        'YZSoft.src.file.Reader'
    ],
    js: null,
    ast: null,
    rootNode: null,
    tabSpace: '\t',

    constructor: function (config) {
        this.json = YZSoft.src.ast.JSM.JSM2JsonConvert.convert(config.ast);
        this.callParent(arguments);
    },

    addMap: function (from, to, forceCopy, fn) {
        var me = this,
            existRootPath = YZSoft.src.ast.JSM.JsonMappingReader.findExistRootPath(me.json, me.getPath(to)),
            parentJsonNode;

        //属性已存在
        if (existRootPath.length == to.length) {
            existRootPath.pop();

            //me.doReplaceMap(existRootPath, from, to.slice(existRootPath.length), fn);
            me.doAddMap(existRootPath, from, to.slice(existRootPath.length), forceCopy, fn);
        }
        else {
            parentJsonNode = YZSoft.src.ast.JSM.JsonMappingReader.getNode(me.json, existRootPath);
            if (parentJsonNode.isProperty)
                existRootPath.pop();

            me.doAddMap(existRootPath, from, to.slice(existRootPath.length), forceCopy, fn);
        }
    },

    doAddMap: function (path, from, to, forceCopy, fn) {
        var me = this,
            parentTreeNode = me.rootNode.getChildByPath(path),
            insertPropertyName = to[0].name,
            lines, newjs;

        YZSoft.src.ast.JSM.JsonMappingReader.walkto(me.json, path, function (parentJsonNode, vars, ancestors) {

            if (parentJsonNode.objectVar) {
                vars.push({
                    src: parentJsonNode.src,
                    objectVar: parentJsonNode.objectVar
                });
            }
            ancestors.push(parentJsonNode);

            lines = me.getMapCode(parentJsonNode, vars, ancestors, from, to, forceCopy);
            newjs = me.insertOrReplacePropertyCode(me.js, lines, parentTreeNode, insertPropertyName, parentJsonNode);

            fn && fn(newjs);
        });
    },

    getMapCode: function (node, vars, ancestors, from, to, forceCopy, index) {
        forceCopy = forceCopy === true;
        index = index || 0;

        var me = this,
            realTo = to[index],
            peerArrayIndex,
            rv;

        if (to.length - 1 == index) { //最终映射项
            if (forceCopy) {
                rv = me.getLeafMapCodeSimpleType(node, vars, ancestors, from, to, index);
            }
            else {
                switch (realTo.schema.type) {
                    case 'string':
                    case 'number':
                    case 'integer':
                    case 'boolean':
                    case 'null':
                        rv = me.getLeafMapCodeSimpleType(node, vars, ancestors, from, to, index);
                        break;
                    case 'object':
                        rv = me.getLeafMapCodeObject(node, vars, ancestors, from, to, index);
                    case 'array':
                        if (me.isSingleObjectArray(realTo.schema)) { //Single Object Array
                            rv = me.getLeafMapCodeSingleObjectArray(node, vars, ancestors, from, to, index);
                        }
                        else if (me.isTuple(realTo.schema)) {  //Tuple
                            rv = me.getLeafMapCodeTuple(node, vars, ancestors, from, to, index);
                        }
                        else { //Simple Type Array
                            rv = me.getLeafMapCodeSimpleTypeArray(node, vars, ancestors, from, to, index);
                        }
                        break;
                }
            }
        }
        else { //中间映射项
            switch (realTo.schema.type) {
                case 'object':
                    rv = me.getIntermediateMapCodeObject(node, vars, ancestors, from, to, index);
                    break;
                case 'array':
                    peerArrayIndex = me.getPeerArrayIndex(vars, from, to, index);
                    if (peerArrayIndex == -1)
                        rv = me.getIntermediateMapCodeArrayNoPeer(node, vars, ancestors, from, to, index);
                    else
                        rv = me.getIntermediateMapCodeArray(node, vars, ancestors, from, peerArrayIndex, to, index);
                    break;
            }
        }

        rv = Ext.Array.from(rv);
        return rv;
    },

    getLeafMapCodeForAppend: function (vars, from, to) {
        var me = this;

        return me.toLocalVar(me.getPath(from).join('.'), vars);
    },

    getLeafMapCodeSimpleType: function (node, vars, ancestors, from, to, index) {
        var me = this;

        return me.toLocalVar(me.getPath(from).join('.'), vars);
    },

    getLeafMapCodeObject: function (node, vars, ancestors, from, to, index) {
        var me = this;

        return me.toLocalVar(me.getPath(from).join('.'), vars);
    },

    getLeafMapCodeSingleObjectArray: function (node, vars, ancestors, from, to, index) {
        var me = this,
            realFrom = from[from.length - 1],
            realTo = to[to.length - 1];

        if (me.isSingleObjectArray(realFrom.schema)) {
            var lines = [],
                fromVar = me.toLocalVar(me.getPath(from).join('.'), vars),
                uniLocalVarName = me.getUniqueLocalVar(vars, realFrom.name),
                fromLocalVar = Ext.String.uncapitalize(uniLocalVarName),
                indexVar = 'indexOf' + uniLocalVarName;

            lines.push(Ext.String.format('map({0}, function ({1}, {2}) {', fromVar, fromLocalVar, indexVar));
            lines.push(me.indentStr(1) + 'return {');
            lines.push(me.indentStr(1) + '};');
            lines.push('})');

            return lines;
        }

        return me.toLocalVar(me.getPath(from).join('.'), vars);
    },

    getLeafMapCodeTuple: function (node, vars, ancestors, from, to, index) {
        var me = this;

        return me.toLocalVar(me.getPath(from).join('.'), vars);
    },

    getLeafMapCodeSimpleTypeArray: function (node, vars, ancestors, from, to, index) {
        var me = this;

        return me.toLocalVar(me.getPath(from).join('.'), vars);
    },

    getIntermediateMapCodeObject: function (node, vars, ancestors, from, to, index) {
        var me = this,
            thisNode = to[index],
            nextNode = to[index+1],
            lines = [],
            clines;

        lines.push('{');

        clines = me.getMapCode(node, vars, ancestors, from, to, false, index + 1);
        clines[0] = Ext.String.format('{0}: {1}', me.encodePropertyName(nextNode.name), clines[0]);
        clines = me.indent(clines, true);

        Ext.Array.push(lines, clines);

        lines.push('}');

        return lines;
    },

    getIntermediateMapCodeArray: function (node, vars, ancestors, from, fromIndex, to, index) {
        var me = this,
            thisNode = to[index],
            nextNode = to[index + 1],
            lines = [],
            fromVar = me.toLocalVar(me.getPath(from, fromIndex).join('.'), vars),
            uniLocalVarName = me.getUniqueLocalVar(vars, from[fromIndex].name),
            fromLocalVar = Ext.String.uncapitalize(uniLocalVarName),
            indexVar = 'indexOf' + uniLocalVarName,
            clines;

        lines.push(Ext.String.format('map({0}, function ({1}, {2}) {', fromVar, fromLocalVar, indexVar));
        lines.push(me.indentStr(1) + 'return {');

        vars.push({
            src: fromVar,
            objectVar: fromLocalVar
        });

        clines = me.getMapCode(node, vars, ancestors, from, to, false, index + 1);
        clines[0] = Ext.String.format('{0}: {1}', me.encodePropertyName(nextNode.name), clines[0]);
        clines = me.indent(clines, 2);

        Ext.Array.push(lines, clines);

        vars.pop();

        lines.push(me.indentStr(1) + '};');
        lines.push('})');

        return lines;
    },

    getIntermediateMapCodeArrayNoPeer: function (node, vars, ancestors, from, to, index) {
        var me = this,
            thisNode = to[index],
            nextNode = to[index + 1],
            lines = [],
            clines;

        lines.push('[{');

        clines = me.getMapCode(node, vars, ancestors, from, to, false, index + 1);
        clines[0] = Ext.String.format('{0}: {1}', me.encodePropertyName(nextNode.name), clines[0]);
        clines = me.indent(clines, true);

        Ext.Array.push(lines, clines);

        lines.push('}]');

        return lines;
    },

    deleteProperty: function (path, fn) {
        var me = this,
            newjs, prevNode, nextNode, parentNode, st, end;

        YZSoft.src.ast.JSM.JsonMappingReader.walkto(me.json, path, function (node, vars, ancestors) {
            prevNode = YZSoft.src.ast.JSM.JsonMappingReader.getPrevNode(me.json, path);
            nextNode = YZSoft.src.ast.JSM.JsonMappingReader.getNextNode(me.json, path);

            if (prevNode) {
                st = prevNode.propertyNode.Range[1];
                end = node.propertyNode.Range[1];
            }
            else if (nextNode) {
                st = node.propertyNode.Range[0];
                end = nextNode.propertyNode.Range[0];
            }
            else {
                parentNode = YZSoft.src.ast.JSM.JsonMappingReader.getParentNode(me.json, path);
                st = parentNode.node.Range[0] + 1;
                end = node.propertyNode.Range[1];
            }

            newjs = me.js.substr(0, st) + me.js.substr(end);
            fn && fn(newjs);
        });
    },

    /******************代码插入******************/
    insertOrReplacePropertyCode: function (js, insertLines, parentTreeNode, insertPropertyName, parentJsonNode) {
        insertLines = Ext.Array.from(insertLines);

        var me = this,
            lines = [],
            tagNode = parentJsonNode.children && parentJsonNode.children[insertPropertyName],
            prevNode = me.findInsertPrevNode(parentTreeNode, insertPropertyName, parentJsonNode),
            nextNode, insertPos, newjs, reader;

        if (tagNode) {
            Ext.Array.push(lines, insertLines);

            indent = me.getNodeIndent(parentJsonNode);
            lines = me.indent(lines, indent + me.getChildIndent(parentJsonNode), 1);

            reader = Ext.create('YZSoft.src.file.Reader', {
                text: js
            });

            if (tagNode.isMap) {
                if (Ext.String.startsWith(lines[0], 'map(' + tagNode.src + ',')) { //新的map src和已存在的map相同
                    newjs = js;
                }
                else {
                    newjs = reader.replaceRange(tagNode.callMapNode.Location, lines.join('\r\n'));
                }
            }
            else if (tagNode.isArray)
                newjs = reader.replaceRange(tagNode.arrayNode.Location, lines.join('\r\n'));
            else
                newjs = reader.replaceRange(tagNode.node.Location, lines.join('\r\n'));
        }
        else {
            insertLines[0] = Ext.String.format('{0}: {1}', me.encodePropertyName(insertPropertyName), insertLines[0]);
            insertPos = -1;

            if (prevNode) {
                lines.push(',');
                Ext.Array.push(lines, insertLines);

                indent = me.getNodeIndent(parentJsonNode);
                lines = me.indent(lines, indent + me.getChildIndent(parentJsonNode), 1);

                insertPos = prevNode.propertyNode.Range[1];
            }
            else if (parentJsonNode.isMap && !parentJsonNode.node) //map 没有return
            {
                lines.push('return {');

                insertLines = me.indent(insertLines, 1);
                Ext.Array.push(lines, insertLines);

                lines.push('}');

                indent = me.getNodeIndent(parentJsonNode);
                lines = me.indent(lines, indent + me.getChildIndent(parentJsonNode));

                lines[0] = '\r\n' + lines[0];

                nextNode = me.findInsertNextNode(parentTreeNode, insertPropertyName, parentJsonNode);
                if (nextNode)
                    lines[lines.length - 1] += ',';

                insertPos = parentJsonNode.callMapNode.Arguments[1].Body.Range[0] + 1;
            }
            else {
                Ext.Array.push(lines, insertLines);

                indent = me.getNodeIndent(parentJsonNode);
                lines = me.indent(lines, indent + me.getChildIndent(parentJsonNode));

                lines[0] = '\r\n' + lines[0];

                nextNode = me.findInsertNextNode(parentTreeNode, insertPropertyName, parentJsonNode);
                if (nextNode)
                    lines[lines.length - 1] += ',';

                if (parentJsonNode.node && parentJsonNode.node.Range[0])
                    insertPos = parentJsonNode.node.Range[0] + 1;
            }

            if (insertPos == -1) {
                var lines1 = [];
                if (js)
                    lines1.push(js);

                lines1.push('var $result = {' + lines.join('\r\n'));
                lines1.push('}');

                newjs = lines1.join('\r\n');
            }
            else {
                newjs = Ext.String.insert(js, lines.join('\r\n'), insertPos);
            }
        }

        return newjs;
    },

    getNodeIndent: function (node) {
        if (node.isRoot)
            return 0;

        var me = this,
            loc = node.propertyNode.Location.Start,
            space = Ext.String.repeat(' ', 4),
            reader, headerSpace;

        reader = Ext.create('YZSoft.src.file.Reader', {
            text: me.js
        });

        headerSpace = reader.getLineContent(loc.Line - 1, loc.Column, 0).replace(/\t/g, space);
        return Math.round(headerSpace.length / 4);
    },

    getChildIndent: function (parentNode) {
        return parentNode.isMap ? 2 : 1;
    },

    findInsertPrevNode: function (treeNode, propertyName, jsonNode) {
        var me = this,
            index1 = treeNode.indexOfProperty(propertyName),
            index2, prevNode;

        Ext.Object.each(jsonNode.children, function (jPropertyName, jNode) {
            index2 = treeNode.indexOfProperty(jPropertyName);

            if (index2 != -1 && index2 > index1)
                return false;

            prevNode = jNode;
        });

        return prevNode;
    },

    findInsertNextNode: function (treeNode, propertyName, jsonNode) {
        var me = this,
            index1 = treeNode.indexOfProperty(propertyName),
            index2, nextNode;

        Ext.Object.each(jsonNode.children, function (jPropertyName, jNode) {
            index2 = treeNode.indexOfProperty(jPropertyName);

            if (index2 != -1 && index2 > index1) {
                nextNode = jNode;
                return false;
            }
        });

        return nextNode;
    },

    encodePropertyName: function (name) {
        return name;
    },

    indent: function (lines, indent, start, end) {
        start = start || 0;
        end = end || lines.length - 1;

        var me = this,
            lines = Ext.Array.from(lines),
            indentStr = me.indentStr(indent),
            rv = [];

        Ext.each(lines, function (line, index) {
            if (index >= start && index <= end)
                rv.push(indentStr + line);
            else
                rv.push(line);
        });

        return rv;
    },

    indentStr: function (indent) {
        var me = this,
            indent = indent === true ? 1 : indent || 0;

        return Ext.String.repeat(me.tabSpace, indent);
    },

    /******************基本函数******************/
    getPath: function (to, index) {
        var rv = [];

        if (!index && index !== 0) {
            index = to.length - 1;
        }

        for (var i = 0; i <= index; i++)
            rv.push(to[i].name);

        return rv;
    },

    getPeerArrayIndex: function (vars, from, to, index) {
        var me = this,
            fromIndex = me.findNoMappedFromIndex(vars, from);

        return me.indexOfFirstMappableArray(from,fromIndex);
    },

    indexOfFirstMappableArray: function (from, index) {
        var me = this;

        for (var i = index; i < from.length; i++) {
            if (me.isArray(from[i].schema))
                return i;
        }

        return -1;
    },

    isSingleObjectArray: function (jsonSchemaNode) {
        var items = Ext.Array.from(jsonSchemaNode.items);

        return jsonSchemaNode.type == 'array' && items.length == 1 && items[0].type == 'object';
    },

    isArray: function (jsonSchemaNode) {
        var items = Ext.Array.from(jsonSchemaNode.items);

        return jsonSchemaNode.type == 'array';
    },

    isTuple: function (jsonSchemaNode) {
        return jsonSchemaNode.type == 'array' && Ext.isArray(jsonSchemaNode.items);
    },

    findNoMappedFromIndex: function (vars, from) {
        if (vars.length == 0)
            return 0;

        var me = this,
            lastVarPath = me.toLocalVar(vars[vars.length - 1].src).split('.');

        for (var i = 0; i < from.length; i++) {
            if (i >= lastVarPath.length ||
                from[i].name != lastVarPath[i])
                return i;
        }
    },

    getUniqueLocalVar: function (vars, varname) {
        var vname = varname,
            i = 0;

        while (true) {
            if (!Ext.Array.findBy(vars, function (v) {
                return v.objectVar.toLowerCase() == vname.toLowerCase();
            }))
                break;

            i++;
            vname = varname + i.toString();
        }

        return vname;
    },

    toLocalVar: function (memberExpress, vars) {
        Ext.each(vars, function (var1) {
            if (memberExpress == var1.src)
                memberExpress = var1.objectVar || '';

            if (Ext.String.startsWith(memberExpress, var1.src + '.'))
                memberExpress = (var1.objectVar || '') + memberExpress.substring(var1.src.length);
        });

        return memberExpress;
    }
});