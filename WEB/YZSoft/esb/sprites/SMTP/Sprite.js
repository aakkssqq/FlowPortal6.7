
Ext.define('YZSoft.esb.sprites.SMTP.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#5499c7'
            }
        }
    },
    sprites: {
        icon: {
            width: 32,
            height: 32
        }
    },
    properties: {
    },
    constProperties: {
        inputSchema: {
            To: {
                type: 'array',
                items: {
                    type:'object',
                    properties: {
                        Address: {
                            type: 'string'
                        },
                        DisplayName: {
                            type: 'string'
                        }
                    }
                }
            },
            CC: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        Address: {
                            type: 'string'
                        },
                        DisplayName: {
                            type: 'string'
                        }
                    }
                }
            },
            Bcc: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        Address: {
                            type: 'string'
                        },
                        DisplayName: {
                            type: 'string'
                        }
                    }
                }
            },
            Subject: {
                type: 'string'
            },
            Body: {
                type: 'string'
            },
            Attachments: {
                type: 'string'
            }
        }
    }
});
