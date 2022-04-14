
Ext.define('YZSoft.im.src.face.Faces', {
    singleton: true,
    qq: [
        { id: 'e100', text: RS.$('All_Face_e100') }, { id: 'e101', text: RS.$('All_Face_e101') }, { id: 'e102', text: RS.$('All_Face_e102') }, { id: 'e103', text: RS.$('All_Face_e103') }, { id: 'e104', text: RS.$('All_Face_e104') },
        { id: 'e105', text: RS.$('All_Face_e105') }, { id: 'e106', text: RS.$('All_Face_e106') }, { id: 'e107', text: RS.$('All_Face_e107') }, { id: 'e108', text: RS.$('All_Face_e108') }, { id: 'e109', text: RS.$('All_Face_e109') },
        { id: 'e110', text: RS.$('All_Face_e110') }, { id: 'e111', text: RS.$('All_Face_e111') }, { id: 'e112', text: RS.$('All_Face_e112') }, { id: 'e113', text: RS.$('All_Face_e113') }, { id: 'e114', text: RS.$('All_Face_e114') },
        { id: 'e115', text: RS.$('All_Face_e115') }, { id: 'e116', text: RS.$('All_Face_e116') }, { id: 'e117', text: RS.$('All_Face_e117') }, { id: 'e118', text: RS.$('All_Face_e118') }, { id: 'e119', text: RS.$('All_Face_e119') },
        { id: 'e120', text: RS.$('All_Face_e120') }, { id: 'e121', text: RS.$('All_Face_e121') }, { id: 'e122', text: RS.$('All_Face_e122') }, { id: 'e123', text: RS.$('All_Face_e123') }, { id: 'e124', text: RS.$('All_Face_e124') },
        { id: 'e125', text: RS.$('All_Face_e120') }, { id: 'e126', text: RS.$('All_Face_e126') }, { id: 'e127', text: RS.$('All_Face_e127') }, { id: 'e128', text: RS.$('All_Face_e138') }, { id: 'e129', text: RS.$('All_Face_e129') },
        { id: 'e130', text: RS.$('All_Face_e130') }, { id: 'e131', text: RS.$('All_Face_e131') }, { id: 'e132', text: RS.$('All_Face_e132') }, { id: 'e133', text: RS.$('All_Face_e133') }, { id: 'e134', text: RS.$('All_Face_e134') },
        { id: 'e135', text: RS.$('All_Face_e135') }, { id: 'e136', text: RS.$('All_Face_e136') }, { id: 'e137', text: RS.$('All_Face_e137') }, { id: 'e138', text: RS.$('All_Face_e138') }, { id: 'e139', text: RS.$('All_Face_e139') },
        { id: 'e140', text: RS.$('All_Face_e140') }, { id: 'e141', text: RS.$('All_Face_e141') }, { id: 'e142', text: RS.$('All_Face_e142') }, { id: 'e143', text: RS.$('All_Face_e143') }, { id: 'e144', text: RS.$('All_Face_e144') },
        { id: 'e145', text: RS.$('All_Face_e145') }, { id: 'e146', text: RS.$('All_Face_e146') }, { id: 'e147', text: RS.$('All_Face_e147') }, { id: 'e148', text: RS.$('All_Face_e148') }, { id: 'e149', text: RS.$('All_Face_e149') },
        { id: 'e150', text: RS.$('All_Face_e150') }, { id: 'e151', text: RS.$('All_Face_e151') }, { id: 'e152', text: RS.$('All_Face_e152') }, { id: 'e153', text: RS.$('All_Face_e153') }, { id: 'e154', text: RS.$('All_Face_e154') },
        { id: 'e155', text: RS.$('All_Face_e155') }, { id: 'e156', text: RS.$('All_Face_e156') }, { id: 'e157', text: RS.$('All_Face_e157') }, { id: 'e158', text: RS.$('All_Face_e158') }, { id: 'e159', text: RS.$('All_Face_e159') },
        { id: 'e160', text: RS.$('All_Face_e160') }, { id: 'e161', text: RS.$('All_Face_e161') }, { id: 'e162', text: RS.$('All_Face_e162') }, { id: 'e163', text: RS.$('All_Face_e163') }, { id: 'e164', text: RS.$('All_Face_e164') },
        { id: 'e165', text: RS.$('All_Face_e165') }, { id: 'e166', text: RS.$('All_Face_e166') }, { id: 'e167', text: RS.$('All_Face_e167') }, { id: 'e168', text: RS.$('All_Face_e168') }, { id: 'e169', text: RS.$('All_Face_e169') },
        { id: 'e170', text: RS.$('All_Face_e170') }, { id: 'e171', text: RS.$('All_Face_e171') }, { id: 'e172', text: RS.$('All_Face_e172') }, { id: 'e173', text: RS.$('All_Face_e173') }, { id: 'e174', text: RS.$('All_Face_e174') },
        { id: 'e175', text: RS.$('All_Face_e175') }, { id: 'e176', text: RS.$('All_Face_e176') }, { id: 'e177', text: RS.$('All_Face_e177') }, { id: 'e178', text: RS.$('All_Face_e178') }, { id: 'e179', text: RS.$('All_Face_e179') },
        { id: 'e180', text: RS.$('All_Face_e180') }, { id: 'e181', text: RS.$('All_Face_e181') }, { id: 'e182', text: RS.$('All_Face_e182') }, { id: 'e183', text: RS.$('All_Face_e183') }, { id: 'e184', text: RS.$('All_Face_e184') },
        { id: 'e185', text: RS.$('All_Face_e185') }, { id: 'e186', text: RS.$('All_Face_e186') }, { id: 'e187', text: RS.$('All_Face_e187') }, { id: 'e188', text: RS.$('All_Face_e188') }, { id: 'e189', text: RS.$('All_Face_e189') }
    ],

    getFaces: function (ids, faces) {
        var me = this,
            rv = [];

        faces = faces || Ext.Array.union(me.qq);

        Ext.Array.each(ids, function (id) {
            var face = me.getFaceFromId(id, faces);
            if (face)
                rv.push(face);
        });

        return rv;
    },

    getFaceFromId: function (id, faces) {
        var rv;

        faces = faces || Ext.Array.union(me.qq);

        Ext.Array.each(faces, function (face) {
            if (face.id == id) {
                rv = face;
                return false;
            }
        });

        return rv;
    }
});