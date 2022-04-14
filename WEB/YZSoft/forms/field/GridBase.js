
Ext.define('YZSoft.forms.field.GridBase', {
    extend: 'YZSoft.forms.field.Element',
    requires: [
        'YZSoft.forms.src.Block'
    ],
    isGrid: true,

    inheritableStatics: {
        MenuDock: {
            Left: 1,
            Right: 2
        }
    },

    statics: {
        gap: 0, //grid操作按钮与Grid边的间距
        touchModel: Ext.supports.Touch,

        onFormReady: function () {
            var me = this,
                doc = Ext.getDoc();

            me.btnGridLeft = me.createHOverButton({
                bgimage: 'hoverbtn_gridl.gif'
            });

            me.btnGridRight = me.createHOverButton({
                bgimage: 'hoverbtn_gridr.gif'
            });

            me.btnBlockLeft = me.createHOverButton({
                bgimage: 'hoverbtn_gridl.gif'
            });

            me.btnBlockRight = me.createHOverButton({
                bgimage: 'hoverbtn_gridr.gif'
            });

            me.btnGridRight.on({
                click: function (e) {
                    this.clickArgs.grid.gridButtonClick(e, me.btnGridRight, this.clickArgs);
                }
            });

            me.btnGridLeft.on({
                click: function (e) {
                    this.clickArgs.grid.gridButtonClick(e, me.btnGridLeft, this.clickArgs);
                }
            });

            me.btnBlockRight.on({
                click: function (e) {
                    this.clickArgs.grid.blockButtonClick(e, me.btnBlockRight, this.clickArgs.blockIndex, this.clickArgs);
                }
            });

            me.btnBlockLeft.on({
                click: function (e) {
                    this.clickArgs.grid.blockButtonClick(e, me.btnBlockLeft, this.clickArgs.blockIndex, this.clickArgs);
                }
            });

            if (me.touchModel) {
                doc.on({
                    scope: me,
                    click: 'onTouch'
                });
            }
            else {
                doc.on({
                    scope: me,
                    mousemove: 'onMouseMove'
                });
            }
        },

        createHOverButton: function (config) {
            var me = this,
                el;

            if (!me.templateBtn) {
                me.templateBtn = new Ext.Template([
                    '<div class="yz-xform-grid-opt-cnt yz-xform-field-notprint" style="position:absoulte;cursor:pointer">',
                        '<a style="width:13px;height:22px;background-image:url({bgimage});display:block;cursor:pointer"/>',
                    '</div>',
                ]);
                me.templateBtn.compile();
            }

            config.bgimage = YZSoft.$url('YZSoft/forms/images/' + config.bgimage);
            el = me.templateBtn.append(Ext.getBody(), config, true);
            //在html中设置dissplay:none;top:-100px;height:-100px ie8显示不正确。
            el.setVisible(false);
            el.setXY([-100, -100]);
            return el;
        },

        onMouseMove: function (e) {
            var me = this;

            if (me.menuTrack)
                return;

            var xy = e.getXY(),
                point = { x: xy[0], y: xy[1] };

            var g = me.hitTestGrid(point),
                bi = -1;

            if (g)
                bi = me.hitTestBlock(g, point.y);

            me.setGridHOver(g, bi);
        },

        onTouch: function (e) {
            var me = this;

            if (me.menuTrack)
                return;

            var xy = e.getXY(),
                point = { x: xy[0], y: xy[1] };

            var g = me.hitTestGrid(point),
                bi = -1;

            if (g)
                bi = me.hitTestBlock(g, point.y);

            if (g && bi !=-1)
                me.setGridHOver(g, bi);
        },

        ptInRect: function (rc, pt) {
            return (pt.x >= rc.left && pt.x <= rc.right && pt.y >= rc.top && pt.y <= rc.bottom);
        },

        hitTestGrid: function (point) {
            var me = this;

            for (var i = me.agent.Eles.length - 1; i >= 0; i--) {
                var xel = me.agent.Eles[i];

                if (!xel.dom || !xel.isGrid)
                    continue;

                var et = xel.getEleType(),
                    gd = et.GridDefine;

                if (!gd || !gd.AllowAddRecord)
                    continue;

                var box = xel.getBox(false, false);

                if (gd.MenuDock == me.MenuDock.Left)
                    box.left -= gd.GridSelectAreaWidth;
                else
                    box.right += gd.GridSelectAreaWidth;

                if (me.ptInRect(box, point))
                    return xel;
            }
        },

        hitTestBlock: function (xel, y) {
            var me = this,
                rs = xel.dom.rows;

            for (var i = 0; i < rs.length; i++) {
                var box = Ext.fly(rs[i]).getBox(false, false);
                if (y >= box.top && y <= box.bottom)
                    return xel.getBlockIndexFromRow(i);
            }

            return -1;
        },

        clearGridHOver: function () {
            var me = this;

            me.hiddenGridHOver();
            me.curGrid = null;
        },

        hiddenGridHOver: function () {
            var me = this;

            me.btnGridLeft.setVisible(false);
            me.btnGridRight.setVisible(false);
            me.btnBlockLeft.setVisible(false);
            me.btnBlockRight.setVisible(false);
        },

        showAt: function (el, grid, rowIndex, dockLeft, forceShow) {
            var me = this,
                domrows = grid.dom.rows,
                rowCount = domrows.length,
                x, y;

            if (rowIndex < 0)
                return;

            if (rowCount == 0) {
                if (!forceShow)
                    return;
            }
            else {
                if (rowIndex >= rowCount)
                    return;
            }

            if (dockLeft) {
                if (!el.width) {
                    el.setXY([-100, -100]);
                    el.setVisible(true);
                    el.width = el.getWidth(false);
                    el.setVisible(false);
                }

                x = grid.getLeft(false) - el.width - me.gap;
            }
            else {
                x = grid.getRight(false) + me.gap;
            }

            if (rowCount != 0)
                y = Ext.fly(grid.dom.rows[rowIndex]).getTop(false);
            else
                y = Ext.fly(grid.dom).getTop(false);

            el.setXY([x, y]);
            el.setVisible(true);
        },

        setGridHOver: function (g, bi) {
            var me = this;

            //区域外
            if (!g) {
                if (me.curGrid)
                    me.clearGridHOver();
                return;
            }

            //没有改变
            if (me.curGrid && g == me.curGrid.grid && bi == me.curGrid.blockIndex)
                return;

            me.hiddenGridHOver();
            var et = g.getEleType();
            dockLeft = et.GridDefine.MenuDock == me.MenuDock.Left;

            var gridBtn = dockLeft ? me.btnGridLeft : me.btnGridRight;
            me.showAt(gridBtn, g, 0, dockLeft, true);

            gridBtn.clickArgs = {
                grid: g,
                blockIndex: bi
            };

            if (bi != -1) {
                var gridBtn = dockLeft ? me.btnBlockLeft : me.btnBlockRight,
                    rowIndex = g.getBlockStartRowIndex(bi);

                me.showAt(gridBtn, g, rowIndex, dockLeft, false);

                gridBtn.clickArgs = {
                    grid: g,
                    blockIndex: bi
                };
            }

            me.curGrid = { grid: g, blockIndex: bi };
        }
    },

    getBlockIndexFromRow: function (ri) {
        var me = this,
            et = me.getEleType(),
            da = et.GridDefine.DynamicArea,
            bi = Math.floor((ri - da.startRowIndex) / da.rows);

        return (bi < 0 || bi >= me.Blocks.length) ? -1 : bi;
    },

    getBlockStartRowIndex: function (blockIndex, dynamicArea) {
        var me = this;

        if (!dynamicArea)
            dynamicArea = me.getEleType().GridDefine.DynamicArea;

        return dynamicArea.startRowIndex + blockIndex * dynamicArea.rows;
    },

    getBlockEndRowIndex: function (blockIndex, dynamicArea) {
        var me = this;

        if (!dynamicArea)
            dynamicArea = me.getEleType().GridDefine.DynamicArea;

        return dynamicArea.startRowIndex + blockIndex * dynamicArea.rows + dynamicArea.rows - 1;
    },

    getBlockIndexFromRowIndex: function (rowIndex) {
        var me = this,
            da = me.getEleType().GridDefine.DynamicArea,
            rv;

        rv = Math.floor((rowIndex - da.startRowIndex) / da.rows);
        if (rv < 0 || rv >= me.Blocks.length)
            rv = -1;

        return rv;
    },

    gridButtonClick: function (e, btn, args) {
        var me = this,
            et = me.getEleType(),
            bc = me.Blocks.length;

        if (!me.gridMenu) {
            var appendBlock = new Ext.menu.Item({
                iconCls: 'appendblock',
                text: RS.$('Form_Grid_Append'),
                handler: function (item) {
                    me.appendBlock();
                }
            });

            var clearAll = new Ext.menu.Item({
                iconCls: 'delete',
                text: RS.$('Form_Grid_Clear'),
                handler: function (item) {
                    me.clearBlocks();
                }
            });

            me.gridMenu = new Ext.menu.Menu({
                cls: 'yz-grid-menu',
                shadow: false,
                minWidth: 80,
                items: [appendBlock, '-', clearAll],
                listeners: {
                    show: function () { YZSoft.forms.field.GridBase.menuTrack = true; },
                    hide: function () { YZSoft.forms.field.GridBase.menuTrack = false; }
                }
            });
        }

        me.gridMenu.items.getAt(2).setDisabled((bc <= 0) || (bc == 1 && et.GridDefine.ShowOneBlockAlways));

        me.gridMenu.showBy(btn);
        me.gridMenu.focus();
    },

    blockButtonClick: function (e, btn, blockIndex, args) {
        var me = this,
            et = me.getEleType(),
            bc = me.Blocks.length;

        if (!me.blockMenu) {
            var insertAbove = new Ext.menu.Item({
                iconCls: 'insertabove',
                text: RS.$('All_InsertAbove'),
                handler: function (item) {
                    me.insertBlockAbove(me.blockMenu.blockIndex);
                }
            });

            var insertBelow = new Ext.menu.Item({
                iconCls: 'insertbelow',
                text: RS.$('All_InsertBelow'),
                handler: function (item) {
                    me.insertBlockBelow(me.blockMenu.blockIndex);
                }
            });

            var appendCopy = new Ext.menu.Item({
                iconCls: 'appendcopy',
                text: RS.$('Form_Grid_AppendCopy'),
                handler: function (item) {
                    me.appendCopy(me.blockMenu.blockIndex);
                }
            });

            var copy = new Ext.menu.Item({
                iconCls: 'copy',
                text: RS.$('Form_Grid_Copy'),
                handler: function (item) {
                    et.CopyTable = me.agent.copyBlock(me.Blocks[me.blockMenu.blockIndex]);
                }
            });

            var paste = new Ext.menu.Item({
                iconCls: 'paste',
                text: RS.$('Form_Grid_Paste'),
                handler: function (item) {
                    me.pasteBlockCopy(me.blockMenu.blockIndex);
                }
            });

            var del = new Ext.menu.Item({
                iconCls: 'delete',
                text: RS.$('All_Delete'),
                handler: function (item) {
                    me.deleteBlocks(me.blockMenu.blockIndex, 1);
                }
            });

            me.blockMenu = new Ext.menu.Menu({
                cls: 'yz-grid-menu',
                shadow: false,
                minWidth: 80,
                items: [insertAbove, insertBelow, appendCopy, '-', copy, paste, '-', del],
                listeners: {
                    show: function () { YZSoft.forms.field.GridBase.menuTrack = true; },
                    hide: function () { YZSoft.forms.field.GridBase.menuTrack = false; }
                }
            });
        }

        var items = me.blockMenu.items;
        me.blockMenu.blockIndex = blockIndex;
        items.getAt(5).setDisabled(!et.CopyTable);
        items.getAt(7).setDisabled((bc <= 0) || (bc == 1 && et.GridDefine.ShowOneBlockAlways));

        me.blockMenu.showBy(btn);
        me.blockMenu.focus();
    },

    clearBlocks: function () {
        var me = this,
            et = me.getEleType(),
            gd = et.GridDefine;

        if (gd.ShowOneBlockAlways)
            me.deleteBlocks(1, me.Blocks.length - 1);
        else
            me.deleteBlocks(0, me.Blocks.length);
    },

    deleteBlocks: function (blockIndex, blockCount) {
        var me = this,
            ups = [];

        me.deleteBlocksPrivate(blockIndex, blockCount, ups);

        me.agent.expandUpdaters(ups);
        ups = me.agent.orderUpdaters(ups);
        me.agent.doUpdater(ups);
    },

    deleteRows: function (startRowIndex, count) {
        var me = this;

        for (var i = 0; i < count; i++)
            me.dom.deleteRow(startRowIndex);
    },

    deleteBlocksPrivate: function (blockIndex, blockCount, ups) {
        var me = this,
            et = me.getEleType(),
            gd = et.GridDefine,
            da = gd.DynamicArea;

        var c = (!blockCount || blockCount == -1) ? me.Blocks.length - blockIndex : blockCount;
        if (c == 0)
            return 0;

        var sri = me.getBlockStartRowIndex(blockIndex, da);
        var eri = me.getBlockEndRowIndex(blockIndex + c - 1, da);

        me.deleteRows(sri, eri - sri + 1);

        for (var i = 0; i < c; i++)
            me.agent.deleteBlockEles(me.Blocks[blockIndex + i]);

        for (var i = 0; i < c; i++)
            me.Blocks.splice(blockIndex, 1);

        me.agent.genDeleteBlockUpdaters(me, ups)
        me.agent.genLineNoUpdaters(me, blockIndex, ups);
        return c;
    },

    appendBlock: function (count) {
        return this.insertBlockCommon(0, null, true, count);
    },

    appendBlockPrivate: function (count, ups) {
        return this.insertBlockCommon(0, null, false, count, ups);
    },

    insertBlockCommon: function (type, blockIndex, update, count, ups) {
        var me = this,
            et = me.getEleType(),
            gd = et.GridDefine,
            da = gd.DynamicArea,
            count = count || 1;

        switch (type) {
            case 0: //append
                me.insertBlockPrivate(da.startRowIndex + me.Blocks.length * da.rows, count);
                blockIndex = me.Blocks.length - count;
                break;
            case 1: //insert above
                me.insertBlockPrivate(me.getBlockStartRowIndex(blockIndex, da), count);
                break;
            case 2: //insert below
                me.insertBlockPrivate(me.getBlockEndRowIndex(blockIndex, da) + 1, count);
                blockIndex = blockIndex + 1;
                break;
        }

        if (update)
            ups = ups || [];

        if (ups) {
            for (var i = 0; i < count; i++)
                me.agent.genInsertBlockUpdaters(me.Blocks[blockIndex + i], null, ups);
            me.agent.genLineNoUpdaters(me, blockIndex, ups);
        }

        if (update) {
            me.agent.expandUpdaters(ups);
            ups = me.agent.orderUpdaters(ups);
            me.agent.doUpdater(ups);
        }

        return blockIndex;
    },

    insertBlockPrivate: function (rowIndex, blockCount) {
        var me = this,
            et = me.getEleType(),
            gd = et.GridDefine,
            da = gd.DynamicArea;

        //创建模板
        var tdiv = document.createElement('div');
        tdiv.innerHTML = gd.strhtml;

        var ttab = tdiv.firstChild,
            trows = ttab.rows,
            rows = me.dom.rows,
            insBf = rowIndex < rows.length ? rows[rowIndex] : null,
            appBody = insBf ? null : (rows.length ? rows[rows.length - 1].parentNode : Ext.selectNode('tbody', me.dom) || me.dom);

        //执行插入
        for (var b = 0; b < blockCount; b++) {
            me.self.radioCounter = me.self.radioCounter ? me.self.radioCounter + 1 : 1;

            for (var r = 0; r < da.rows; r++) {
                var trow = trows[r],
                    nrow = trow.cloneNode(true);

                //解决IE Clone的BUG，不会Clone OPTION 的Selected属性
                var tels = trow.getElementsByTagName('SELECT');
                var nels = nrow.getElementsByTagName('SELECT');
                for (var i = 0; i < tels.length; i++) {
                    var tel = tels[i];
                    var nel = nels[i];
                    nel.value = tel.value;
                }

                //替换Radio名
                var nels = nrow.getElementsByTagName('INPUT');
                for (var i = 0; i < nels.length; i++) {
                    var nel = nels[i];
                    if (nel.type == 'radio') {
                        var nname = nel.name + '_' + me.self.radioCounter;
                        if (Ext.isIE && (Ext.isIE6 || Ext.isIE7)) {
                            var nxel = new YZSoft.forms.field.Element(me.agent, nel);
                            var rel = nxel.clone(nname);
                            nel.replaceNode(rel);
                        }
                        else {
                            nel.name = nname;
                        }
                    }
                }

                if (!insBf)
                    appBody.appendChild(nrow);
                else
                    insBf.parentNode.insertBefore(nrow, insBf);
            }

        }

        var bi = (rowIndex - da.startRowIndex) / da.rows;
        for (var b = 0; b < blockCount; b++) {
            var xels = me.getBlockElesDom(bi + b, true, true),
                newBlock = new YZSoft.forms.src.Block(me.agent);

            newBlock.ParentElement = this;
            me.Blocks.splice(bi + b, 0, newBlock);
            me.agent.buildXFormDOM(newBlock, xels);
        }
    },

    insertBlockAbove: function (blockIndex, count) {
        return this.insertBlockCommon(1, blockIndex, true, count);
    },

    insertBlockBelow: function (blockIndex, count) {
        return this.insertBlockCommon(2, blockIndex, true, count);
    },

    appendCopy: function (blockIndex) {
        var me = this,
            et = me.getEleType();

        et.CopyTable = me.agent.copyBlock(me.Blocks[blockIndex]);

        var ups = [],
            blockIndex = me.appendBlockPrivate(1, ups);

        me.pasteBlockCopyPrivate(blockIndex, ups);

        me.agent.expandUpdaters(ups);
        ups = me.agent.orderUpdaters(ups);
        me.agent.doUpdater(ups);

        return blockIndex;
    },

    pasteBlockCopyPrivate: function (blockIndex, ups) {
        var me = this,
            gt = me.getEleType(),
            gd = gt.GridDefine;

        if (!gt.CopyTable)
            return;

        me.agent.genInsertBlockUpdaters(me.Blocks[blockIndex], gt.CopyTable, ups);
    },

    pasteBlockCopy: function (blockIndex) {
        var me = this,
            ups = [];

        me.pasteBlockCopyPrivate(blockIndex, ups);

        me.agent.expandUpdaters(ups);
        ups = me.agent.orderUpdaters(ups);
        me.agent.doUpdater(ups);
    },

    setBlockCountPrivate: function (blockCount, ups) {
        var me = this;

        if (blockCount < 0)
            return;

        if (me.Blocks.length > blockCount)
            me.deleteBlocksPrivate(blockCount, me.Blocks.length - blockCount, ups);
        else if (this.Blocks.length < blockCount)
            me.appendBlockPrivate(blockCount - me.Blocks.length, ups);
    },

    saveGridDefine: function () {
        var me = this,
            gt = me.getEleType(),
            gd = gt.GridDefine,
            da = gd.DynamicArea,
            sidx = me.getBlockStartRowIndex(0, da);

        //获得写入表及LineNo信息
        var xels = me.Blocks[0].Eles;
        for (var j = 0; j < xels.length; j++) {
            var xel = xels[j],
                et = xel.getEleType();

            if (!gd.WriteToTable && et.DataBind && et.DataBind.DataColumn) {
                gd.WriteToTable = et.DataBind.DataColumn.ParentTable;

                var pg = gt.ParentBlock.ParentElement;
                gd.WriteToTable.ParentTable = (pg && pg.GridDefine) ? pg.GridDefine.WriteToTable : null;
                gd.WriteToTable.elType = gt;
            }

            if (!gd.LineNo && et.isGridLineNo)
                gd.LineNo = { Offset: j };
        }

        //绑定到的表为非可重复表则提示错误
        var dt = gd.WriteToTable;
        gd.AllowAddRecord = me.agent.Params.Model == me.agent.Models.Form ? true : false;
        if (dt) {
            gd.AllowAddRecord = dt.AllowAddRecord;
            if (!dt.IsRepeatable)
                YZSoft.Error.raise(RS.$('Form_Grid_BindNoRepeatableTable'), dt.TableName);

            var ds = gt.DataSource;
            if (ds && ds.Type == YZSoft.XForm.DSType.Table && String.Equ(ds.DataSource, dt.DataSource) && String.Equ(ds.TableName, dt.TableName) && !ds.Filter) {
                gt.DataSource = null;
            }
        }

        //保存动态区域定义
        var rows = me.dom.rows;
        gd.strhtml = '';
        for (var j = 0; j < da.rows; j++) {
            var row = rows[da.startRowIndex + j];
            gd.strhtml += me.self.outerHTML(row);
        }

        gd.strhtml = '<table>' + gd.strhtml + '</table>';
    },

    getBlockElesDom: function (blockIndex, filter, reg) {
        var me = this,
            elType = me.getEleType();

        if (!elType || !elType.GridDefine)
            return [];

        var d = elType.GridDefine.DynamicArea,
            startRowIndex = me.getBlockStartRowIndex(blockIndex, d),
            rvall = [],
            rows = this.dom.rows;

        for (var i = 0; i < d.rows; i++) {
            var row = rows[startRowIndex + i],
                domels = row.getElementsByTagName('*');

            rvall.push(row);
            for (var j = 0; j < domels.length; j++) //concat对domels不起作用
                rvall.push(domels[j]);
        }

        if (filter === false)
            return rvall;

        var rv = [];
        if (!reg) {
            for (var i = 0; i < rvall.length; i++) {
                var xel = me.agent.tryGetChechedEle(rvall[i]);
                if (xel)
                    rv.push(xel);
            }
        }
        else {
            for (var i = 0; i < rvall.length; i++) {
                if (me.self.hasEleType(rvall[i])) {
                    var xel = me.self.createElement(me.agent, rvall[i]),
                        et = xel.getEleType();

                    if (!et)
                        continue;

                    xel.onReady();
                    rv.push(xel);
                    me.agent.Eles.push(xel);
                    xel.elType = et;
                    xel.setXEleIndex(me.agent.Eles.length - 1);
                }
            }
        }

        return rv;
    },

    getBlockCountDom: function () {
        var me = this,
            et = me.getEleType();

        if (!et || !et.GridDefine)
            return 0;

        var d = et.GridDefine.DynamicArea;
        return (me.getRowCountDom() - d.startRowIndex - d.postFixRows) / d.rows;
    },

    getRowCountDom: function () {
        var rows = this.dom.rows;
        return rows ? rows.length : 0;
    }
});

YZSoft.forms.field.GridBase.agent = agent;

agent.on({
    ready: function () {
        YZSoft.forms.field.GridBase.onFormReady();
    }
});