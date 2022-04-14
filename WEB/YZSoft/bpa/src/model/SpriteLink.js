Ext.define('YZSoft.bpa.src.model.SpriteLink', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'FileID' },
        { name: 'SpriteID' },
        { name: 'FileName' },
        { name: 'SpriteName' },
        { name: 'FileExt' },
        { name: 'Attachment' },
        { name: 'LinkType' },
        { name: 'LinkedFileID' },
        { name: 'LinkedSpriteID' },
        { name: 'LinkedFileName' },
        { name: 'LinkedSpriteName' },
        { name: 'LinkedAttachment' }
    ]
});