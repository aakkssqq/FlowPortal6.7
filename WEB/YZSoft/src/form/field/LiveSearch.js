
/*
config:
regExpMode
grid
properties auto
*/
Ext.define('YZSoft.src.form.field.LiveSearch', {
    extend: 'Ext.form.field.Text',
    requires: [
        'Ext.util.Filter'
    ],
    emptyText: RS.$('All_LiveSearch_EmptyText'),
    width: 260,
    cls: 'yz-field-livesearch',
    defaultStatusText: RS.$('All_LiveSearch_StatusText'),

    tagsRe: /<[^>]*>/gm,
    tagsProtect: '\x0f',

    caseSensitive: false,
    matchCls: 'yz-livesearch-match',

    matchStartReg: new RegExp('\x0e', 'g'),
    matchEndReg: new RegExp('\x0d', 'g'),

    triggers: {
        text: {
            cls: 'yz-trigger-msg',
            hidden: true
        },
        prev: {
            cls: 'yz-trigger-prev',
            width: 26,
            handler: 'onPreviousClick'
        },
        next: {
            cls: 'yz-trigger-next',
            width: 26,
            handler: 'onNextClick'
        }
    },

    constructor: function (config) {
        var me = this;

        me.callParent([config]);

        if (config.grid && config.grid.getStore()) {
            config.grid.getStore().on({
                load: function () {
                    me.clear();
                }
            });
        }
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.on('specialkey', function (f, e) {
            if (e.getKey() == e.ESC) {
                me.clear();
            }
        });
    },

    clear: function () {
        this.setValue('');
    },

    setStatus: function (msg) {
        var me = this,
            textTrigger = me.getTrigger('text'),
            el = new Ext.fly(textTrigger.el);

        if (msg.text) {
            textTrigger.show();
            el.setHtml(msg.text);
        }
        else {
            textTrigger.hide();
            el.setHtml('');
        }

        if (me.curcls != msg.cls) {
            if (me.curcls) {
                me.removeCls(me.curcls);
                delete me.curcls;
            }

            if (msg.cls) {
                me.curcls = msg.cls
                me.addCls(msg.cls);
            }
        }
        return;
    },

    getSearchValue: function (text) {
        var me = this,
            value = text;

        if (value === '') {
            return null;
        }
        if (!me.regExpMode) {
            value = Ext.String.escapeRegex(value);
        } else {
            try {
                new RegExp(value);
            } catch (error) {
                me.setStatus({
                    text: error.message,
                    iconCls: 'x-status-error'
                });
                return null;
            }
            // this is stupid
            if (value === '^' || value === '$') {
                return null;
            }
        }

        return value;
    },

    onPreviousClick: function () {
        var me = this,
            idx;

        if (me.indexes == undefined || me.currentIndex == undefined)
            return;

        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            idx = idx == 0 ? me.indexes.length - 1 : idx - 1;
            me.currentIndex = me.indexes[idx];

            me.selectRecord(me.currentIndex);

            me.setStatus({
                text: Ext.String.format(me.defaultStatusText, idx + 1, me.indexes.length),
                cls: 'yz-livesearch-status-valid'
            });
        }
    },

    onNextClick: function () {
        var me = this,
            idx;

        if (me.indexes == undefined || me.currentIndex == undefined)
            return;

        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            idx = idx == me.indexes.length - 1 ? 0 : idx + 1;
            me.currentIndex = me.indexes[idx];

            me.selectRecord(me.currentIndex);

            me.setStatus({
                text: Ext.String.format(me.defaultStatusText, idx + 1, me.indexes.length),
                cls: 'yz-livesearch-status-valid'
            });
        }
    },

    onChange: function (newVal) {
        var me = this,
            count = 0,
            grid = me.grid,
            store = grid.getStore(),
            view = grid.view,
            cellSelector = view.cellSelector,
            innerSelector = view.innerSelector;

        me.callParent(arguments);

        view.refresh();

        me.searchValue = me.getSearchValue(newVal);
        me.indexes = [];
        me.currentIndex = null;

        if (me.searchValue !== null) {
            me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));

            store.each(function (record, idx) {
                var td = Ext.fly(view.getNode(record)).down(cellSelector),
                    cell,
                    matches,
                    html;

                while (td) {
                    cell = td.down(innerSelector);

                    if (!cell.hasCls('x-grid-cell-inner-row-numberer')) {
                        html = cell.dom.innerHTML;
                        html = html.replace(/&nbsp;/g, ' ');

                        matches = html.match(me.tagsRe);
                        html = html.replace(me.tagsRe, me.tagsProtect);
                        html = Ext.util.Format.htmlDecode(html);

                        // populate indexes array, set currentIndex, and replace wrap matched string in a span
                        html = html.replace(me.searchRegExp, function (m) {
                            count += 1;
                            if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                                me.indexes.push(idx);
                            }
                            return '\x0e' + m + '\x0d';
                        });

                        html = Ext.util.Format.htmlEncode(html);

                        // restore protected tags
                        Ext.each(matches, function (match) {
                            html = html.replace(me.tagsProtect, match);
                        });

                        html = html.replace(me.matchStartReg, '<span class="' + me.matchCls + '">');
                        html = html.replace(me.matchEndReg, '</span>');

                        // update cell html
                        cell.dom.innerHTML = html;
                    }

                    td = td.next();
                }
            }, me);

            // results found
            if (me.indexes.length != 0) {
                me.currentIndex = me.indexes[0];
                me.selectRecord(me.currentIndex, false);

                me.setStatus({
                    text: Ext.String.format(me.defaultStatusText, 1, me.indexes.length),
                    cls: 'yz-livesearch-status-valid'
                });
            }
            else {
                me.setStatus({
                    text: Ext.String.format(me.defaultStatusText, 0, 0),
                    cls: 'yz-livesearch-status-nomatch'
                });
            }
        }
        else {
            me.setStatus({
                text: '',
                cls: 'yz-livesearch-status-nosearch'
            });
        }

        // no results found
        if (me.currentIndex === null) {
            grid.getSelectionModel().deselectAll();
        }

        me.focus();
    },

    selectRecord: function (index, focus) {
        var me = this,
            grid = me.grid,
            view = me.grid.getView(),
            rec = grid.getStore().getAt(index);

        grid.getSelectionModel().select(index);

        if (focus === false)
            view.scrollRowIntoView(rec, false);
        else
            view.focusNode(rec);
    }
});