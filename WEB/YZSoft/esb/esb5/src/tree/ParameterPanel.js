Ext.define('YZSoft.esb.esb5.src.tree.ParameterPanel', {
    extend: 'Ext.tree.Panel',
    rootVisible: false, //隐藏根节点
    useArrows: true,
    xtype: 'tree-grid',
    constructor: function (config) {
        var me = this;
        var cfg = {
            plugins: cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            store: config.store,
            columns: [{
                xtype: 'treecolumn',
                text: RS.$('All_ColumnName'),
                dataIndex: 'columnName',
                flex: 2
            },{
                text: RS.$('All_ColumnType'),
                dataIndex: 'columnType',
                flex: 2
            },{
                text: RS.$('All_Rename'),
                dataIndex: 'rename',
                editor: true,
                flex: 2
            },{
                text: RS.$('All_Value'),
                dataIndex: 'defaultValue',
                editor: true,
                flex: 4
            },{
                hideable: false,
                sortable: false,
                xtype: 'checkcolumn',
                header: RS.$('All_SetAsDefault'),
                dataIndex: 'isShow',
                flex: 1,
                renderer: function (val, m, rec) {
                    return (new Ext.grid.column.CheckColumn).renderer(val);
                },
                listeners: {
                    scope: this,
                    checkchange: function (cloumn, rowIndex, checked, eOpts) {
                        me.onClicked(rowIndex);
                    }
                }
            }],
            listeners: {
                //在发生编辑事件时触发，如果有子节点则该节点不可以编辑
                beforeedit: function (editor, e) {
                    if (e.record.data.seedList == null) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        };
        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },
    onClicked: function (index) {
        var me = this;
        var treeItem = me.getView().getStore().data.items;
        //获取触发事件的行
        var node = treeItem[index];
        var parentNode = node.parentNode;
        //复选框事件
        if (node.data.isShow == true) {
            //被勾选(如果有父节点，则逐级勾选父节点)
            me.onChonsenCheck(treeItem, node);
        }
        else {
            //取消勾选(如果拥有子节点则取消子节点的选中)
            if (node.childNodes.length > 0) {
                Ext.each(node.childNodes, function (item) {
                    item.data.isShow = false;  //取消其他节点勾选
                });
            }
        }
        //刷新视图
        me.getView().refresh();
    },
    //当一个节点被勾选的时候执行
    onChonsenCheck: function (treeItem, node) {
        var me = this;
        if (node.childNodes.length > 0) {     //当勾选节点拥有子节点时
            Ext.each(treeItem, function (item) {
                if (item != node) {
                    item.data.isShow = false;  //取消其他节点勾选
                }
            });
        }
        //逐级勾选父节点
        me.onChonsenParent(node);
    },
    //逐级勾选父节点
    onChonsenParent: function (node) {
        var me = this;
        var parentNode = node.parentNode;
        if (parentNode != null) {
            parentNode.data.isShow = true;
            me.onChonsenParent(parentNode);
        }
    },
    //当一个节点被取消勾选的时候执行
    onCancelCheck: function (node) {
        var me = this;
        var childNodes = node.childNodes;
        if (childNodes.length > 0) {  //当该节点有子节点时，取消子节点的勾选
            Ext.each(childNodes, function (item) {
                item.data.isShow = false;
                me.onCancelCheck(item);
            });
        }
    }
});