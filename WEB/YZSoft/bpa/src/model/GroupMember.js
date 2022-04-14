Ext.define('YZSoft.bpa.src.model.GroupMember', {
    extend: 'Ext.data.Model',
    idProperty: 'UID',
    fields: [
        { name: 'GroupID' },
        { name: 'UID' },
        { name: 'Admin' }
    ],

    isOwner: function () {
        return String.Equ(this.data.Role, 'Owner');
    }
});