
Ext.define('YZSoft.esb.sprites.WeChatWork.Sprite', {
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
            text: {
                type: 'object',
                properties: {
                    touser: {
                        type: 'string'
                    },
                    toparty: {
                        type: 'string'
                    },
                    totag: {
                        type: 'string'
                    },
                    text: {
                        type: 'object',
                        properties: {
                            content: {
                                type: 'string'
                            }
                        }
                    }
                }
            },
            textcard: {
                type: 'object',
                properties: {
                    touser: {
                        type: 'string'
                    },
                    toparty: {
                        type: 'string'
                    },
                    totag: {
                        type: 'string'
                    },
                    textcard: {
                        type: 'object',
                        properties: {
                            title: {
                                type: 'string'
                            },
                            description: {
                                type: 'string'
                            },
                            url: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        outputSchema: {
            Response: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    invaliduser: {
                        type: 'string'
                    }
                }
            }
        }
    }
});
