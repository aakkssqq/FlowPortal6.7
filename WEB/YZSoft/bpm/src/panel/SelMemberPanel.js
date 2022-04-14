/*
config:
tree
grid
property:
tree
grid
*/

Ext.define('YZSoft.bpm.src.panel.SelMemberPanel', {
    extend: 'YZSoft.bpm.src.panel.SelUserPanel',
    requires: [
        'YZSoft.bpm.src.model.MemberExt'
    ],
    member: true,
    model: 'YZSoft.bpm.src.model.MemberExt',

    renderUser: function (value, metaData, record) {
        if (record.data.search) {
            return Ext.String.format([
                '<div data-qtip="{3}">',
                record.data.LeaderTitle ? RS.$('All_SelMember_Render_Leader') : RS.$('All_SelMember_Render_Member'),
                '</div >'].join(''),
                Ext.util.Format.text(record.data.ShortName),
                Ext.util.Format.text(record.data.parentouName),
                Ext.util.Format.text(record.data.LeaderTitle),
                Ext.util.Format.text(record.data.memberFriendlyName));
        }
        else
            return YZSoft.bpm.src.ux.Render.getUserFriendlyName(record.data.Account, record.data.DisplayName);
    }
});
