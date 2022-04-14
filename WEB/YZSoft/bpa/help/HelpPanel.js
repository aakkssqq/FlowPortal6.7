
Ext.define('YZSoft.bpa.help.HelpPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: [{
                    text: '总体使用指导', path: 'SOP', leaf: true, doc: 'BPA001.html'
                }, {
                    text: '新手指导', expandable: true, expanded: true, children: [
                       { text: '新用户注册', leaf: true, doc: 'BPA00201.html' },
                       { text: '系统登录', leaf: true, doc: 'BPA00202.html' },
                       { text: '系统主界面介绍', leaf: true, doc: 'BPA00203.html' }
                   ]
                }, {
                    text: '流程架构', expandable: true, expanded: true, children: [
                       { text: '流程架构介绍', leaf: true, doc: 'BPA00301.html' },
                       { text: '流程架构示例', leaf: true, doc: 'BPA00302.html' },
                       { text: '通过关联建立流程地图', leaf: true, doc: 'BPA00303.html' }
                   ]
                }, {
                    text: '流程图', expandable: true, expanded: true, children: [
                       { text: '流程图介绍', leaf: true, doc: 'BPA00401.html' },
                       { text: 'EVC战略流程图', leaf: true, doc: 'BPA00402.html' },
                       { text: 'BPMN流程图', leaf: true, doc: 'BPA00403.html' },
                       { text: 'FlowChart流程图', leaf: true, doc: 'BPA00404.html' }
                   ]
                }, {
                    text: '流程要素', expandable: true, expanded: true, children: [
                       { text: '流程要素介绍', leaf: true, doc: 'BPA00501.html' },
                       { text: '组织结构', leaf: true, doc: 'BPA00502.html' },
                       { text: '制度', leaf: true, doc: 'BPA00503.html' },
                       { text: '风险控制', leaf: true, doc: 'BPA00504.html' },
                       { text: 'KPI', leaf: true, doc: 'BPA00505.html' },
                       { text: '产品', leaf: true, doc: 'BPA00506.html' },
                       { text: '数据', leaf: true, doc: 'BPA00507.html' },
                       { text: 'IT系统', leaf: true, doc: 'BPA00508.html' },
                       { text: '流程与流程要素关联', leaf: true, doc: 'BPA00509.html' }
                   ]
                }, {
                    text: '流程报告', expandable: true, expanded: true, children: [
                       { text: '流程报告介绍', leaf: true, doc: 'BPA00601.html' },
                       { text: '生成报告', leaf: true, doc: 'BPA00602.html' },
                       { text: '添加现有报告', leaf: true, doc: 'BPA00603.html' },
                       { text: '报告模板管理', leaf: true, doc: 'BPA00604.html' }
                   ]
                }, {
                    text: '决策支持', expandable: true, expanded: true, children: [
                       { text: '决策支持介绍', leaf: true, doc: 'BPA00701.html' },
                       { text: 'BPM系统中关联BPA流程', leaf: true, doc: 'BPA00702.html' },
                       { text: 'BPM审批时查看决策辅助信息', leaf: true, doc: 'BPA00703.html' },
                       { text: '查看流程作业指南', leaf: true, doc: 'BPA00704.html' }
                   ]
                }, {
                    text: '企业流程库', expandable: true, expanded: true, children: [
                       { text: '企业流程库介绍', leaf: true, doc: 'BPA00801.html' },
                       { text: '查看流程库', leaf: true, doc: 'BPA00802.html' },
                       { text: '查看某一流程详细信息', leaf: true, doc: 'BPA00803.html' }
                   ]
                }, {
                    text: '岗位职责', expandable: true, expanded: true, children: [
                       { text: '岗位职责介绍', leaf: true, doc: 'BPA00901.html' },
                       { text: '添加岗位', leaf: true, doc: 'BPA00902.html' },
                       { text: '岗位知识中心', leaf: true, doc: 'BPA00903.html' }
                   ]
                }, {
                    text: '流程小组', expandable: true, expanded: true, children: [
                       { text: '流程小组介绍', leaf: true, doc: 'BPA01001.html' },
                       { text: '新建小组', leaf: true, doc: 'BPA01002.html' },
                       { text: '小组作业空间', leaf: true, doc: 'BPA01003.html' },
                       { text: '小组交流', leaf: true, doc: 'BPA01004.html' },
                       { text: '成员管理', leaf: true, doc: 'BPA01005.html' }
                   ]
                }, {
                    text: '社交协作', expandable: true, expanded: true, children: [
                       { text: '社交协作介绍', leaf: true, doc: 'BPA01101.html' },
                       { text: '小组动态', leaf: true, doc: 'BPA01102.html' },
                       { text: '流传开发协作', leaf: true, doc: 'BPA01103.html' },
                       { text: '流程学习交流', leaf: true, doc: 'BPA01104.html' }
                   ]
                }, {
                    text: '文档库', expandable: true, expanded: true, children: [
                       { text: '文档库介绍', leaf: true, doc: 'BPA01201.html' },
                       { text: '新建文档库', leaf: true, doc: 'BPA01202.html' },
                       { text: '设置集团、公司、部门文档库权限', leaf: true, doc: 'BPA01203.html' },
                       { text: '建立目录添加文档', leaf: true, doc: 'BPA01204.html' },
                       { text: '更新文档', leaf: true, doc: 'BPA01205.html' }
                   ]
                }, {
                    text: '权限管控', expandable: true, expanded: true, children: [
                       { text: '权限管控介绍', leaf: true, doc: 'BPA01301.html' },
                       { text: '模块权限', leaf: true, doc: 'BPA01302.html' },
                       { text: '库权限', leaf: true, doc: 'BPA01303.html' },
                       { text: '目录权限', leaf: true, doc: 'BPA01304.html' },
                       { text: '小组权限', leaf: true, doc: 'BPA01305.html' },
                   ]
                }, {
                    text: '流程全景', leaf: true, doc: 'BPA014.html'
                }, {
                    text: '流程统计', leaf: true, doc: 'BPA015.html'
                }, {
                    text: '系统管理', expandable: true, expanded: true, children: [
                       { text: '报告模板', leaf: true, doc: 'BPA01601.html' },
                       { text: '流程模板', leaf: true, doc: 'BPA01602.html' },
                       { text: '小组', leaf: true, doc: 'BPA01603.html' },
                       { text: '模块权限', leaf: true, doc: 'BPA01604.html' }
                   ]
                }, {
                    text: '回收站', expandable: true, expanded: true, children: [
                       { text: '普通员工', leaf: true, doc: 'BPA01701.html' },
                       { text: '管理员', leaf: true, doc: 'BPA01702.html' }
                   ]
                }, {
                    text: '常见问题', leaf: true, doc: 'BPA018.html'
                }]
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            cls: 'yz-tree-modules',
            border: false,
            store: me.store,
            rootVisible: false,
            useArrows: true,
            hideHeaders: true,
            cls: 'bpa-tree-help',
            listeners: {
                scope: me,
                beforeselect: function (sm, record, index, eOpts) {
                    if (!record.data.doc)
                        return false;
                },
                selectionchange: function (sm, selected, eOpts) {
                    var me = this,
                        cnt = me.pnlModule,
                        rec = selected[0],
                        doc = rec && rec.data.doc;

                    if (!doc)
                        return;

                    me.showHelpFile(rec);
                }
            }
        });

        me.tree.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    sm = this.getSelectionModel();

                sm.select(root.firstChild);
            }
        });

        me.pnlMenu = Ext.create('Ext.panel.Panel', {
            title: '导航',
            border: false,
            header: false,
            width: 320,
            region: 'west',
            layout: 'fit',
            split: {
                cls: 'yz-splitter-light',
                size: 4,
                collapsible: true
            },
            style: 'background-color:#fff;',
            items: [me.tree],
            listeners: {
                element: 'body',
                contextmenu: function (e, t, eOpts) {
                    e.preventDefault();
                }
            }
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer',
            style:'background-color:#fff',
            padding: 10
        });

        cfg = {
            layout: 'border',
            items: [me.pnlMenu, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    showHelpFile: function (record) {
        var me = this,
            cnt = me.pnlModule,
            doc = record.data.doc;

        cnt.showModule({
            xclass: 'YZSoft.src.panel.IFramePanel',
            config: {
                url: YZSoft.$url(me, 'docs/' + doc),
                autoLoad: true,
                border: false,
                doc: doc
            },
            match: function (item) {
                return item.doc == doc;
            }
        });
    }
});