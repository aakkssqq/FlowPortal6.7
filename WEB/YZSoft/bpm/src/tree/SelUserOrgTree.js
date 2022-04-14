/*
config
getRootOUsType
srcoupath
perm
*/

Ext.define('YZSoft.bpm.src.tree.SelUserOrgTree', {
    extend: 'YZSoft.bpm.src.tree.OrgTree',
    treeRoot: {
        expanded: true,
        children: [{
            text: RS.$('All_Favorite_Contacts'),
            glyph: 0xeaef,
            leaf: true,
            nodeType: 'recentlyUser'
        }, {
            text: RS.$('All_Org'),
            glyph: 0xeaee,
            expandable: true,
            expanded: false,
            id: 'root'
        }]
    },

    onAfterRender: function (tree, eOpts) {
        var me = this,
            store = me.getStore(),
            sm = me.getSelectionModel(),
            orgRoot = store.getById('root');

        store.load({
            node: orgRoot,
            loadMask: $S.loadMask.first.loadMask,
            callback: function () {
                orgRoot.expand(false, function () {
                    var dirnode = store.findRecord('dirou', true);
                    if (dirnode) {
                        sm.select([dirnode]);
                        delete dirnode.data.dirou;
                    }
                });
            }
        });
    }
});