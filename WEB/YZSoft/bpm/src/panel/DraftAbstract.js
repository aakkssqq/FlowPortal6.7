
Ext.define('YZSoft.bpm.src.panel.DraftAbstract', {
    extend: 'Ext.panel.Panel',

    renderProcessName: function (value, metaData, record) {
        var text = Ext.String.format('<a href="#">{0}</a>', YZSoft.HttpUtility.htmlEncode(value));

        if (!String.Equ(record.data.Account, record.data.OwnerAccount)) {
            text += Ext.String.format('<span class="yz-s-uid yz-s-delegate-draft" uid="{0}">{1}</span>',
                Ext.util.Format.text(record.data.OwnerAccount),
                Ext.String.format(RS.$('All_DelegateInfo'), Ext.util.Format.text(record.data.OnwerShortName))            
            );
        }

        return text;
    },

    renderName: function (value, metaData, record) {
        metaData.tdCls = 'yz-grid-cell-td-pr-t1';
        return [
            YZSoft.HttpUtility.htmlEncode(value),
            '<div class="yz-grid-cell-boxwrapright">',
                '<div class="yz-grid-cell-box-action yz-s-rename yz-glyph yz-glyph-eab4"></div>',
            '</div>'
        ].join('');
    },

    onClickProcessName: function (view, cell, recordIndex, cellIndex, e) {
        if (e.getTarget().tagName == 'A')
            this.openForm(this.store.getAt(recordIndex));
    },

    onClickDraftName: function (view, cell, recordIndex, cellIndex, e) {
        var actionEl = e.getTarget('.yz-s-rename');
        if (actionEl) {
            this.cellEditing.startEditByPosition({
                row: recordIndex,
                column: cellIndex
            });
        }
    },

    openForm: function (record) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openDraft(record.data.DraftID, {
            sender: this,
            title: record.data.ProcessName,
            listeners: {
                scope: me,
                modified: function (name, data) {
                    me.store.reload();
                }
            }
        });
    },

    onValidateEdit: function (editor, context, eOpts) {
        var me = this,
            rec = context.record;

        if (context.originalValue == context.value)
            return;

        if (context.field != 'Name')
            return;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
            params: {
                method: 'UpdateDraftName',
                draftid: rec.getId(),
                newName: context.value
            },
            success: function (action) {
                rec.set('Name', context.value);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                context.cancel = true;
            }
        });
    }
});